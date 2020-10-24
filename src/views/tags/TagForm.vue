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

export default {
  name: 'TagForm',

  components: {
    cropUpload,
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
        name: [{ required: true, message: 'Введите название тега', trigger: 'blur' }],
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
      const tagsService = this.$apiClient.service('tags')
      const res = await tagsService.get(this.$route.params.id)

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
        await this.confirmUpdate('Сохранить изменения тег?', 'Тег не изменена')
      } catch (err) {
        return false
      }

      const tagsService = this.$apiClient.service('tags')

      await tagsService.patch(this.$route.params.id, {
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
        message: 'Тег изменена!',
        type: 'success',
      })

      this.$router.push({ name: 'Tags' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const tagsService = this.$apiClient.service('tags')

      await tagsService.create({
        ...this.form,
      })

      this.$message({
        message: 'Тег сохранена!',
        type: 'success',
      })

      this.$router.push({ name: 'Tags' })
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
        await this.confirmUpdate('Оменить изменения тег?', 'Продолжайте редактирование тег')
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Тег не изменена!',
        type: 'warning',
      })

      if (this.isEdit && this.form.iconId !== null && this.form.iconId !== this.oldIcon) {
        await this.deleteLogo()
      }

      if (!this.isEdit && this.form.iconId !== null && this.form.iconId) {
        await this.deleteLogo()
      }

      this.$router.push({ name: 'Tags' })
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
