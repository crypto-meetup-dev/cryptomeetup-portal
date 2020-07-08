import client from './index';

export function loginWithEmail(username, password) {
  return client.post(process.env.VUE_APP_MATATAKIAPI + '/login/account', { username, password });
}

export function getUserProfile(uid) {
  return client.get(process.env.VUE_APP_MATATAKIAPI + `/user/${uid}`);
}

export function getAvatarUrl(location) {
  const imageCDNServer = process.env.VUE_APP_MTTKIMGCDN;
  return `${imageCDNServer}${location}`;
}
