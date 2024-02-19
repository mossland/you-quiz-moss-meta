import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'


@Module({ namespaced: true })
export default class Ui extends VuexModule {
    theme: string = 'dark'
    
    showSubNav: boolean = false;
    subNavComponent: string = '';

    @Mutation
    setTheme(theme: string) {
        this.theme = theme;
    }

    @Mutation
    setShowSubNav(show: boolean) {
        this.showSubNav = show;
    }

    @Mutation
    setSubNavComponent(comp: string) {
        this.subNavComponent = comp;
    }
}