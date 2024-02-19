import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Vue from 'vue';

export interface IPersonCategoryState {
    key: string;
    text: string;
    select: boolean;
}
export interface IPersonCategory {
    category: string;
    isAvailable: boolean;
  }
@Module({ namespaced: true })
export default class Game extends VuexModule {
    solvedPersonStorageKey: string = 'solved_person';
    personCategoryBtnState: IPersonCategoryState[] = [
        {
          key: 'sports',
          text: '스포츠',
          select: true,
        },
        {
          key: 'actor',
          text: '남자 한국 배우',
          select: true,
        },
        {
          key: 'actress',
          text: '여자 한국 배우',
          select: true,
        },
        {
          key: 'actorint',
          text: '남자 해외 배우',
          select: true,
        },
        {
          key: 'actressint',
          text: '여자 해외 배우',
          select: true,
        },
        {
          key: 'bidol',
          text: '남자 아이돌',
          select: true,
        },
        {
          key: 'gidol',
          text: '여자 아이돌',
          select: true,
        },
        {
          key: 'msingerkor',
          text: '남자 한국 가수',
          select: true,
        },
        {
          key: 'fsingerkor',
          text: '여자 한국 가수',
          select: true,
        },
        {
          key: 'msingerint',
          text: '남자 해외 가수',
          select: true,
        },
        {
          key: 'fsingerint',
          text: '여자 해외 가수',
          select: true,
        },
        {
          key: 'politician',
          text: '정치인',
          select: true,
        },
        {
          key: 'comedian',
          text: '희극인',
          select: true,
        },
        {
          key: 'suckers',
          text: '유명한 103끼',
          select: true,
        },
        {
          key: 'etc',
          text: '기타 유명인',
          select: true,
        },
    ];

    personCategoryData: IPersonCategory[] = [];
    timeLimit: number = 3;

    @Mutation
    setTimeLimit(timeLimit: number) {
        this.timeLimit = timeLimit;
    }
    @Mutation
    setPersonCategoryData(c: IPersonCategory[]) {
        this.personCategoryData = c;
    }

    @Mutation
    setPersonSelectCategory({key, isSelect}: {key: string, isSelect: boolean}) {
        const idx = this.personCategoryBtnState.findIndex((v) => {
            return v.key === key;
        });
        Vue.set(
            this.personCategoryBtnState[idx],
            'select',
            isSelect,
        );
    }
}