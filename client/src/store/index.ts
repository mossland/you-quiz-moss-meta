import Vue from 'vue';
import Vuex from 'vuex';
import ui from './modules/ui';
import game from './modules/game';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    game,
    ui,
    user,
  }
});

export default store;

