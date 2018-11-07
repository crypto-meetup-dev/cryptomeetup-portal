const PriceFormatter = {
  formatPrice(price, unit = 'EOS') {
    return `${(price / 10000).toFixed(4)} ${unit}`;
  },
  install(Vue) {
    Vue.filter('price', value => PriceFormatter.formatPrice(value));
  },
};

export default PriceFormatter;
