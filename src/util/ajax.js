/* eslint-disable */

import axios from 'axios';
import { getLocalStorage, removeLocalStorage } from '@/util/storeUtil';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBseSIsInVzZXJfbmFtZSI6InRlc3QiLCJzY29wZSI6WyJzZXJ2ZXIiXSwiYXBwSWQiOiIxMDAwMSIsImV4cCI6MTU0MjgxNTYwMywidXNlcklkIjo3LCJhdXRob3JpdGllcyI6WyJDVVNUT01FUiIsIlJPTEVfVVNFUiIsIkJUX0FETUlOIl0sImp0aSI6ImNjOTU0ZTBjLTZjM2ItNDhjNy1iMTVjLWViZjdjMTcwMGU1MCIsImNsaWVudF9pZCI6ImxpeWFuZyJ9.cMmW3HpYcL1MEBYeEheIpJliW7n8rQ0OtHe0X8oDfdo'
const userId = 10001
const instance = axios.create();


instance.interceptors.request.use(config => {
  config.url = config.url;
  return config;
}, error => {
  return Promise.reject(error);
})


instance.interceptors.response.use(response => {
  if (response.status === 200) {
    return response;
  } else {
    console.log('这里弹窗需要做 错误处理', response)
  }

}, (error) => {
  return Promise.reject(error)
})

export const ajax = instance 

export function analysis (api, data) {
  let url = ''
  for (let key in data) {
    if (url.indexOf('?') > -1) {
      url += `${'&' + key}=${data[key]}`
    } else {
      url += `?${key}=${data[key]}`
    }
  }
  return api + url
}


export default { ajax, analysis }