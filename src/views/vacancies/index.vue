<template>
  <div class="app-container">
    <div class="top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4">
      <div class="filters">
        <el-input
          v-model="filters.salaryFrom"
          label="Зарплата от"
          placeholder="Зарплата от"
        />
        <el-input
          v-model="filters.experience"
          placeholder="Минимальный опыт работы"
        />
        <el-select v-model="filters.workingRate" placeholder="Рабочая ставка">
          <el-option label="0.5" value="0.5" />
          <el-option label="1" value="1" />
          <el-option label="1.5" value="1.5" />
          <el-option label="2" value="2" />
        </el-select>
        <el-button @click="onFilterClick">
          Применить
        </el-button>
      </div>
      <div class="add-button">
        <router-link 
          :to="{ name: 'addVacancy' }">
          <el-button
            type="success"
            icon="el-icon-plus"
            circle />
        </router-link>
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      :data="vacancies"
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
        label="Заголовок">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Зарплата" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.salaryFrom }}
          -
          {{ scope.row.salaryTo }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Опыт работы" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.experience }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="Действия"
        width="200">
        <template slot-scope="scope">
          <div class="el-button-group">
            <router-link 
              :to="{ name: 'editVacancy', params: { id: scope.row.id }}" 
              tag="button" 
              class="el-button el-button--default el-button--small" ><i class="el-icon-edit"/></router-link>
            <el-button 
              size="small" 
              @click="handleDelete(scope.row.id)"><i class="el-icon-delete"/></el-button>
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

export default {
  name: 'Vacancies',

  mixins: [confirmUpdate],

  data() {
    return {
      vacancies: [],
      filters: {},
      isLoading: true,
      total: 1,
      limit: 10,
      page: 1,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const vacanciesService = this.$apiClient.service('vacancies')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
      }

      Object.keys(this.filters).forEach(key => {
        if (this.filters[key]) {
          if (key === 'salaryFrom') {
            query.salaryFrom = { $gte: this.filters[key] }
          } else if (key === 'experience') {
            query.experience = { $gte: this.filters[key] }
          } else {
            query[key] = this.filters[key]
          }
        }
      })
      const response = await vacanciesService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.vacancies = data
      this.total = total

      this.isLoading = false
      return true
    },

    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.fetchData()
    },

    updateActive() {},

    async handleDelete(id) {
      try {
        await this.confirmUpdate('Точно удалить вакансию?', 'Вакансия не удалена')
      } catch (err) {
        return false
      }

      await this.$apiClient.service('vacancies').remove(id)
      this.$message({
        message: 'Вакансия удалена!',
        type: 'success',
      })

      return await this.fetchData()
    },

    onFilterClick() {
      this.page = 1
      this.fetchData()
    },
  },
}
</script>
