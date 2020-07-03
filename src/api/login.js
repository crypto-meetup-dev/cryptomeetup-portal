import client from './index';

const pathConfig = require('../config/env.dev.json')

export function loginWithEmail(username, password) {
  return client.post(pathConfig.MATATAKIAPI + '/login/account', { username, password });
}

export function getUserProfile(uid) {
  return client.get(pathConfig.MATATAKIAPI + `/user/${uid}`);
}

export function getAvatarUrl(location) {
  const imageCDNServer = process.env.pathConfig.MTTKIMGCDN;
  return `${imageCDNServer}${location}`;
}
