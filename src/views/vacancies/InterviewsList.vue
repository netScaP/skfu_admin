<template>
  <div class="app-container">
    <div class="top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4">
      <div class="filters" />
        <!-- <el-input
          v-model="filters.$search"
          placeholder="ФИО"
        />
        <el-button @click="onFilterClick">
          Применить
        </el-button>
      </div> -->
      <div class="add-button" />
    </div>
    <el-table
      v-loading="isLoading"
      :data="studentvacancies"
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
          <template v-if="scope.row.student">
            {{ scope.row.student.firstName }}
            {{ scope.row.student.lastName }}
          </template>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Телефон" 
        width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.student">
            {{ scope.row.student.phone }}
          </template>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Дата интервью" 
        width="200">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.interviewDate"
            type="datetime"
            placeholder="Дата интервью"
            @input="val => changeInterviewDate(scope.row.id, val)"
          />
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Статус" 
        width="200">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.interviewStatus"
            @input="val => changeInterviewStatus(scope.row.id, val)"
          >
            <el-option label="В ожидании" value="wait" />
            <el-option label="Успешно" value="success" />
            <el-option label="Неудачно" value="wait" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="Действия"
        width="400">
        <template slot-scope="scope">
          <div class="el-button-group">
            <router-link 
              :to="{ name: 'editStudent', params: { id: scope.row.studentId }}" 
              tag="button" 
              class="el-button el-button--default el-button--small" >Посмотреть профиль</router-link>
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
  name: 'StudentVacancies',

  mixins: [confirmUpdate],

  data() {
    return {
      studentvacancies: [],
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
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const studentvacanciesService = this.$apiClient.service('student-vacancy')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        $sort: { id: -1 },
      }

      Object.keys(this.filters).forEach(key => {
        if (this.filters[key]) {
          query[key] = this.filters[key]
        }
      })

      const response = await studentvacanciesService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.studentvacancies = data
      this.total = total

      this.isLoading = false
      return true
    },

    async changeInterviewDate(id, date) {
      const interviewService = this.$apiClient.service('student-vacancy')

      try {
        await interviewService.patch(id, {
          interviewDate: date,
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

    async changeInterviewStatus(id, status) {
      const interviewService = this.$apiClient.service('student-vacancy')

      try {
        await interviewService.patch(id, {
          interviewStatus: status,
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
  },
}
</script>
