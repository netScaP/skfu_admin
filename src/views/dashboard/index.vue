<template>
  <div class="dashboard-container">
    <el-row class="top-menu">
      <el-col :offset="1">
        <span class="text-style">Информация по компании: </span>
        <el-select 
          v-if="userType === 'admin'"
          :value="activeCompanyId"
          placeholder="Компания"
          clearable
          @change="handleChangeCompany">
          <el-option
            v-for="item in companies"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
        <el-select
          v-if="activeCompanyId"
          :value="activePointId"
          placeholder="Точка"
          clearable
          @change="handleChangePoint">
          <el-option
            v-for="item in availablePoints"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
        <excel-export
          style="margin-top: 20px;"/>
        <div class="dates">
          <span class="text-style">Данные за: </span>
          <el-date-picker
            v-model="dateRange"
            :picker-options="pickerOptions"
            :clearable="false"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            @change="handleDateRangeChagne"/>
        </div>
      </el-col>
    </el-row>
    <div class="stats">
      <div class="line-charts">
        <el-row>
          <vue-element-loading
            :active="isLoading"
            spinner="bar-fade-scale"/>
          <p class="center-text text-style">Динамика заказов по точке/сети</p>
          <line-chart
            :chart-data="transformToLineChart('quantity')" />
        </el-row>
        <el-row>
          <vue-element-loading
            :active="isLoading"
            spinner="bar-fade-scale"/>
          <p
            v-if="lineChartData.company && lineChartData.company.average" 
            class="center-text text-style">
            Общий средний чек - 
            <span v-if="lineChartData.company.average.length > 0">{{ Math.round(countSum(lineChartData.company.average) / lineChartData.company.average.length) }} </span>
            <span v-else>0 </span>
            ₽
          </p>
          <p class="center-text text-style average-check">Динамика изменения среднего чека по точке/сети</p>
          <line-chart
            :chart-data="transformToLineChart('average')" />
        </el-row>
      </div>
      
      <div class="common">
        <template
          v-if="activePointId">
          <div class="pie">
            <p class="center-text text-style">Разбиение по типу недовольства в кофейне</p>
            <pie-chart
              :chart-data="transformToPieChart(pieRatings.quantity.byNegativeRatings)" />
          </div>
          <div class="pie">
            <p class="center-text text-style">Средняя оценка по кофейне</p>
            <div class="star-rating">
              <p class="card-panel-text text-style margin-left">
                <star-rating
                  :rating="pieRatings.quantity && pieRatings.quantity.averageRatings ? pieRatings.quantity.averageRating[0].average : 0"
                  :read-only="true"
                  :star-size="25"
                  :show-rating="false"
                  :increment="0.01"
                  style="display: block;"
                  active-color="#ffac33" />
              </p>
            </div>
          </div>
        </template>
        <div class="pie">
          <p class="center-text text-style">Разбиение по количеству заказов</p>
          <p class="text-style sum-text">Количество заказов - {{ countSum(pieOrders.quantity.byPoints) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byPoints)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Разбиение по количеству отмененных заказов</p>
          <p class="text-style sum-text">Количество заказов - {{ countSum(pieOrders.quantity.byClosed) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byClosed)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Разбиение по способу оплаты заказов</p>
          <p class="text-style sum-text">Количество заказов - {{ countSum(pieOrders.quantity.byPaymentType) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byPaymentType)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Разбиение по способу доставки</p>
          <p class="text-style sum-text">Количество заказов - {{ countSum(pieOrders.quantity.byDeliveryType) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byDeliveryType)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Стоимость заказанных товаров</p>
          <p class="text-style sum-text">Общая прибыль - {{ countSum(pieOrders.price.byPoints) }} ₽</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.price.byPoints)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Стоимость выполненных заказов</p>
          <p class="text-style sum-text">Общая прибыль - {{ countSum(pieOrders.price.byClosed) }} ₽</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.price.byClosed)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Разбиение выполненных заказов по типу оплаты</p>
          <p class="text-style sum-text">Общая прибыль - {{ countSum(pieOrders.price.closedByPaymentType) }} ₽</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.price.closedByPaymentType)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Разбиение по категориям</p>
          <p class="text-style sum-text">Количество заказанных продуктов - {{ countSum(pieOrders.quantity.byCategories) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byCategories)"/>
        </div>
        <div class="pie">
          <p class="center-text text-style">Разбиение по продуктам</p>
          <p class="text-style sum-text">Количество заказанных продуктов - {{ countSum(pieOrders.quantity.byProducts) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byProducts)" />
        </div>
        <div class="pie">
          <p class="center-text text-style">Стоимость закзанных продуктов по категориям</p>
          <p class="text-style sum-text">Общая прибыль - {{ countSum(pieOrders.price.byCategories) }} ₽</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.price.byCategories)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import VueElementLoading from 'vue-element-loading'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

import ExcelExport from '@/components/ExcelExport'

import LineChart from './components/LineChart'
import PieChart from './components/PieChart'

export default {
  name: 'Dashboard',

  components: {
    StarRating,
    VueElementLoading,
    ExcelExport,
    LineChart,
    PieChart
  },

  data() {
    return {
      pieOrders: {
        quantity: { byPoints: [], byClosed: [], byPaymentType: [], byDeliveryType: [], byProducts: [], byCategories: [] },
        price: { byPoints: [], byClosed: [], closedByPaymentType: [], byCategories: [] }
      },
      pieRatings: {
        quantity: { byNegativeRatings: [], averageRating: [] }
      },
      dateRange: [moment().add(-1, 'M'), moment()],
      pickerOptions: {
        shortcuts: [{
          text: 'Last day',
          onClick(picker) {
            const end = new Date()
            this.period = 'Last day'
            picker.$emit('pick', [end, end])
          }
        },
        {
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.period = 'Last week'
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            this.period = 'Last month'
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            this.period = 'Last 3 months'
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'All time',
          onClick(picker) {
            this.period = 'All time'
            picker.$emit('pick', ['', ''])
          }
        }]
      },
      companies: [],
      lineChartData: {
        company: {},
        point: {}
      },
      translates: {
        card: 'Картой',
        cash: 'Наличными',
        car: 'К машине',
        leg: 'Самовызов',
        wrong_order: 'Несоответствие заказа или стоимости',
        quality: 'Качество продуктов',
        time: 'Время приготовления',
        service: 'Обслуживание',
        other: 'Другое'
      },
      chartBy: 'month',
      averageChartBy: 'month',
      isLoading: true
    }
  },

  computed: {
    ...mapGetters({
      activeCompanyId: 'companies/activeCompanyId',
      activePointId: 'companies/activePointId',
      availablePoints: 'companies/availablePoints',
      roles: 'user/roles',
      userType: 'user/userType',
      email: 'user/email'
    })
  },

  mounted() {
    this.fetchData()

    if(this.userType == 'admin'){
      this.isAdmin = true
      this.fetchCompanies()
    }

    if (this.userType === 'company') {
      if (!this.availablePoints || this.availablePoints.length === 0) {
        this.fetchPointsByCompany()
      }
    }
  },

  methods: {
    ...mapActions({
      'setCompanyId': 'companies/setCompanyId',
      'fetchPointsByCompany': 'companies/fetchPointsByCompany',
      'setPointId': 'companies/setPointId'
    }),

    handleDateRangeChagne() {
      this.fetchData()

      if (moment(this.dateRange[1]).diff(moment(this.dateRange[0]), 'days') === 0) {
        this.chartBy = 'day'
        this.averageChartBy = 'day'
      } else {
        this.chartBy = 'month'
        this.averageChartBy = 'month'
      }
    },

    async fetchData() {
      this.isLoading = true

      await this.fetchOrdersLineData()

      await this.fetchOrders()
      this.fetchRatings()

      this.isLoading = false
    },

    async fetchCompanies() {
      const res = await this.$apiClient.service('companies').find({
        query: {
          $limit: -1,
          $all: true
        }
      })
      this.companies = res
    },

    async fetchOrders() {
      const dashboardService = this.$apiClient.service('dashboard')

      const query = {
        companyId: this.activeCompanyId,
        $sort: {
          createdAt: 1
        }
      }

      if (this.dateRange && this.dateRange[0] !== '' && this.dateRange[1] !== '') {
        query.createdAt = {
          $gte: moment(this.dateRange[0]).format('YYYY-MM-DD'),
          $lte: moment(this.dateRange[1]).add(1, 'days').format('YYYY-MM-DD')
        }
      }

      this.pieOrders = await dashboardService.get('pie-orders', { query })
    },

    async fetchRatings() {
      const dashboardService = this.$apiClient.service('dashboard')

      const query = {
        companyId: this.activeCompanyId,
        $sort: {
          createdAt: 1
        }
      }

      if (this.dateRange && this.dateRange[0] !== '' && this.dateRange[1] !== '') {
        query.createdAt = {
          $gte: moment(this.dateRange[0]).format('YYYY-MM-DD'),
          $lte: moment(this.dateRange[1]).add(1, 'days').format('YYYY-MM-DD')
        }
      }

      this.pieRatings = await dashboardService.get('pie-ratings', { query })
    },

    async fetchOrdersLineData() {
      const dashboardService = this.$apiClient.service('dashboard')

      const query = {
        companyId: this.activeCompanyId,
        $sort: {
          createdAt: -1
        }
      }

      if (this.dateRange && this.dateRange[0] !== '' && this.dateRange[1] !== '') {
        query.createdAt = {
          $gte: moment(this.dateRange[0]).format('YYYY-MM-DD'),
          $lte: moment(this.dateRange[1]).add(1, 'days').format('YYYY-MM-DD')
        }
      }

      const newLineChartData = {}
      newLineChartData.company = await dashboardService.get('line-orders', { query })
      if (this.activePointId) {
        delete query.companyId
        query.pointId = this.activePointId

        newLineChartData.point = await dashboardService.get('line-orders', { query })
      }

      this.lineChartData = newLineChartData
    },
    
    handleChangeCompany(companyId) {
      const val = companyId === '' ? undefined : companyId
      this.setCompanyId(val)
      this.setPointId(undefined)
      this.fetchData()
    },

    handleChangePoint(pointId) {
      const val = pointId === '' ? undefined : pointId
      this.setPointId(val)
      this.fetchOrdersLineData()
    },

    transformToPieChart(arr) {
      const chartValues = {}
      const seriesArr = []
      const legendArr = []

      if (arr.length === 0) {
        chartValues.x = {
          name: 'Нет данных',
          total: 0
        }
        seriesArr.push({ value: 0, name: 'Нет данных' })
        legendArr.push('Нет данных')
        return { seriesArr, legendArr }
      }

      arr.forEach(e => {
        const legendName = this.translates[e._id] ? this.translates[e._id] : e._id
        legendArr.push(legendName)
        seriesArr.push({
          value: e.count,
          name: legendName
        })
      })

      return { seriesArr, legendArr }
    },

    transformToLineChart(field) {
      let dates = {}
      let companyDates = {}
      let pointDates = {}

      const companyField = this.lineChartData.company && this.lineChartData.company[field] ? this.lineChartData.company[field] : []
      const pointField = this.lineChartData.point && this.lineChartData.point[field] ? this.lineChartData.point[field] : []

      const selectedRange = [...this.dateRange]
      if ((selectedRange[0] === '' || !selectedRange[0]) && companyField.length !== 0) {
        selectedRange[0] = companyField && companyField[0] ? companyField[0]._id : new Date()
      }
      
      if (this.chartBy === 'month') {
        dates = this.countDaysInMonth(selectedRange)
      } else if (this.chartBy === 'day') {
        dates = this.countHours()
      }

      companyDates = Object.assign({}, dates, ...companyField.map(e => ({ [e._id]: e.count })))
      pointDates = Object.assign({}, dates, ...pointField.map(e => ({ [e._id]: e.count })))

      const companyName = this.getCompanyName()
      const pointName = this.getPointName()
      return {
        dates: Object.keys(dates),
        quantities: {
          company: {
            name: companyName,
            data: Object.values(companyDates)
          },
          point: {
            name: pointName,
            data: Object.values(pointDates)
          }
        }
      }
    },

    countSum(arr) {
      return arr.reduce((acc, e) => acc += +e.count, 0)
    },

    countDaysInMonth(selectedRange) {
      const currentDate = moment(selectedRange[0], 'DD-MM-YYYY')
      const endDate = selectedRange[1] !== '' ? moment(selectedRange[1]) : moment()

      const dates = {}
      dates[currentDate.format('DD-MM-YYYY')] = 0
      while (currentDate.add(1, 'days').diff(endDate) <= 0) {
        dates[currentDate.format('DD-MM-YYYY')] = 0
      }

      return dates
    },

    countHours() {
      const hours = {}
      for (let i = 1; i < 25; i++) {
        hours[i] = 0
      }
      return hours
    },

    getPointName() {
      const point = this.availablePoints.find(point => {
        if (!point._id || !this.activePointId) {
          return false
        }
        return point._id.toString() === this.activePointId.toString()
      })
      return point ? `Точка ${point.name}`: 'Точка'
    },

    getCompanyName() {
      const company = this.companies.find(company => {
        if (!company._id || !this.activeCompanyId) {
          return false
        }
        return company._id.toString() === this.activeCompanyId.toString()
      })
      return company ? `Сеть ${company.name}` : 'Сеть'
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top-menu {
  margin-bottom: 30px;
}

.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}


.common, .point-info {
  display: flex;
  flex-wrap: wrap;
  padding-left: 3%;
}
.pie {
  width: 30%;
  margin-right: 3%;
  display: flex;
  flex-direction: column;
}
.point-stats {
  margin-top: 30px;
}
.star-rating {
  align-self: center;
}

.sum-text {
  text-align: center;
  margin-top: 0px;
}
.center-text {
  text-align: center;
  margin-top: 40px;
}
.average-check {
  margin-top: 0px;
}

.text-style {
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  font-weight: bold;
}

.margin-left {
  margin-left: 15px;
}
</style>
