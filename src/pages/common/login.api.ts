import type { LoginParams } from './type'

enum LoginAPI {
  LOGIN = '/user/login',
  LOGOUT = '/sys/logout',
  USER = '/user',
  GET_ROUTE_MENUS = '/user/permission',
  GET_RANDOM_CODE = '/sys/getRandomCode',
}

// 获取验证码
export function getRandomCodeApi(key: string) {
  return useGet<string>(LoginAPI.GET_RANDOM_CODE, { key }, { token: false })
}
export function loginApi(params: LoginParams) {
  return usePost(LoginAPI.LOGIN, params, {
    // 设置为false的时候不会携带token
    token: false,
    // 是否开启全局请求loading
    loading: true,
  })
}

export function logoutApi() {
  return useGet(LoginAPI.LOGOUT)
}
// 获取用户菜单和权限
export function getRouteMenusApi() {
  return useGet(LoginAPI.GET_ROUTE_MENUS)
}

export function updateUserData(params: any) {
  const id = params.id
  delete params.id
  return usePut(`${LoginAPI.USER}/${id}`, params)
}
