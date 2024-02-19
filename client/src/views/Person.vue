<template>
  <div class="person" :class="{ quiz: progress > 0 }">
    <img class="preload" :src="picUrl" />
    <section v-if="progress === 0" class="person__desc">
      <span>옵션을 선택하세요.</span><span class="suffix">(퀴즈 중간에도 변경 가능)</span>
    </section>

    <form v-if="progress === 0" class="person__option" @submit.prevent="startQuiz()">
      <section class="person__option__group">
        <section class="person__option__title">
          <span class="person__option__title__text">장르</span>
          <div class="person__option__title__action">
            <input id="all-genre" type="checkbox" v-model="selectAll" />
            <label for="all-genre" :class="{ all: selectAll }">전체선택</label>
          </div>
        </section>
        <section v-if="categoryData.length > 0" class="person__option__btns">
          <label v-for="btn in btns" :key="btn.key" :for="btn.key" class="btn-type-1 person__option__btns__ele" :class="{ inactive: !btn.select, soon: isDisabledCategory(btn.key) }">
            {{ btn.text }}
            <input :id="btn.key" :disabled="isDisabledCategory(btn.key)" type="checkbox" v-model="btn.select" />
          </label>
        </section>
      </section>

      <section class="person__option__group">
        <section class="person__option__title">
          <span class="person__option__title__text">제한시간</span>
          <div class="person__option__title__action">
            <button type="button" class="person__option__title__action--modifier btn-type-1" @click="modifyTimeLimit(-1)">-</button>
            <span class="person__option__title__action--timelimit">{{ timeLimit }}초</span>
            <button type="button" class="person__option__title__action--modifier btn-type-1" @click="modifyTimeLimit(1)">+</button>
          </div>
        </section>
      </section>

      <button
        class="btn-type-1 person__option__submit"
        :disabled="selectCategories.length === 0"
        type="submit">시작하기</button>
    </form>


    <section v-else class="person__quiz" :class="{ countdown: progress === 1 }">
      <transition-group tag="div" name="countdown" mode="in-out" class="person__quiz__countdown" v-if="progress === 1">
        <span class="countdown" v-if="showCountdown" :key="countdown">{{ countdown }}</span>
      </transition-group>
      <div v-if="playHistory.length > 0 && progress === 1" class="person__quiz__stat">
        <div class="person__quiz__stat__fraction">
          {{ playHistoryStat.correct }} / {{ playHistoryStat.total }}
        </div>
        <div class="person__quiz__stat__percent">
          정답률 <span class="num">{{ playHistoryStat.percent }}%</span>
        </div>
      </div>
      <div class="person__quiz__content" v-if="progress === 2 || progress === 3">
        <section class="person__quiz__content__pic" :class="{ mobile: isMobile }" ref="person-pic" :style="{ 'background-image': `url(${picUrl})`}" :key="picUrl"></section>

        <section v-if="progress === 2" class="person__quiz__content__countdown">
          <div class="timer-gradient" :style="{ width: `${answerCountdown / timeLimit * 100}%` }"></div>
          <div class="text">{{ answerCountdown | fixed1 }}</div>
        </section>
        <section v-else class="person__quiz__content__judge" :class="{ correct: isCorrect, wrong: !isCorrect }">{{ isCorrect ? '정답입니다!' : '틀렸습니다!' }}</section>

        <section class="person__quiz__content__input">
          <div class="person__quiz__content__input__stat">{{ playHistoryStat.correct }} / {{ playHistoryStat.total }}</div>
          <form class="person__quiz__content__input__form" v-if="progress === 2" @submit.prevent="submitAnswer">
            <input v-if="isMobile" ref="answer_input" type="text" placeholder="누구..?" v-model="answer" @focus="onFocusInput" @blur="onBlurInput" />
            <input v-else ref="answer_input" autofocus type="text" placeholder="누구..?" v-model="answer" />
            <button type="submit"><img :src="require('../assets/img/go.svg')"></button>
          </form>
          <div class="person__quiz__content__input__answer" v-else>
            <div class="person__quiz__content__input__answer__prefix">정답은</div>
            <div class="person__quiz__content__input__answer__suffix">
              <div class="person__quiz__content__input__answer__suffix--main" :class="{ correct: lastPlayHistory.correct, wrong: !lastPlayHistory.correct }">{{ lastPlayHistory ? lastPlayHistory.answer : '' }}</div>
              <div class="person__quiz__content__input__answer__suffix--sub" v-if="lastPlayHistory.subanswer.length > 0">
                {{ lastPlayHistory.subanswer.join(', ') }}
              </div>
            </div>
          </div>
          <div class="dummy" ref="dummy" v-if="progress === 2 && isMobile">
          </div>
        </section>
        <button class="btn-type-1 person__quiz__content__next" :class="{ show: progress === 3 }" type="button" @click="onClickNextQuiz">다음문제...{{ isAutoNextRound ? nextRoundCountdown : '' }}</button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '~@/assets/styles/common.scss';

.countdown-enter-active, .countdown-leave-active {
  transition: all 0.44s cubic-bezier(0.7, 0, 0.84, 0);
  transform: scale(1);
}
.countdown-leave-to {
  opacity: 0;
}
.countdown-enter {
  opacity: 0;
  transform: scale(3);
}

.person {
  position: relative;

  .dummy {
    height: 7em;
    opacity: 0;
  }

  .preload {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 1px;
    height: 1px;
  }
  &.quiz {
    height: calc(100vh - (2rem + 33px + 42px + 20px));
  }
  &__desc {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 45px 0 45px 0;
    span {
      font-family: book;
      font-size: 1.1em;
      font-weight: 700;
      color: var(--text);

      &.suffix {
        font-size: 0.9em;
        margin-left: 0.4em;
      }
    }
  }

  &__option {
    font-family: book;
    font-weight: 700;
    margin-bottom: 2em;
    min-height: calc(100vh - (2rem + 33px));;
    &__group {
      margin-bottom: 2em;
    }

    &__title {
      box-sizing: border-box;
      padding: 0 35px;
      display: flex;
      align-items: center;

      &__text {
        font-size: 1.4em;
        flex: 1;
        cursor: default;
      }

      &__action {
        input {
          visibility: hidden;
        }
        label {
          cursor: pointer;
          user-select: none;
          margin-left: 0.5em;
          font-size: 1.1em;
          &:before {
            content: '';
            display: inline-block;
            width: 1.0em;
            height: 1.0em;
            border: 1px solid var(--select-all-inactive-checkbox-border);
            border-radius: 1.2em;
            margin-right: 0.3em;
            vertical-align: middle;
            text-align: center;
          }

          &.all {
            color: var(--select-all-active);
            &:before {
              background-image: url(~@/assets/img/checked.png);
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
          }
        }
        &--timelimit {
          font-size: 1.4em;
        }
        &--modifier {
          box-sizing: border-box;
          padding: 0.4em 1em;
          border-radius: 1em;
          margin: 0 1em;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    &__btns {
      width: 100%;
      display: flex;
      margin-top: 0.5em;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 30px;

      &__ele {
        position: relative;
        font-family: book;
        font-weight: 700;
        color: var(--person-option-btn-active-text);
        font-size: 1.1em;
        text-align: center;
        box-sizing: border-box;
        padding: 16px 13px;
        margin: 5px 10px;
        user-select: none;
        background: linear-gradient(320.14deg, var(--btn-gradient-1) 23.13%, var(--btn-gradient-2) 77.62%);

        &.inactive {
          background: var(--person-option-btn-inactive-background);
          color: var(--person-option-btn-inactive-text);
          opacity: 0.5;
        }

        &.soon {
          position: relative;
          background: var(--btn-disabled-background);
          color: var(--btn-comingsoon-text);
          border-color: var(--btn-comingsoon-text);
          cursor: not-allowed;

          &:after {
            position: absolute;
            content: '준비중';
            display: block;
            font-size: 11px;
            top: 3px;
          }
        }


        input {
          width: 1px;
          height: 1px;
          position: absolute;
          visibility: hidden;
          bottom: 0;
          left: 0;
        }
      }
    }

    &__submit {
      width: calc(100% - 60px);
      margin: 0 30px 90px 30px;
      font-size: 1.4em;
      box-sizing: border-box;
      padding: 19px 0;
    }
  }

  &__quiz {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    &.countdown {
      justify-content: center;
    }

    &__countdown {
      position: relative;
      width: 100px;
      margin-bottom: 5em;

      .countdown {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        font-size: 3rem;
      }

    }


    &__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--btn-stat-text);

      &__fraction {
        font-size: 1.3em;
        margin-bottom: 10px;
      }
      &__percent {
        font-size: 1.3em;
      }
    }
    

    &__content {
      position: relative;
      &.fixed {
        position: fixed;
        bottom: 0;
      }
      &__pic {
        width: 70vw;
        max-width: 442px;
        height: 80vw;
        max-height: 38vh;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin: 0 auto;

        &.mobile {
          background-size: contain;
          background-position: center center;
          max-width: 450px;
          max-height: 33vh;
        }
      }

      &__countdown, &__judge {
        text-align: center;
        font-weight: 400;
        font-size: 1.4em;
        margin: 1.0em 0;
        height: 26px;

        &.correct {
          font-weight: 700;
          color: var(--person-quiz-correct);
        }
        &.wrong {
          font-weight: 700;
          color: var(--person-quiz-wrong);
        }
      }
      &__judge {
        height: 30px;
      }

      &__countdown {
        position: relative;
        border: 2px solid var(--ctd-border);
        border-radius: 10px;
        overflow: hidden;

        .timer-gradient {
          position: absolute;
          background: linear-gradient(to right, var(--ctd-gradient-1), var(--ctd-gradient-2), var(--ctd-gradient-3));
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 0;
        }
        .text {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 1;
          color: var(--ctd-text);
        };
      }

      &__input {
        &__stat {
          padding: 0 0 0.3em 0.3em;
          font-size: 1.06em;

          &:after {
            content: '(정답 수/총 퀴즈 수)';
            font-size: 0.7em;
            color: var(--person-quiz-stat-suffix-text);
            margin-left: 1em;
            font-weight: 200;
          }
        }

        &__form, &__answer {
          display: flex;
          align-items: center;
          background-color: var(--person-quiz-background);
          border-radius: 10px;
          overflow: hidden;

          input {
            flex: 1;
            height: 60px;
            outline: none;
            border: 0;
            margin: 0;
            padding: 0 1em;
            background: var(--person-quiz-input-background);
            color: var(--person-quiz-input-text);
            text-align: center;
          }
          button {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            padding: 0;
            margin: 0;
            border-radius: 0;
            outline: none;
            border: 0;
            opacity: 0.9;
            background: linear-gradient(320.14deg, var(--btn-gradient-1) 23.13%, var(--btn-gradient-2) 77.62%);

            &:hover {
              border: 0;
              opacity: 1.0;
            }
          }
        }

        &__answer {
          height: 60px;

          &__prefix {
            margin: 0 7px 0 13px;
            font-size: 16px;
          }
          &__suffix {
            flex: 1;
            padding-right: 13px;
            &--main {
              font-size: 22px;

              &.correct {
                color: var(--person-quiz-correct);
              }
              &.wrong {
                color: var(--person-quiz-wrong);
              }
            }
            &--sub {
              font-size: 16px;
            }
          }
        }
      }
      &__next {
        width: 100%;
        padding: 19px 0;
        text-align: center;
        visibility: hidden;
        margin-top: 1em;

        &.show {
          visibility: visible;
        }
      }
    }
  }
}
</style>>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Mutation, Action, Getter } from 'vuex-class';
import axios from 'axios';
import qs from 'qs';
import big from 'big.js';

import { IPersonCategoryState, IPersonCategory } from '../store/modules/game';

export enum EProgress {
  setting = 0,
  countdown = 1,
  quiz = 2,
  result = 3
}

export interface IQuiz {
  personId: string;
  picId: string;
  category: string;
}

export interface IQuizResult {
  personId: string;
  correct: boolean;
  answer: string;
  subanswer: string[];
}

@Component({
  components: {},
  filters: {
    fixed1: (value: number) => {
      return big(value).toFixed(1, 0);
    },
  }
})
export default class Person extends Vue {
  @State('timeLimit', { namespace: 'game' }) private timeLimit!: number;
  @State('solvedPersonStorageKey', { namespace: 'game' }) private solvedPersonStorageKey!: string;
  @State('personCategoryBtnState', { namespace: 'game' }) private btns!: IPersonCategoryState[];
  @State('personCategoryData', { namespace: 'game' }) private categoryData!: IPersonCategory[];

  @State('token', { namespace: 'user' }) private token!: string;

  @Getter('isLoggedIn', { namespace: 'user' }) private isLoggedIn!: boolean;

  @Mutation('setTimeLimit', { namespace: 'game' }) private setTimeLimit!: (timeLimit: number) => void;
  @Mutation('setPersonSelectCategory', { namespace: 'game' }) private setPersonSelectCategory!: ({key, isSelect}: {key: string, isSelect: boolean}) => void;
  @Mutation('setPersonCategoryData', { namespace: 'game' }) private setPersonCategoryData!: (c: IPersonCategory[]) => void;

  @Mutation('setShowSubNav', { namespace: 'ui' }) private setShowSubNav!:(show: boolean) => void;
  @Mutation('setSubNavComponent', { namespace: 'ui' }) private setSubNavComponent!:(comp: string) => void;

  @Action('login', { namespace: 'user' }) private login!: () => Promise<void>;

  private progress: EProgress = EProgress.setting;

  private countdownInterval: number = -1;
  private countdown: number = 3;
  private showCountdown: boolean = false;

  private answerCountdown = 2;
  private answerCountdownInterval: number = -1;
  private answer: string = '';
  private isCorrect = false;

  private nextRoundCountdownInterval: number = -1;
  private nextRoundCountdown = 3;

  private isAutoNextRound: boolean = false;

  private currentQuiz: IQuiz | undefined;
  private picUrl: string = '/sample.jpg';

  private playHistory: IQuizResult[] = [];

  private retryCount: number = 0;
  private onMobileInput: boolean = false;


  @Watch('progress')
  private async onChangeProgress(curProgress: EProgress, prevProgress: EProgress) {
    if (prevProgress === EProgress.setting) {
      this.setSubNavComponent('PersonSubNavBar');
      this.setShowSubNav(true);
    }
    if (this.progress === EProgress.setting) {
      window.localStorage.removeItem(this.solvedPersonStorageKey);
    } else if (this.progress === EProgress.countdown) {
      window.scrollTo(0, 0);
      this.countdown = 2;
      this.startCountdown();
      this.onMobileInput = false;
    } else if (this.progress === EProgress.quiz) {
      window.scrollTo(0, 0);
      this.answerCountdown = this.timeLimit;
      this.startAnswerCountdown();
    } else if (this.progress === EProgress.result) {
      window.scrollTo(0, 0);
      this.onMobileInput = false;
      this.nextRoundCountdown = 2;
      if (this.isAutoNextRound) {
        this.startNextRoundCountdown();
      }
      window.addEventListener('keydown', this.detectEnterToNext);
    }
  }

  private onFocusInput(ev: any) {
    if (this.isMobile) {
      window.setTimeout(() => {
        (this.$refs['dummy']! as any).scrollIntoView(false);
      }, 500);
      this.onMobileInput = true;
    }
  }
  private onBlurInput() {
    if (this.isMobile) {
      this.onMobileInput = false;
    }
  }
  private detectEnterToNext(ev: any) {
    ev.preventDefault();
    if (ev.key === 'Enter' || ev.keyCode === 13) {
      this.onClickNextQuiz();
    }
  }
  
  private get playHistoryStat(): { correct: number, total: number, percent: string } {
    if (this.playHistory.length === 0) {
      return { correct: 0, total: 0, percent: '0' };
    }
    const correct = this.playHistory.filter((result) => result.correct).length;
    const total = this.playHistory.length;
    const percent = big(correct).div(total).times(100).toFixed(2, 0);
    return { correct, total, percent };
  }
  private get lastPlayHistory(): IQuizResult | undefined {
    if (this.playHistory.length === 0) {
      return undefined;
    }
    return this.playHistory[this.playHistory.length - 1];
  }
  private get selectCategories(): string[] {
    return this.btns.filter((btn) => btn.select).map((btn) => btn.key);
  }

  private get selectAll(): boolean {
    return this.btns.filter((btn) => {
      return !this.isDisabledCategory(btn.key);
    }).every((btn) => btn.select );
  }

  private get isMobile(): boolean {
    return (window as any).isMobile.phone;
  }
  
  private async created() {
    const { data } = await axios.get(`${process.env.VUE_APP_API_BASE}/person/category`);
    this.setPersonCategoryData(data);
    this.btns.forEach((btn) => {
      this.setPersonSelectCategory({
        key: btn.key,
        isSelect: !this.isDisabledCategory(btn.key)
      });
    });
  }
   private async onClickNextQuiz() {
    window.removeEventListener('keydown', this.detectEnterToNext);
    this.setProgress(EProgress.countdown);
  }

  private async requestNextQuiz() {
    let solvedIdList;
    try {
      if (window.localStorage.getItem(this.solvedPersonStorageKey)) {
        solvedIdList = JSON.parse(
          window.localStorage.getItem(this.solvedPersonStorageKey) || '[]'
        );
      } else {
        solvedIdList = [];
      }
      
      const qString = qs.stringify({
        category: this.selectCategories,
        solved: solvedIdList,
      });
      const headers: any = {
        Authorization: `${this.token}`,
      };
      const recaptchaToken = await new Promise((resolve, reject) => {
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha.execute(
            process.env.VUE_APP_RECAPTCHA_SITE_KEY || '',
            { action: 'submit' }
          ).then((token: string) => {
            resolve(token);
          }).catch((e: any) => reject(e));
        });
      });
      headers['x-recaptch-token'] = recaptchaToken;

      const { data } = await axios.get(
        `${process.env.VUE_APP_API_BASE}/person/quiz?${qString}`, 
        {
          headers,
        }
      );
      if (data.end) {
        alert('해당 카테고리 모든 퀴즈를 다 풀었습니다. 홈으로 돌아갑니다.');
        this.$router.push('/');
        return;
      }
      this.currentQuiz = data;
      window.localStorage.setItem(this.solvedPersonStorageKey, JSON.stringify([ this.currentQuiz!.personId, ...solvedIdList ]));
      this.picUrl = `${process.env.VUE_APP_PIC_BASE}/person/${this.currentQuiz!.picId}`;
      this.retryCount = 0;
    } catch (e) {
      if (this.retryCount > 3) {
        alert('퀴즈를 불러오는데 실패했습니다. 홈으로 돌아갑니다.');
        this.$router.push('/');
        return;
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.retryCount += 1;
          this.requestNextQuiz().then(resolve).catch(reject);
        }, 2000);
      });
    }
  }

  private isDisabledCategory(categKey: string): boolean {
    const idx = this.categoryData.findIndex((cd) => {
      return cd.category === categKey;
    });

    if (idx < 0) {
      return true;
    } else {
      return !this.categoryData[idx].isAvailable;
    }
  }

  private beforeDestroy() {
    window.clearInterval(this.countdownInterval);
    window.clearInterval(this.answerCountdownInterval);
    window.clearInterval(this.nextRoundCountdownInterval);

    window.localStorage.removeItem(this.solvedPersonStorageKey);
    window.removeEventListener('keydown', this.detectEnterToNext);

    this.setSubNavComponent('');
    this.setShowSubNav(false);
  }

  private async startCountdown() {
    this.answer = '';
    this.showCountdown = true;
    this.$nextTick(() => {
      this.countdown -= 1;
      window.scrollTo(0, 0);
      this.countdownInterval = window.setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.answerCountdown = this.timeLimit;
          this.$nextTick(() => {
            this.setProgress(EProgress.quiz);
            this.showCountdown = false;

            this.$nextTick(() => {
              if (this.$refs['answer_input']) {
                if (!this.isMobile) {
                  (this.$refs['answer_input'] as any).focus();
                }
              }
            })
          });
        }
      }, 950);
    });
    this.requestNextQuiz();
  }

  private set selectAll(select: boolean) {
    this.btns.forEach((btn) => {
      if (!this.isDisabledCategory(btn.key)) {
        this.setPersonSelectCategory({
          key: btn.key,
          isSelect: select,
        });
      }
    });
  }

  private modifyTimeLimit(val: number) {
    const newVal = Math.min(20, Math.max(1, this.timeLimit + val));
    this.setTimeLimit(newVal);
  }

  private async startQuiz() {
    if (!this.isLoggedIn) {
      await this.login();
    }
    
    this.setProgress(EProgress.countdown);
  }

  private setProgress(state: EProgress) {
    this.progress = state;
  }

  private async submitAnswer() {
    this.onMobileInput = false;
    try {
      const { data }: { data: IQuizResult } = await axios.post(
        `${process.env.VUE_APP_API_BASE}/person/answer/${this.currentQuiz!.personId}`,
        {
          answer: this.answer,
        },
        {
          headers: {
            Authorization: `${this.token}`,
          }
        }
      );
      this.isCorrect = data.correct;
      this.playHistory.push(data);
      clearInterval(this.answerCountdownInterval);
      this.setProgress(EProgress.result);
    } catch (e) {
      this.isCorrect = false;
      this.playHistory.push({
        correct: false,
        personId: this.currentQuiz!.personId,
        answer: '',
        subanswer: [],
      });
      clearInterval(this.answerCountdownInterval);
      this.setProgress(EProgress.result);
    }
    
  }

  private startAnswerCountdown() {
    this.answerCountdownInterval = window.setInterval(async () => {
      this.answerCountdown = big(this.answerCountdown).sub(0.01).toNumber();
      if (big(this.answerCountdown).lte(0)) {
        await this.submitAnswer();
      }
    }, 10);
  }

  private startNextRoundCountdown() {
    this.nextRoundCountdownInterval = window.setInterval(async () => {
      this.nextRoundCountdown -= 1;
      if (this.nextRoundCountdown === 0) {
        clearInterval(this.nextRoundCountdownInterval);
        await this.requestNextQuiz();
        this.$nextTick(() => {
          this.setProgress(EProgress.quiz);
        });
      }
    }, 1000)
  }
}
</script>
