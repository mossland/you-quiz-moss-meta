<template>
  <section class="home">
    <h3>퀴즈를 선택하세요</h3>
    <section class="home__btns">
      <router-link tag="button" class="btn-type-1 " :class="{ 'coming-soon': bData.comingSoon }" :to="bData.to" v-for="bData, idx in btnsData" :key="idx" :disabled="bData.comingSoon">
        {{ bData.text }}
      </router-link>
    </section>
  </section>
</template>

<style lang="scss" scoped>
@import '~@/assets/styles/common.scss';
.home {
  height: calc(100vh - (2rem + 33px));
  h3 {
    font-family: book;
    text-align: center;
    font-weight: 700;
    color: var(--text);
    font-size: 1.3em;
    margin-bottom: 65px;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    padding: 0 35px;
    box-sizing: border-box;


    button {
      margin-bottom: 35px;
      padding: 1.2em 0;
      font-size: 1.4em;
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
export default class Home extends Vue {
  private btnsData = [
    {
      text: '인물 퀴즈',
      comingSoon: false,
      to: '/person',
    },
    {
      text: '노래 퀴즈',
      comingSoon: true,
      to: '',
    },
    {
      text: '가사 퀴즈',
      comingSoon: true,
      to: '',
    }
  ];
  
}
</script>

