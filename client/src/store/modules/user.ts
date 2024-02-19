import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import axios from 'axios';

@Module({ namespaced: true })
export default class User extends VuexModule {
    token: string = '';
    id: string = '';
    name: string = '';

    public get isLoggedIn() {
      return this.token !== '';
    }

    @Mutation
    setToken(token: string) {
        this.token = token;
    }
    @Mutation
    setId(id: string) {
        this.id = id;
    }
    @Mutation
    setName(name: string) {
        this.name = name;
    }

    @Action
    async login() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_BASE}/user/login/guest`);
        const { token, id, name } = data;
        this.context.commit('setToken', token);
        this.context.commit('setId', id);
        this.context.commit('setName', name);
      } catch (e) {}
    }

    
}