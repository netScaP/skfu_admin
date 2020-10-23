import apiClient from '../../utils/feathers-client'

const user = {
  namespaced: true,

  state: {
    token: null,
    authUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      if (!token) {
        localStorage.removeItem('token')
        return true
      }
      localStorage.setItem('token', JSON.stringify(token))
      state.token = token
    },
    SET_AUTH_USER(state, user) {
      if (!user) {
        localStorage.removeItem('user')
        return true
      }
      state.authUser = user
      localStorage.setItem('user', JSON.stringify(user))
    },
  },

  actions: {
    setUser({ commit }, payload) {
      commit('SET_AUTH_USER', payload)
    },

    async setToken({ commit }, payload) {
      try {
        const jwtDecode = await apiClient.passport.verifyJWT(payload)
        console.log(jwtDecode)
        const authUser = await apiClient.service('users').get(jwtDecode.sub)
        await apiClient.set('user', authUser)

        let id
        let permissionType
        if (authUser && authUser.role === 'company') {
          permissionType = 'companies'
        }
        if (authUser && authUser.role === 'point') {
          permissionType = 'points'
        }
        const permission =
          authUser && authUser.permissions
            ? authUser.permissions.find(e => e.split(':*:')[0] === permissionType)
            : undefined
        if (permission) {
          id = permission.split(':*:')[1]
        }
        if (permissionType === 'companies') {
          commit('companies/SET_COMPANY_ID', id, { root: true })
        }
        if (permissionType === 'points') {
          commit('companies/SET_POINT_ID', id, { root: true })
        }

        commit('SET_TOKEN', payload)
        commit('SET_AUTH_USER', authUser)
        return Promise.resolve('OK')
      } catch (e) {
        Promise.reject(e)
      }
    },

    async logOut({ commit }) {
      try {
        await apiClient.logout()
        commit('SET_TOKEN', undefined)
        commit('SET_AUTH_USER', undefined)
        return Promise.resolve('OK')
      } catch (e) {
        Promise.reject(e)
      }
    },
  },

  getters: {
    token: state => state.token,
    email: state => (state.authUser ? state.authUser.email : undefined),
    roles: state => (state.authUser ? state.authUser.permissions : undefined),
    userType: state => (state.authUser ? state.authUser.role : undefined),
    roleType: state => {
      if (state.authUser && state.authUser.role === 'company' && state.authUser.permissions) {
        const permission = state.authUser.permissions.find(e => e.split(':*:')[0] === 'companies')
        return permission
      }
      if (state.authUser && state.authUser.role === 'point' && state.authUser.permissions) {
        return state.authUser.permissions.find(e => e.split(':*:')[0] === 'points')
      }
      return undefined
    },
  },
}

export default user
