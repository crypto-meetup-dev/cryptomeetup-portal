import client from './index';
import { property } from 'lodash';

const fs = require('fs')
const path = require('path')
const config = require('../../config.json')

const devPath = path.resolve('../config/env.dev.json')
const proPath = path.resolve('../config/env.json')
const pathConfig = config.development ? JSON.parse(fs.readFile(devPath)) : JSON.parse(fs.readFile(proPath))

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
