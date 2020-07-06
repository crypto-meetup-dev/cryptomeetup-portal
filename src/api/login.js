import client from './index';
import { property } from 'lodash';

const fs = require('fs')
const path = require('path')
const config = require('../../config.json')

const devPath = require('../config/env.dev.json')
const proPath = require('../config/env.json')

let pathConfig = ''
if (config.development) {
  pathConfig = devPath
} else {
  pathConfig = proPath
}

export function loginWithEmail(username, password) {
  return client.post(pathConfig.MATATAKIAPI + '/login/account', { username, password });
}

export function getUserProfile(uid) {
  return client.get(pathConfig.MATATAKIAPI + `/user/${uid}`);
}

export function getAvatarUrl(location) {
  const imageCDNServer = pathConfig.MTTKIMGCDN;
  return `${imageCDNServer}${location}`;
}
