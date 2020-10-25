<template>
  <div class="profile">
    <el-tabs v-model="activeName">
      <el-tab-pane label="Вакансии" name="vacancies">
        <VacanciesList />
      </el-tab-pane>
      <el-tab-pane label="Интервью" name="interviews"><InterviewsList /></el-tab-pane>
      <el-tab-pane label="Форма" name="student"><StudentForm /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VacanciesList from './VacanciesList'
import InterviewsList from './InterviewsList'
import StudentForm from './StudentForm'

export default {
  name: 'Profile',

  components: {
    VacanciesList,
    InterviewsList,
    StudentForm,
  },

  data() {
    return {
      activeName: 'vacancies',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.profile {
  width: 80%;
  margin-left: 10%;
  padding-top: 50px;
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
