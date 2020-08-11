import client from './index';
import Axios from 'axios'

export function loginWithEmail(username, password) {
  return Axios.post(process.env.VUE_APP_MATATAKIAPI + '/login/account', { username, password });
}

export function getUserProfile(uid) {
  return Axios.get(process.env.VUE_APP_MATATAKIAPI + `/user/${uid}`);
}

export function getAvatarUrl(location) {
  const imageCDNServer = process.env.VUE_APP_MTTKIMGCDN;
  return `${imageCDNServer}${location}`;
}
