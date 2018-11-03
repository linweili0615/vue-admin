import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const telno = userInfo.telno.trim()
      return new Promise((resolve, reject) => {
        login(telno, userInfo.pwd).then(response => {
          const data = response.data
          if(data.code == '200'){
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            commit('SET_NAME',data.user_name)
          }
          resolve(response)
        }).catch(error => {
          commit('SET_TOKEN', '')
          commit('SET_NAME','')
          removeToken()
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if(data != null){
            commit('SET_NAME',data.username)
            resolve(response)
          }else{
            this.$store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }

        }).catch(error => {
          commit('SET_TOKEN', '')
          removeToken()
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
