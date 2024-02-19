<template>
  <nav id="nav" class="nav">
    <section class="nav__title">
      {{ title }}
    </section>
    <section class="nav__btns">
      <router-link to="/" tag="button" class="nav__btns__home" :class="theme" v-if="showHomeBtn"></router-link>
      <button @click="swapTheme" class="nav__btns__theme" :class="theme" type="button"></button>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  width: 100%;
  color: var(--text);
  font-family: book;
  box-sizing: border-box;
  padding: 24px 20px 9px 20px;

  button {
    border: 1px solid var(--text);
    background: transparent;
    outline: none;
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    cursor: pointer;
  }
}
.nav {
  display: flex;

  &__title {
    font-weight: 700;
    font-size: 2em;
    user-select: none;
    cursor: default;
  }
  &__btns {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    button {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }

    &__theme {
      background: url('~@/assets/img/sun.svg') no-repeat center;
      background-size: 1em;

      &.light {
        background: url('~@/assets/img/moon.svg') no-repeat center;
      }
    }

    &__home {
      background: url('~@/assets/img/home.svg') no-repeat center;
      background-size: 1em;

      &.light {
        background: url('~@/assets/img/home_black.svg') no-repeat center;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component({
  components: {},
})
export default class NavBar extends Vue {
  @State('theme', { namespace: 'ui' }) private theme!: string;
  @Mutation('setTheme', { namespace: 'ui' }) private setTheme!: (theme: string) => void;

  private get title(): string {
    return this.$route.meta!.title;
  }
  private get showHomeBtn(): boolean {
    return this.$route.meta!.showHomeBtn;
  }
  private swapTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }
}
</script>
