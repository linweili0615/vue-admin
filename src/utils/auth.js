import Cookies from 'js-cookie'

const TokenKey = 'jm'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function setName(name) {
  return Cookies.set("un",name)
}

export function getName() {
  return Cookies.get("un")
}

export function removeName() {
  return Cookies.remove("un")
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
