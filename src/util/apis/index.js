import { api, currentEOSAccount} from './eos.js';


function getApi(contractType) {
  if (contractType === 'eos' || contractType === 'bos') {
    return {
      api,
      currentEOSAccount
    }
  }
}

export default getApi
