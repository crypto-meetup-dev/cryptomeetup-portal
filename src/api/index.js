import axios from 'axios';
import { getCookie } from '../util/cookies';
import { Toast } from 'buefy/dist/components/toast';

const client = axios.create({
  baseURL: process.env.VUE_APP_MATATAKIAPI,
  timeout: 1000 * 30,
  headers: {},
});

// Just copy from matataki-fe
client.interceptors.request.use(
  (config) => {
    if (getCookie('ACCESS_TOKEN')) {
      config.headers['x-access-token'] = getCookie('ACCESS_TOKEN');
    }
    return config;
  },
  // eslint-disable-next-line arrow-body-style
  (error) => { return Promise.reject(error); }
);

client.interceptors.response.use(
  // eslint-disable-next-line arrow-body-style
  (response) => { return response.data; },
  (error) => {
    // loadingInstance.close()
    console.log(error.message);

    if (error.message.includes('status code 401')) {
      Toast.open({
        message: '登录状态异常,请重新登录',
        type: 'is-danger',
        duration: 4000,
        queue: false,
      })
    }
    //     if (process.browser && window && window.$nuxt) {

    //       // window.$nuxt.$store.commit('setLoginModal', true)

    //       try {
    //         // 重置all store
    //         window.$nuxt.$store.dispatch('resetAllStore')
    //         .then(() => {
    //           clearAllCookie()
    //           // 防止没有清除干净
    //           removeCookie('ACCESS_TOKEN')
    //           removeCookie('idProvider')
    //           store.clearAll()
    //           sessionStorage.clear()
    //         }).catch(err => {
    //           console.log(err)
    //           removeCookie('ACCESS_TOKEN')
    //         })
    //       } catch(e) {
    //         console.log(e)
    //         removeCookie('ACCESS_TOKEN')
    //       }
    //     }
    //   }

    // 超时处理
    if (error.message.includes('timeout')) {
      // Message.closeAll()
      Toast.open({
        message: '请求超时',
        type: 'is-danger',
        duration: 4000,
        queue: false,
      })
    }
    if (error.message.includes('Network Error')) {
      Toast.open({
        message: 'Network Error',
        type: 'is-danger',
        duration: 4000,
        queue: false,
      })
    }
    // loadingInstance.close()
    return Promise.reject(error);
  }
);

export default client;
