<template>
  <section id="subnav" class="subnav">
    <component :is="subNavComponent" />
  </section>
</template>

<style lang="scss" scoped>
.subnav {
  width: 100%;
  color: var(--text);
  font-family: book;
  box-sizing: border-box;
  padding: 0 20px 0 20px;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

import PersonSubNavBar from './subnav/PersonSubNavBar.vue';

@Component({
  components: {
    PersonSubNavBar
  },
})
export default class SubNavBar extends Vue {
  @State('subNavComponent', { namespace: 'ui' }) private subNavComponent!: boolean;
}
</script>
