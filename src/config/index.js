import { networks } from './network';

const appScatterName = 'CryptoMeetup';
const network = networks.eosasia;

export { network, appScatterName };

export const i18n = [
    {
        langDisplay: '中文',
        locale: 'zh',
        aliases: ['zh', 'zh-cn', 'zh-hk', 'zh-sg', 'zh-tw'],
    },
    {
        langDisplay: 'English',
        locale: 'en',
        aliases: ['en', 'en-us', 'en-au', 'en-bz', 'en-ca', 'en-ie', 'en-jm', 'en-nz', 'en-ph', 'en-za', 'en-tt', 'en-gb', 'en-zw'],
    },
    {
        langDisplay: '日本語',
        locale: 'ja',
        aliases: ['jp', 'ja', 'ja-jp']
    }
];
