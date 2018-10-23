import { scatter, eos } from '../store'
import { network } from '@/config'

const eosTokenDetails = {
  contract: 'eosio.token',
  symbol: 'EOS',
  decimals: 4
}

const transferTokenViaScatter = ({ to, memo = '', amount = '0.0000',
  tokenDetails = eosTokenDetails
}) => scatter().requestTransfer(
  network, to, amount, { memo, ...tokenDetails }
)

const transferTokenViaEosjs = async ({ from, to, memo = '', quantity = '0.0001 EOS',
  tokenDetails = eosTokenDetails
}) => {
  return eos().transact({
    actions: [{
      account: tokenDetails.contract,
      name: 'transfer',
      authorization: [{
        actor: from,
        permission: 'active'
      }],
      data: {
        from,
        to,
        quantity,
        memo
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export {
  transferTokenViaScatter as transferToken,
  transferTokenViaEosjs
}
