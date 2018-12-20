/* eslint-disable */

import axios from 'axios';
import { getLocalStorage, removeLocalStorage } from '@/util/storeUtil';
const instance = axios.create({
  timeout: 30000
});


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