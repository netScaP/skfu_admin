<template>
  <div class="app-container">
    <div class="top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4">
      <div class="filters">
        <el-input
          v-model="filters.$search"
          placeholder="ФИО"
        />
        <el-button @click="onFilterClick">
          Применить
        </el-button>
      </div>
      <div class="add-button" />
    </div>
    <el-table
      v-loading="isLoading"
      :data="students"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column 
        align="center" 
        label="ID" 
        width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Имя">
        <template slot-scope="scope">
          {{ scope.row.firstName }}
          {{ scope.row.lastName }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Телефон" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Теги" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.tags.join('; ') }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Дата рождения" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.birthDate | toDateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="Действия"
        width="400">
        <template slot-scope="scope">
          <div class="el-button-group">
            <el-button @click="() => openStudent(scope.row.id)"> 
              Посмотреть профиль
            </el-button>
            
            <el-popover
              placement="left"
              width="300"
              trigger="click"
            > 
              <el-date-picker
                v-model="scope.row.interviewDate"
                type="datetime"
                placeholder="Дата интервью"
                @input="val => createInterview(scope.row.id, val)"
              />
              <el-button 
                v-if="isEdit"
                slot="reference"
                size="small" 
                type="primary"
                @click="openPopup(scope.$index)">
                Пригласить на интервью
              </el-button>
            </el-popover />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[10, 20, 50]"
      background
      layout="sizes, prev, pager, next, total"
      @size-change="handleSizeChange"
      @current-change="fetchData"/>
  </div>
</template>

<script>
import confirmUpdate from '@/mixins/confirmUpdate'
import moment from 'moment'

export default {
  name: 'Students',

  mixins: [confirmUpdate],

  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      students: [],
      filters: {},
      isLoading: true,
      total: 1,
      limit: 10,
      page: 1,

      showPopup: false,
      studentId: null,
    }
  },

  filters: {
    toDateFormat(val) {
      return moment(val).format('YYYY-MM-DD')
    },
  },

  watch: {
    tags: {
      handler() {
        console.log('le')

        this.page = 1
        this.fetchData()
      },
      deep: true,
    },
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const studentsService = this.$apiClient.service('students')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        tags: this.tags,
        $sort: { id: -1 },
      }
      console.log(this.tags)

      Object.keys(this.filters).forEach(key => {
        if (this.filters[key]) {
          query[key] = this.filters[key]
        }
      })

      const response = await studentsService.find({
        query,
      })

      const { data, total } = response
      console.log(data)

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.students = data
      this.total = total

      this.isLoading = false
      return true
    },

    async createInterview(studentId, date) {
      if (!date) {
        return false
      }

      const interviewService = this.$apiClient.service('student-vacancy')

      try {
        await interviewService.create({
          interviewDate: date,
          studentId,
          vacancyId: this.$route.params.id,
        })
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
        })
        return false
      }

      this.$message({
        message: 'Интервью сохранено!',
        type: 'success',
      })

      this.fetchData()
    },

    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.fetchData()
    },

    onFilterClick() {
      this.page = 1
      this.fetchData()
    },

    openPopup(studentId) {
      this.showPopup = true
      this.studentId = studentId
    },

    openStudent(studentId) {
      let routeData = this.$router.resolve({ name: 'editStudent', params: { id: studentId } })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>
