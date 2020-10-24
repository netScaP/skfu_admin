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
            prop="firstName"
            label="Имя">
            <el-input v-model="form.firstName"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="lastName"
            label="Фамилия">
            <el-input v-model="form.lastName"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="E-mail">
            <el-input 
              v-model="form.email" 
              name="copanyName"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Номер телефона">
            <el-input
              v-model="maskedPhone"
              placeholder="+7 999 999-99-99" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
        <!-- <el-col :span="8">
          <el-form-item
            prop="specializationsIds"
            label="Специализации">
            <AsyncSelect
              service="specializations"
              label="name"
              :value="form.specializationsIds"
              :multiple="true"
              @value-changed="val => form.specializationsIds = val"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <h1>Образование студента</h1>
      <div v-for="(university, index) in form.universitiesIds" :key="index">
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="universityId"
              label="Университет">
              <AsyncSelect
                service="cities"
                label="name"
                :value="university.universityId"
                :multiple="false"
                @value-changed="val => setUniversity('universityId', val, index)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="specializationId"
              label="Специализация">
              <AsyncSelect
                service="specializations"
                label="name"
                :value="university.specializationId"
                :multiple="true"
                @value-changed="val => setUniversity('specializationId', val, index)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="universityId"
              label="Дата поступления">
              <el-date-picker
                v-model="university.enterDate"
                type="date"
                format="yyyy"
                placeholder="Выберите дату">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="universityId"
              label="Дата окончания">
              <el-date-picker
                v-model="university.endDate"
                type="date"
                format="yyyy"
                placeholder="Выберите дату">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="Описание"
        >
          <Markdown 
            :input="university.description"
            @on-update="val => setUniversity('description', val, index)"
          />
        </el-form-item>
      </div>
      <el-button
        type="primary"
        @click="() => form.universitiesIds.push({})">
        Добавить университет
      </el-button>
      
      <el-form-item
        label="Образование"
      >
        <Markdown 
          :input="form.education"
          @on-update="val => form.education = val"
        />
      </el-form-item>
      <el-form-item
        label="Опыт работы"
      >
        <Markdown 
          :input="form.job"
          @on-update="val => form.job = val"
        />
      </el-form-item>
      <el-form-item
        label="Дополнительные скилы"
      >
        <Markdown 
          :input="form.additionalSkills"
          @on-update="val => form.additionalSkills = val"
        />
      </el-form-item>
      <el-form-item
        label="Личные навыки"
      >
        <Markdown 
          :input="form.personalQualities"
          @on-update="val => form.personalQualities = val"
        />
      </el-form-item>
      <el-form-item
        label="Достижения"
      >
        <Markdown 
          :input="form.achievements"
          @on-update="val => form.achievements = val"
        />
      </el-form-item>
      <el-form-item
        v-if="!isEdit"
        prop="user"
        label="Пользователь">
        <el-col 
          :span="7">
          <el-input 
            v-model="form.user.email" 
            placeholder="Email пользователя"/>
        </el-col>
        <el-col
          v-if="!isEdit || isNewPassword"
          :span="7" 
          :offset="1">
          <el-input 
            v-model="form.user.password" 
            placeholder="Пароль"/>
        </el-col>
        <el-col
          v-if="!isEdit || isNewPassword"
          :span="2"
          :offset="1">
          <el-button
            type="primary"
            @click="generatePassword">
            Сгенерировать
          </el-button>
        </el-col>
        <el-col
          v-if="isEdit && !isNewPassword"
          :span="7"
          :offset="1">
          <el-button
            type="primary"
            @click="changePassword">
            Изменить пароль
          </el-button>
        </el-col>
      </el-form-item>
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
  </div>
</template>

<script>
import { AsYouType, parseIncompletePhoneNumber } from 'libphonenumber-js'

import validateForm from '@/mixins/validateForm'
import confirmUpdate from '@/mixins/confirmUpdate'
import cropUpload from '@/components/CropUpload'
import Markdown from '@/components/Markdown'
import AsyncSelect from '@/components/AsyncSelect'

export default {
  name: 'StudentForm',

  components: {
    Markdown,
    AsyncSelect,
  },

  mixins: [validateForm, confirmUpdate],

  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        description: '',
        specializationsIds: [],
        universitiesIds: [{}],
        isAvailable: true,
        // userId: ''
        user: {
          email: '',
          password: '',
        },
      },
      show: false,
      isEdit: false,
      rules: {
        name: [{ required: true, message: 'Введите название компании', trigger: 'blur' }],
        user: [
          {
            validator: (rule, value, callback) => {
              if (value.email === '' || !this.validateEmail(value.email)) {
                callback(new Error('Введите email владельца компании'))
              }
              if (value.password === '' && (!this.isEdit || this.isNewPassword)) {
                callback(new Error('Введите пароль владельца компании'))
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
      const studentService = this.$apiClient.service('students')
      const res = await studentService.get(this.$route.params.id)

      if (!res.user) {
        res.user = {
          email: '',
          password: '',
        }
      }
      if (!res.universitiesIds || res.universitiesIds.length === 0) {
        res.universitiesIds = [{}]
      }

      this.form = res
    },

    async onEdit() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      try {
        await this.confirmUpdate('Сохранить изменения компании?', 'Компания не изменена')
      } catch (err) {
        return false
      }

      const studentService = this.$apiClient.service('students')

      try {
        await studentService.patch(this.$route.params.id, {
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
        message: 'Компания изменена!',
        type: 'success',
      })

      this.$router.push({ name: 'Students' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const studentService = this.$apiClient.service('students')

      try {
        await studentService.create({
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
        message: 'Компания сохранена!',
        type: 'success',
      })

      this.$router.push({ name: 'Students' })
    },

    async onCancel() {
      try {
        await this.confirmUpdate(
          'Оменить изменения компании?',
          'Продолжайте редактирование компании'
        )
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Компания не изменена!',
        type: 'warning',
      })

      this.$router.push({ name: 'Students' })
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

    setUniversity(field, val, index) {
      this.form.universitiesIds[index][field] = val
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
