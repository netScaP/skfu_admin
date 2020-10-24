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
            prop="name"
            label="Название">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="type" label="Тип">
            <el-select v-model="form.type">
              <el-option label="Основная" value="main" />
              <el-option label="Подспециализация" value="sub" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.type === 'sub'">
        <el-col :span="8">
          <el-form-item label="Специализация">
            <AsyncSelect
              service="specializations"
              label="name"
              :value="form.specializationId"
              :multiple="false"
              @value-changed="val => form.specializationId = val"
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
  </div>
</template>

<script>
import validateForm from '@/mixins/validateForm'
import confirmUpdate from '@/mixins/confirmUpdate'
import cropUpload from '@/components/CropUpload'
import AsyncSelect from '@/components/AsyncSelect'

export default {
  name: 'SpecializationForm',

  components: {
    cropUpload,
    AsyncSelect,
  },

  mixins: [validateForm, confirmUpdate],

  data() {
    return {
      form: {
        name: '',
        type: '',
      },
      show: false,
      isEdit: false,
      rules: {
        name: [{ required: true, message: 'Введите название специализаци', trigger: 'blur' }],
      },
      imageUrl: '',
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.isEdit = true
      this.fetchData()
    }
  },

  methods: {
    async fetchData() {
      const specializationsService = this.$apiClient.service('specializations')
      const res = await specializationsService.get(this.$route.params.id)

      this.form = res

      if (this.form.iconId) {
        this.imageUrl = this.form.icon
        this.oldIcon = this.form.iconId
      }
    },

    async onEdit() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      try {
        await this.confirmUpdate('Сохранить изменения специализаци?', 'Специализация не изменена')
      } catch (err) {
        return false
      }

      const specializationsService = this.$apiClient.service('specializations')

      await specializationsService.patch(this.$route.params.id, {
        ...this.form,
      })

      if (this.oldIcon !== null) {
        const fileService = this.$apiClient.service('files')
        try {
          await fileService.remove(this.oldIcon)
        } catch (err) {
          console.log(err) //eslint-disable-line
        }
      }

      this.$message({
        message: 'Специализация изменена!',
        type: 'success',
      })

      this.$router.push({ name: 'Specializations' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const specializationsService = this.$apiClient.service('specializations')

      await specializationsService.create({
        ...this.form,
      })

      this.$message({
        message: 'Специализация сохранена!',
        type: 'success',
      })

      this.$router.push({ name: 'Specializations' })
    },

    hideLogo() {
      this.form.iconId = null

      this.imageUrl = ''
    },

    async deleteLogo() {
      const fileService = this.$apiClient.service('files')

      await fileService.remove(this.form.iconId)

      this.form.iconId = null
      this.imageUrl = ''
    },

    async onCancel() {
      try {
        await this.confirmUpdate(
          'Оменить изменения специализаци?',
          'Продолжайте редактирование специализаци'
        )
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Специализация не изменена!',
        type: 'warning',
      })

      if (this.isEdit && this.form.iconId !== null && this.form.iconId !== this.oldIcon) {
        await this.deleteLogo()
      }

      if (!this.isEdit && this.form.iconId !== null && this.form.iconId) {
        await this.deleteLogo()
      }

      this.$router.push({ name: 'Specializations' })
    },

    handleImageDataUrl(url) {
      this.imageUrl = url
    },

    async handleAvatarSuccess(res) {
      if (this.form.iconId && this.form.iconId !== this.oldIcon) {
        await this.deleteLogo()
      }
      this.form.iconId = res[0]._id
      this.imageUrl = `${process.env.FILE_URL}/uploads/${res[0].filename}`
    },

    toggleShow() {
      this.show = !this.show
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
