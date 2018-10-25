export default class SimpleWalletApp {
  constructor(dappName, dappIcon) {
    this.dappName = dappName;
    this.dappIcon = dappIcon;
    this.commonField = {
      protocol: 'SimpleWallet',
      version: '1.0',
      dappName,
      dappIcon,
    };
  }
  pay(params) {
    return Object.assign({}, this.commonField, { action: 'transfer' }, params);
  }
  transfer(params) {
    return this.pay(params);
  }
  login(params) {
    return Object.assign({ action: 'login' }, params, this.commonField);
  }
}
