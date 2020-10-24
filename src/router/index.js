import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/companies',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Статистика', icon: 'dashboard' },
      },
    ],
    meta: {
      availableRoles: ['admin', 'company'],
    },
  },

  {
    path: '/companies',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Companies',
        component: () => import('@/views/companies/index'),
        meta: {
          title: 'Компании',
          icon: 'companies',
          roles: ['admin'],
        },
      },
      {
        path: 'add',
        name: 'addCompany',
        hidden: true,
        component: () => import('@/views/companies/CompanyForm'),
        meta: {
          title: 'Добавление компании',
          icon: 'companies',
          roles: ['admin'],
        },
      },
      {
        path: 'edit/:id',
        name: 'editCompany',
        hidden: true,
        component: () => import('@/views/companies/CompanyForm'),
        meta: {
          title: 'Изменение компании',
          icon: 'companies',
          roles: ['admin'],
        },
      },
    ],
    meta: {
      availableRoles: ['admin'],
    },
  },

  {
    path: '/universities',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Universities',
        component: () => import('@/views/universities/index'),
        meta: {
          title: 'Университеты',
          icon: 'universities',
          roles: ['admin'],
        },
      },
      {
        path: 'add',
        name: 'addUniversity',
        hidden: true,
        component: () => import('@/views/universities/UniversityForm'),
        meta: {
          title: 'Добавление университета',
          icon: 'universities',
          roles: ['admin'],
        },
      },
      {
        path: 'edit/:id',
        name: 'editUniversity',
        hidden: true,
        component: () => import('@/views/universities/UniversityForm'),
        meta: {
          title: 'Изменение университета',
          icon: 'universities',
          roles: ['admin'],
        },
      },
    ],
    meta: {
      availableRoles: ['admin'],
    },
  },

  {
    path: '/students',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Students',
        component: () => import('@/views/students/index'),
        meta: {
          title: 'Студенты',
          icon: 'students',
          roles: ['admin'],
        },
      },
      {
        path: 'add',
        name: 'addStudent',
        hidden: true,
        component: () => import('@/views/students/StudentForm'),
        meta: {
          title: 'Добавление студента',
          icon: 'students',
          roles: ['admin'],
        },
      },
      {
        path: 'edit/:id',
        name: 'editStudent',
        hidden: true,
        component: () => import('@/views/students/StudentForm'),
        meta: {
          title: 'Изменение студента',
          icon: 'students',
          roles: ['admin'],
        },
      },
    ],
    meta: {
      availableRoles: ['admin'],
    },
  },

  {
    path: '/specializations/',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Specializations',
        component: () => import('@/views/specializations/index'),
        meta: { title: 'Специализации', icon: 'categories' },
      },
      {
        path: 'add',
        name: 'addSpecialization',
        hidden: true,
        component: () => import('@/views/specializations/SpecializationForm'),
        meta: { title: 'Добавление специализации', icon: 'categories' },
      },
      {
        path: 'edit/:id',
        name: 'editSpecialization',
        hidden: true,
        component: () => import('@/views/specializations/SpecializationForm'),
        meta: { title: 'Изменение специализации', icon: 'categories' },
      },
    ],
    meta: {
      availableRoles: ['admin'],
    },
  },

  {
    path: '/vacancies',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Vacancies',
        component: () => import('@/views/vacancies/index'),
        meta: {
          title: 'Вакансии',
          icon: 'companies',
          roles: ['admin'],
        },
      },
      {
        path: 'add',
        name: 'addVacancy',
        hidden: true,
        component: () => import('@/views/vacancies/VacancyForm'),
        meta: {
          title: 'Добавление вакансии',
          icon: 'companies',
          roles: ['admin'],
        },
      },
      {
        path: 'edit/:id',
        name: 'editVacancy',
        hidden: true,
        component: () => import('@/views/vacancies/VacancyForm'),
        meta: {
          title: 'Изменение вакансии',
          icon: 'companies',
          roles: ['admin'],
        },
      },
    ],
    meta: {
      availableRoles: ['admin'],
    },
  },

  {
    path: '/users/',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Users',
        component: () => import('@/views/users/index'),
        meta: { title: 'Пользователи', icon: 'users' },
      },
    ],
    meta: {
      availableRoles: ['admin', 'company', 'point'],
    },
  },

  { path: '*', redirect: '/404', hidden: true },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
})
