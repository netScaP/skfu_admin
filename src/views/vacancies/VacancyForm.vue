<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
      label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="title"
            label="Заголовок">
            <el-input v-model="form.title"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Опыт работы">
            <el-select v-model="form.workingRate">
              <el-option label="0.5" value="0.5" />
              <el-option label="1" value="1" />
              <el-option label="1.5" value="1.5" />
              <el-option label="2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Зарплата от">
            <el-input-number
              v-model="form.salaryFrom" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="Зарплата до">
            <el-input-number
              v-model="form.salaryTo" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Рабочая ставка">
            <el-input-number
              v-model="form.workingRate" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="Статус">
            <el-select
              v-model="form.status">
              <el-option label="Активна" value="available" />
              <el-option label="Закрыта" value="closed" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="Описание"
      >
        <Markdown 
          :input="form.description"
          @on-update="val => form.description = val"
        />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="companyId"
            label="Компании">
            <AsyncSelect
              service="companies"
              label="name"
              :value="form.companyId"
              :multiple="false"
              @value-changed="val => form.companyId = val"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" />
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="tags"
            label="Теги">
            <Tags
              :tags="form.tags"
              @new-tag="addTag"
              @delete-tag="deleteTag"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="cityId"
            label="Город">
            <AsyncSelect
              service="cities"
              label="name"
              :value="form.cityId"
              :multiple="false"
              @value-changed="val => form.cityId = val"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="onEdit">
          Изменить
        </el-button>
        <el-button
          v-if="!isEdit"
          type="primary"
          @click="onAdd">
          Cохранить
        </el-button>
        <el-button @click="onCancel">Отмена</el-button>
      </el-form-item>
    </el-form>

    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane label="Студенты" name="students">
        <Students :tags="form.tags" :is-edit="isEdit" />
      </el-tab-pane>

      <el-tab-pane v-if="isEdit" label="Интервью" name="interviews">
        <Interviews />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { AsYouType, parseIncompletePhoneNumber } from 'libphonenumber-js'

import validateForm from '@/mixins/validateForm'
import confirmUpdate from '@/mixins/confirmUpdate'
import cropUpload from '@/components/CropUpload'
import Markdown from '@/components/Markdown'
import AsyncSelect from '@/components/AsyncSelect'
import Tags from '@/components/Tags'
import Students from './StudentsList'
import Interviews from './InterviewsList'

export default {
  name: 'VacancyForm',

  components: {
    Markdown,
    AsyncSelect,
    Tags,
    Students,
    Interviews,
  },

  mixins: [validateForm, confirmUpdate],

  data() {
    return {
      form: {
        title: '',
        description: '',
        tags: [],
        // userId: ''
      },
      activeTab: 'students',
      show: false,
      isEdit: false,
      rules: {
        name: [{ required: true, message: 'Введите название вакансии', trigger: 'blur' }],
        user: [
          {
            validator: (rule, value, callback) => {
              if (value.email === '' || !this.validateEmail(value.email)) {
                callback(new Error('Введите email владельца вакансии'))
              }
              if (value.password === '' && (!this.isEdit || this.isNewPassword)) {
                callback(new Error('Введите пароль владельца вакансии'))
              }
              if (
                value.password &&
                value.password.length < 4 &&
                (!this.isEdit || this.isNewPassword)
              ) {
                callback(new Error('Пароль должен быть минимум из 4 символов'))
              }
              callback()
            },
            trigger: 'blur',
          },
          { required: true, trigger: 'blur' },
        ],
      },
      isNewPassword: false,
    }
  },

  computed: {
    maskedPhone: {
      get() {
        return new AsYouType('RU').input(this.form.phone)
      },
      set(value) {
        const parsedPhone = parseIncompletePhoneNumber(value)
        if (value.length === 2 && value.substring(0, 2) !== '+7') {
          this.form.phone = '+7'
        } else if (value.length === 1 && value.substring(0, 1) !== '+') {
          this.form.phone = `+7${value}`
        } else if (parsedPhone.length > 13) {
          // with > 12 or >= 13 doesn't work)
          this.form.phone = parsedPhone.substring(0, 12)
        } else {
          this.form.phone = parsedPhone
        }
      },
    },
  },

  mounted() {
    if (this.$route.params.id) {
      this.isEdit = true
      this.fetchData()
    }
  },

  methods: {
    async fetchData() {
      const vacancyService = this.$apiClient.service('vacancies')
      const res = await vacancyService.get(this.$route.params.id)

      this.form = res
    },

    async onEdit() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      try {
        await this.confirmUpdate('Сохранить изменения вакансии?', 'Вакансия не изменена')
      } catch (err) {
        return false
      }

      const vacancyService = this.$apiClient.service('vacancies')

      try {
        await vacancyService.patch(this.$route.params.id, {
          ...this.form,
        })
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
        })
        return false
      }

      this.$message({
        message: 'Вакансия изменена!',
        type: 'success',
      })

      this.$router.push({ name: 'Vacancies' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const vacancyService = this.$apiClient.service('vacancies')

      try {
        await vacancyService.create({
          ...this.form,
        })
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
        })
        return false
      }

      this.$message({
        message: 'Вакансия сохранена!',
        type: 'success',
      })

      this.$router.push({ name: 'Vacancies' })
    },

    async onCancel() {
      try {
        await this.confirmUpdate(
          'Оменить изменения вакансии?',
          'Продолжайте редактирование вакансии'
        )
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Вакансия не изменена!',
        type: 'warning',
      })

      this.$router.push({ name: 'Vacancies' })
    },

    handleImageDataUrl(url) {
      this.imageUrl = url
    },

    toggleShow() {
      this.show = !this.show
    },

    generatePassword() {
      this.form.user.password = '' + Math.floor(Math.random() * 100000)
    },

    changePassword() {
      this.isNewPassword = true
      this.$set(this.form.user, 'password', null)
    },

    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ //eslint-disable-line
      return re.test(String(email).toLowerCase())
    },

    addTag(tag) {
      this.form.tags.push(tag)
    },
    deleteTag(tag) {
      const index = this.form.tags.findIndex(e => e === tag)
      if (index > -1) {
        this.form.tags.splice(index, 1)
      }
    },
  },
}
</script>

<style>
.line {
  text-align: center;
}
.avatar-uploader {
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-button {
  margin-top: 15px;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
