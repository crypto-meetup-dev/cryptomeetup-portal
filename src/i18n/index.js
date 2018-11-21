/* eslint-disable */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zh from './zh';
import en from './en';
import ja from './jp';
import ko from './ko';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
    ja,
    ko,
  },
});
