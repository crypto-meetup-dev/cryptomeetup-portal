const EosPriceFormatter = {
  formatPrice(price) {
    return `${(price / 10000).toFixed(4)} EOS`;
  },
  install(Vue) {
    Vue.filter('price', value => EosPriceFormatter.formatPrice(value));
  },
};

export default EosPriceFormatter;
