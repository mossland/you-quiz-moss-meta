<template>
  <div id="app" :class="{ light: theme === 'light' }">
    <nav-bar />
    <section class="subnav-wrapper" v-if="showSubNav">
      <sub-nav-bar />
    </section>
    <main>
      <router-view/>
    </main>
    <footer-section v-if="!hideFooter" />
  </div>
</template>

<style lang="scss">
* {
  touch-action: manipulation;
}
@font-face {
  font-family: book;
  src: url(~@/assets/fonts/bookkk_light.ttf);
  font-weight: 400;
}
@font-face {
  font-family: book;
  src: url(~@/assets/fonts/bookkk_bold.ttf);
  font-weight: 700;
}
@font-face {
  font-family: jamsil;
  src: url(~@/assets/fonts/TheJamsilThin.otf);
  font-weight: 100;
}
@font-face {
  font-family: jamsil;
  src: url(~@/assets/fonts/TheJamsilLight.otf);
  font-weight: 200;
}
@font-face {
  font-family: jamsil;
  src: url(~@/assets/fonts/TheJamsilRegular.otf);
  font-weight: normal;
}
@font-face {
  font-family: jamsil;
  src: url(~@/assets/fonts/TheJamsilMedium.otf);
  font-weight: 600;
}
@font-face {
  font-family: jamsil;
  src: url(~@/assets/fonts/TheJamsilBold.otf);
  font-weight: 700;
}
@font-face {
  font-family: jamsil;
  src: url(~@/assets/fonts/TheJamsilExtraBold.otf);
  font-weight: 900;
}
html {
  width: 100%;
  height: 100%;

  body {
    width: 100%;
    min-height: 100%;
    margin: 0;
    padding: 0;
    background: var(--background);

    &.light {
      @import url(~@/assets/styles/light.scss);
    }
    #app {
      @import url(~@/assets/styles/dark.scss);

      width: 100%;
      margin: 0;
      background: var(--background);
      color: var(--text);
        
      &.light {
        @import url(~@/assets/styles/light.scss);
      }

      main {
        max-width: 650px;
        margin: 0 auto;
      }
      
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import NavBar from './components/NavBar.vue';
import SubNavBar from './components/SubNavBar.vue';
import FooterSection from './components/FooterSection.vue';

@Component({
  components: {
    NavBar,
    SubNavBar,
    FooterSection
  },
})
export default class App extends Vue {
  @State('theme', { namespace: 'ui' }) private theme!: string;
  @State('showSubNav', { namespace: 'ui' }) private showSubNav!: boolean;

  @Watch('theme')
  private onChangeTheme() {
    if (this.theme === 'light')
      document.body.classList.add('light');
    else
      document.body.classList.remove('light');
  }

  private hideRecaptcha: number = -1;

  private get hideFooter(): boolean {
    return this.$route.meta!.hideFooter;
  }
  private created() {
    window.localStorage.clear();
  }

  private mounted() {
    this.$nextTick(() => {
      this.hideRecaptcha = window.setInterval(() => {
        const ele: any = document.querySelector('.grecaptcha-badge');
        if (!ele) {
          return;
        } else {
          ele.style.position = 'relative';
          ele.style.display = 'none';
          ele.style.pointerEvents = 'none';
          ele.style.opacity = '0';
          ele.style.width = '0';
          ele.style.height = '0';
          window.clearInterval(this.hideRecaptcha);
        }
      }, 1000);
    })
  }
}
</script>
