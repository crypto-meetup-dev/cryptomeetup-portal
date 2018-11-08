export default {
  namespaced: true,
  state: {
    navBurgerVisible: true,
    globalSpinnerVisible: false,
    globalProgressVisible: false, // if progress visible, then spinner will hide
    globalProgressValue: 0, // 0 ~ 1
  },
  mutations: {
    setNavBurgerVisible(state, visible) {
      state.navBurgerVisible = visible;
    },
    setGlobalSpinnerVisible(state, visible) {
      state.globalSpinnerVisible = visible;
    },
    setGlobalProgressVisible(state, visible) {
      state.globalProgressVisible = visible;
    },
    setGlobalProgressValue(state, value) {
      state.globalProgressValue = value;
    },
  },
};
