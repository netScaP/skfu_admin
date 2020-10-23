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
          <el-form-item label="priority">
            <el-input-number
              v-model="form.priority" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Активный">
            <el-switch
              v-model="form.isAvailable"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item 
        label="Лого" 
        class="avatar-uploader">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          style="cursor: pointer;"
          class="avatar"
          @click="toggleShow">
        <div
          v-else
          class="avatar-uploader"
          @click="toggleShow">
          <i class="el-icon-plus avatar-uploader-icon" />
        </div>
        <crop-upload
          :show="show"
          @input="toggleShow"
          @update-image-url="handleImageDataUrl"
          @image-loaded="handleAvatarSuccess"/>
        <el-button
          v-if="form.iconId || imageUrl !== ''"
          type="danger"
          @click="hideLogo">
          Удалить иконку
        </el-button>
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
import validateForm from '@/mixins/validateForm'
import confirmUpdate from '@/mixins/confirmUpdate'
import cropUpload from '@/components/CropUpload'

export default {
  name: 'CategoryForm',

  components: {
    cropUpload
  },

  mixins: [ validateForm, confirmUpdate ],

  data() {
    return {
      form: {
        name: '',
        priority: '',
        isAvailable: false,
        iconId: undefined
      },
      oldIcon: null,
      show: false,
      isEdit: false,
      rules: {
        name: [
          { required: true, message: 'Введите название категории', trigger: 'blur' }
        ]
      },
      imageUrl: ''
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
      const categoriesService = this.$apiClient.service('categories')
      const res = await categoriesService.get(this.$route.params.id)

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
        await this.confirmUpdate('Сохранить изменения категории?', 'Категория не изменена')
      } catch (err) {
        return false
      }

      const categoriesService = this.$apiClient.service('categories')

      await categoriesService.patch(this.$route.params.id, {
        ...this.form
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
        message: 'Категория изменена!',
        type: 'success'
      })

      this.$router.push({ name: 'Categories' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const categoriesService = this.$apiClient.service('categories')

      await categoriesService.create({
        ...this.form
      })

      this.$message({
        message: 'Категория сохранена!',
        type: 'success'
      })

      this.$router.push({ name: 'Categories' })
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
        await this.confirmUpdate('Оменить изменения категории?', 'Продолжайте редактирование категории')
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Категория не изменена!',
        type: 'warning'
      })

      if (this.isEdit && this.form.iconId !== null && this.form.iconId !== this.oldIcon) {
        await this.deleteLogo()
      }

      if (!this.isEdit && this.form.iconId !== null && this.form.iconId) {
        await this.deleteLogo()
      }

      this.$router.push({ name: 'Categories' })
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
    }

  }
}
</script>

<style>
.line{
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
  border-color: #409EFF;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

