<template>
  <div class="wrapper">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="name" label="Название">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="E-mail">
            <el-input v-model="form.email" name="copanyName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Номер телефона">
            <el-input v-model="maskedPhone" placeholder="+7 999 999-99-99" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="citiesIds" label="Город">
            <AsyncSelect
              service="cities"
              label="name"
              :value="form.citiesIds"
              :multiple="true"
              @value-changed="val => (form.citiesIds = val)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Описание">
        <Markdown :input="form.description" @on-update="val => (form.description = val)" />
      </el-form-item>
      <el-form-item label="Активный">
        <el-switch v-model="form.isAvailable" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item v-if="!isEdit" prop="user" label="Пользователь">
        <el-col :span="7">
          <el-input v-model="form.user.email" placeholder="Email пользователя" />
        </el-col>
        <el-col v-if="!isEdit || isNewPassword" :span="7" :offset="1">
          <el-input v-model="form.user.password" placeholder="Пароль" />
        </el-col>
        <el-col v-if="!isEdit || isNewPassword" :span="2" :offset="1">
          <el-button type="primary" @click="generatePassword">
            Сгенерировать
          </el-button>
        </el-col>
        <el-col v-if="isEdit && !isNewPassword" :span="7" :offset="1">
          <el-button type="primary" @click="changePassword">
            Изменить пароль
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isEdit" type="primary" @click="onEdit">
          Изменить
        </el-button>
        <el-button v-if="!isEdit" type="primary" @click="onAdd">
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
import Markdown from '@/components/Markdown'
import AsyncSelect from '@/components/AsyncSelect'

export default {
  name: 'CompanyForm',

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
      const companyService = this.$apiClient.service('companies')
      const res = await companyService.get(this.$route.params.id)

      if (!res.user) {
        res.user = {
          email: '',
          password: '',
        }
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

      const companyService = this.$apiClient.service('companies')

      try {
        await companyService.patch(this.$route.params.id, {
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

      this.$router.push({ name: 'Companies' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const companyService = this.$apiClient.service('companies')

      try {
        await companyService.create({
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

      window.location.replace('https://skfu.spichka.dev/')
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

      this.$router.push({ name: 'Company' })
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
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  width: 100%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
