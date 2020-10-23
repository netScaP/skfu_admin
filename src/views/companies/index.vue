<template>
  <div class="app-container">
    <div class="top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4">
      <div class="filters" />
      <div class="add-button">
        <router-link 
          :to="{ name: 'addCompany' }">
          <el-button
            type="success"
            icon="el-icon-plus"
            circle />
        </router-link>
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      :data="companies"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column 
        align="center" 
        label="ID" 
        width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Название">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
        label="Email" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="Активный" 
        width="150">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.isAvailable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled/>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Действия"
        width="470">
        <template slot-scope="scope">
          <div class="el-button-group">
            <el-button 
              size="small" 
              @click="handleGoToWithCompany('Products', scope.row._id)">
              Продукты
            </el-button>
            <el-button 
              size="small" 
              @click="handleGoToWithCompany('Ingredients', scope.row._id)">
              Ингредиенты
            </el-button>
            <el-button 
              size="small" 
              @click="handleGoToWithCompany('Points', scope.row._id)">
              Точки
            </el-button>
            <el-button 
              size="small" 
              @click="handleGoToWithCompany('Orders', scope.row._id)">
              Заказы
            </el-button>
            <router-link 
              :to="{ name: 'editCompany', params: { id: scope.row.id }}" 
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
import { mapActions } from 'vuex'

import confirmUpdate from '@/mixins/confirmUpdate'

export default {
  name: 'Companies',

  mixins: [confirmUpdate],

  data() {
    return {
      companies: [],
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
    ...mapActions('companies', ['setCompanyId']),

    async fetchData() {
      const companiesService = this.$apiClient.service('companies')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
      }

      const response = await companiesService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.companies = data
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
        await this.confirmUpdate('Точно удалить компанию?', 'Компания не удалена')
      } catch (err) {
        return false
      }

      await this.$apiClient.service('companies').remove(id)
      this.$message({
        message: 'Компания удалена!',
        type: 'success',
      })

      return await this.fetchData()
    },

    handleGoToWithCompany(pathName, companyId) {
      this.setCompanyId(companyId)
      this.$router.push({
        name: pathName,
      })
    },
  },
}
</script>
