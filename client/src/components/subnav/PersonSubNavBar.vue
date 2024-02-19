<template>
  <section class="person-sub-nav">
    <button class="genre" type="button" @click="toggleIsOpen()" :class="{ isOpen }">
      장르변경
    </button>
    <div v-if="isOpen" class="genre-btns">
      <button @click="toggleSelect(btn.key, btn.select)" v-for="btn in validCategory" :key="btn.key" class="btn-type-1" :class="{ inactive: !btn.select }">
       {{ btn.text }}
      </button>
    </div>
    <div class="time">
      <span class="time__label">제한시간</span>
      <section class="time__modify">
        <button class="time__modify__decrement" @click="modifyTimelimit(-1)">-</button>
        <span class="time__modify__state">{{ timeLimit }}초</span>
        <button class="time__modify__increment" @click="modifyTimelimit(1)">+</button>
      </section>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '~@/assets/styles/common.scss';

.person-sub-nav {
  position: relative;
  width: 100%;
  height: 42px;
  display: flex;
  box-sizing: border-box;
  padding: 9px 0px;
  color: var(--text);

  button {
    outline: none;
    border: 0;
    background: transparent;
    color: var(--text);
    cursor: pointer;
  }

  .genre {
    display: flex;
    align-items: center;
    &:after {
      content: '';
      display: inline-block;
      width: 1em;
      height: 1em;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      background-image: url('~@/assets/img/dropdown_down.svg');
      margin-left: 10px;
    }

    &.isOpen:after {
      background-image: url('~@/assets/img/dropdown_up.svg');
    }
  }
  .genre-btns {
    position: absolute;
    width: 100%;
    top: 50px;
    background: var(--person-submenu-dropdown-background);
    border-radius: 20px;
    box-sizing: border-box;
    padding: 1em 1.4em;
    z-index: 4;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    button {
      position: relative;
      font-family: book;
      font-weight: 400;
      color: var(--person-option-btn-active-text);
      font-size: 13px;
      text-align: center;
      box-sizing: border-box;
      padding: 5px 6px;
      user-select: none;
      background: linear-gradient(320.14deg, var(--btn-gradient-1) 23.13%, var(--btn-gradient-2) 77.62%);
      opacity: 0.9;


      &:hover {
        border: 0;
        opacity: 1.0;
      }
      &.inactive {
        background: var(--btn-disabled-background);
        color: var(--btn-comingsoon-text);
        opacity: 0.9;
      }
    }
  }

  .time {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;

    &__modify {
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--text);
        border-radius: 15px;
        margin: 0 10px;
        width: 30px;
        text-align: center;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { IPersonCategoryState, IPersonCategory } from '../../store/modules/game';

@Component({
  components: {},
})
export default class PersonSubNavBar extends Vue {
  @State('timeLimit', { namespace: 'game' }) private timeLimit!: number;
  @State('solvedPersonStorageKey', { namespace: 'game' }) private solvedPersonStorageKey!: string;
  @State('personCategoryBtnState', { namespace: 'game' }) private personCategoryBtnState!: IPersonCategoryState[];
  @State('personCategoryData', { namespace: 'game' }) private categoryData!: IPersonCategory[];

  @Mutation('setPersonSelectCategory', { namespace: 'game' }) private setPersonSelectCategory!: ({key, isSelect}: {key: string, isSelect: boolean}) => void;
  @Mutation('setTimeLimit', { namespace: 'game' }) private setTimeLimit!: (timeLimit: number) => void;

  private isOpen: boolean = false;

  private get validCategory(): IPersonCategoryState[] {
    return this.personCategoryBtnState.filter((bs) => {
      const idx = this.categoryData.findIndex((cd) => {
        return cd.category === bs.key && cd.isAvailable;
      });
      return idx >= 0;
    });
  }

  private toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }

  private toggleSelect(key: string, curSelect: boolean) {
    const selected = this.personCategoryBtnState.filter((bs) => bs.select);
    if (selected.length === 1 && curSelect) {
      alert('최소 한개 이상 장르를 선택해야합니다.');
      return;
    }
    this.setPersonSelectCategory({
      key,
      isSelect: !curSelect,
    });
  }
  private modifyTimelimit(delta: number) {
    this.setTimeLimit(Math.min(20, Math.max(1, this.timeLimit + delta)));
  }
}
</script>