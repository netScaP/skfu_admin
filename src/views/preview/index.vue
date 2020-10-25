<template>
  <div id="app">
    <header>
      <img src="@/assets/logo.png" />
      <p
        v-if="type === 'student' || type === 'company'"
        @click="() => type = type === 'student' ? 'company' : 'student'"
        tag="p"
        class="header-title"
      >
        {{ type === 'student' ? 'Перейти на сайт для компаний' : 'Перейти на сайт для студентов' }}
      </p>
    </header>
    <template v-if="type === 'student' || type === 'company'">
      <div v-if="showForm" class="body">
        <template v-if="type === 'student'">
          <router-link 
            :to="{ path: '/student/login' }" 
            tag="button" 
            class="redirect-button el-button el-button--default el-button--small" >
            Уже создавали учетную запись?
          </router-link>
          <StudentForm />
        </template>
        <template v-else>
          <router-link 
            :to="{ path: '/login' }" 
            tag="button" 
            class="redirect-button el-button el-button--default el-button--small" >
            Уже создавали компанию?
          </router-link>
          <CompanyForm />
        </template>
        <el-button style="align-self: flex-start; padding: 10px 20px;" @click="showForm = false" size="mini">x</el-button>
      </div>

      <div v-else class="body">
        <div class="body__left">
          <p class="desc">
            {{
              type === 'student'
                ? 'Ищите вакансии, изучайте компании, читайте о них отзывы и расскажите о предложите свою кандидатура'
                : 'Размещайте свои вакансии, знакомьтесь с резюме студентов и находите лучшие кандидатуры'
            }}
          </p>
          <button @click="showForm = true">
            {{ type === 'student' ? 'Отправить резюме' : 'Создать резюме' }}
            <!-- <button>
            </button> -->
          </button>
        </div>
        <div class="body__right">
          <img v-if="type === 'student'" src="@/assets/student.png" />
          <img v-else src="@/assets/company.png" />
        </div>
      </div>
    </template>
    <router-view />
  </div>
</template>

<script>
import StudentForm from './StudentForm'
import CompanyForm from './CompanyForm'

export default {
  name: 'Layout',

  components: {
    StudentForm,
    CompanyForm,
  },

  data() {
    return {
      type: 'student',
      showForm: false,
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  background-color: #448fa7;
  height: 200px;
  width: 100%;
  padding: 0 10%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  color: white;
  font-size: 24px;
}
.body {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 5% 0;
}
.body__left {
  width: 50%;
}
.body__right {
  width: 50%;
}
.redirect-button {
  position: absolute;
  top: 30px;
  font-size: 18px;
  padding: 10px 20px;
}
.desc {
  font-size: 36px;
  color: black;
}
button {
  cursor: pointer;
  border: 5px solid #ff5678;
  border-radius: 25px;
  padding: 20px 80px;
  font-size: 36px;
  background: transparent;
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
