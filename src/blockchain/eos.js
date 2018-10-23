import { eos } from './store'

const transact = (transaction, namedParameters) => eos().transact(transaction, namedParameters)

const singleContractCall = ({ contractAccount, actionName, actionData, authorization }) => transact({
  actions: [{
    account: contractAccount,
    name: actionName,
    authorization: authorization,
    data: actionData
  }]
}, {
  blocksBehind: 3,
  expireSeconds: 30
})

export { transact, singleContractCall }
