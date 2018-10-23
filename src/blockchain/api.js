import { currentGetters, rpc } from './store'

function getBalancesByContract ({ tokenContract = 'eosio.token', accountName, symbol }) {
  return rpc().get_currency_balance(tokenContract, accountName, symbol)
}

function getMyBalancesByContract ({ tokenContract = 'eosio.token', symbol }) {
  const accountName = currentGetters().account.name
  return getBalancesByContract({ tokenContract, accountName, symbol })
}

export { getBalancesByContract, getMyBalancesByContract }
