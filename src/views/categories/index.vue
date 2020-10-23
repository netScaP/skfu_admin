<template>
  <div class="app-container">
    <div class="top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4">
      <div class="filters" />
      <div class="add-button">
        <router-link 
          :to="{ name: 'addCategory' }">
          <el-button
            type="success"
            icon="el-icon-plus"
            circle />
        </router-link>
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      :data="categories"
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
        label="Приоритет" 
        width="200">
        <template slot-scope="scope">
          {{ scope.row.priority }}
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
              v-if="scope.row.active" 
              size="small" 
              @click="updateActive({active: false}, scope.row.id)">Deactivate
            </el-button>
            <router-link 
              :to="{ name: 'editCategory', params: { id: scope.row._id }}" 
              tag="button" 
              class="el-button el-button--default el-button--small" ><i class="el-icon-edit"/></router-link>
            <el-button 
              size="small" 
              @click="handleDelete(scope.row._id)"><i class="el-icon-delete"/></el-button>
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
  name: 'Categories',

  mixins: [ confirmUpdate ],

  data() {
    return {
      categories: [],
      isLoading: true,
      total: 1,
      limit: 10,
      page: 1
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const categoriesService = this.$apiClient.service('categories')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        $all: true,
        $defaultImage: true
      }

      const response = await categoriesService.find({
        query
      })

      const {
        data,
        total
      } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.categories = data
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
        await this.confirmUpdate('Точно удалить категорию?', 'Категория не удалена')
      } catch (err) {
        return false
      }

      await this.$apiClient.service('categories').remove(id)
      this.$message({
        message: 'Категория удалена!',
        type: 'success'
      })

      return await this.fetchData()
    }
  }

}
</script>
