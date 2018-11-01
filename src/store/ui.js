export default {
  namespaced: true,
  state: {
    navBurgerVisible: true,
  },
  mutations: {
    setNavBurgerVisible(state, visible) {
      state.navBurgerVisible = visible;
    },
  },
};
