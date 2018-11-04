import request from '@/utils/request'

export function login(telno, pwd) {
  return request({
    headers: {
      'Content-Type':'application/json;charset=UTF-8'
    },
    url: '/user/2login',
    method: 'post',
    data: {
      telno,
      pwd
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/validtoken',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
