/* eslint-disable */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zh from './zh';
import en from './en';
import ja from './jp';
import ko from './ko';
import ru from './ru';
import zh_tw from './zh_tw';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ja,
    ko,
    ru,
    zh,
    zh_tw
  },
});
