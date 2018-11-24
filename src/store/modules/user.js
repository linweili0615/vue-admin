import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,getName,setName,removeName } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: getName(),
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
          if(data.code === '200'){
            setToken(data.token)
            setName(data.user_name)
          }
          resolve(response)
        }).catch(error => {
          removeToken()
          removerName()
          commit('SET_TOKEN','')
          commit('SET_NAME','')
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if(data.user_name !== ''){
            setName(data.user_name)
          }
          resolve(response)
        }).catch(error => {
          removeToken()
          removeName()
          commit('SET_TOKEN','')
          commit('SET_NAME','')
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeToken()
        removeName()
        commit('SET_TOKEN','')
        commit('SET_NAME','')
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        removeName()
        commit('SET_TOKEN','')
        commit('SET_NAME','')
        resolve()
      })
    }
  }
}

export default user
