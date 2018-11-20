/* eslint-disable */

import axios from 'axios';
import { getLocalStorage, removeLocalStorage } from '@/util/storeUtil';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBseSIsInVzZXJfbmFtZSI6InRlc3QiLCJzY29wZSI6WyJzZXJ2ZXIiXSwiYXBwSWQiOiIxMDAwMSIsImV4cCI6MTU0Mjc0MjM1NiwidXNlcklkIjo3LCJhdXRob3JpdGllcyI6WyJDVVNUT01FUiIsIlJPTEVfVVNFUiIsIkJUX0FETUlOIl0sImp0aSI6Ijc2ZTk2NzBlLWM4MTItNGZlYy1iYzY0LTUyZGQ1MDJkYTcwYyIsImNsaWVudF9pZCI6ImxpeWFuZyJ9.3f3CFadmHgq15MabgTPmcrVviTEawJL9lxzNmeN0dkk'
const userId = 7
const instance = axios.create();


instance.interceptors.request.use(config => {
  config.url = config.url;
  config.headers.common = {
    'Authorization': token,
    'userId': userId,
  };
  return config;
}, error => {
  return Promise.reject(error);
})


instance.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data.data;
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