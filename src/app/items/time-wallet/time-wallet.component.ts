import {Component, OnInit} from '@angular/core';
import {Subscription, interval, pipe, timeout} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {EnLocale, LangInterface, RuLocale, UserProfile} from "../../../models";
/*ng deploy TimeWallet --base-href=https://RAV1OL33.github.io/timewallet/
*/
const shrinkTrigger = trigger(
  'shrinkTrigger', [
    state('*', style({fontSize: '4em'})),
    state('true', style({fontSize: '4em'})),
    state('false', style({fontSize: '3em'})),
    state(':hover', style({fontSize: '3em'})),
    transition('true=>*', animate('.7s ease-in')),
    transition('false=>*', animate('.2s ease-out'))
  ]
)
const hoverShrinkTransition = transition('hover', [
  style({
    opacity: 0
  }),
  animate('1s ease-in', style({
    opacity: 1
  }))
]);
const fadeinTrigger2 = trigger(
  'fadeinTrigger2', [
    state('true', style({opacity: 0})),
    state('false', style({opacity: 1})),
    transition('*=>*', animate('.9s ease-in',))
  ]
)
const fadeoutTrigger2 = trigger(
  'fadeoutTrigger2', [
    state('true', style({opacity: 1})),
    state('false', style({opacity: 0})),
    transition('*=>*', animate('.9s ease-out',))
  ]
)
const fadeinTrigger = trigger(
  'fadeinTrigger', [
    state('true', style({opacity: 0})),
    state('false', style({opacity: 1})),
    transition('true=>false', animate('.9s ease-in',))
  ]
)
const fadeoutTrigger = trigger(
  'fadeoutTrigger', [
    state('true', style({opacity: 1})),
    state('false', style({opacity: 0})),
    transition('true=>false', animate('1s',))
  ]
)


@Component({
  selector: 'app-time-wallet',
  templateUrl: './time-wallet.component.html',
  styleUrls: ['./time-wallet.component.css'],
  animations: [
    fadeinTrigger, fadeoutTrigger, fadeinTrigger2, fadeoutTrigger2, shrinkTrigger,
  ]
})
export class TimeWalletComponent implements OnInit {

  private subscription: any;
  private fillAnimation$: any;
  private fillSubscription: any;

  locale_trigger = true;
  locale: LangInterface = this.locale_trigger ? EnLocale : RuLocale;

  t_dimens = [
    {name: 's', format: 2}, {name: 'm', format: 2}, {name: 'h', format: 2},
    {name: 'd', format: 1}, {name: 'w', format: 2}, {name: 'y', format: 4}
  ]
  heartPulse = true;
  /** timer - contain timer value
   *  t_trigger - serves to switch each timer dimension animation
   *  timer_string && timer_next_string - contain curr and next clockface value
   *
   *  f_.... - contains same for 'fill' animation for clockface
   */
  timer = {s: 0, m: 0, h: 0, d: 0, w: 0, y: 0}
  t_trigger = {s: true, m: true, h: true, d: true, w: true, y: true};
  timer_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y: '0000'};
  next_timer_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y: '0000'};

  f_clockface = {s: 0, m: 0, h: 0, d: 0, w: 0, y: 0};
  f_trigger = {s: true, m: true, h: true, d: true, w: true, y: true};
  f_clockface_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y: '0000'};
  f_clockface_next_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y: '0000'};

  isPulseDisabled = true;
  isInputDisabled = false;
  //TODO: actually use forms?
  isFormDirty = false;

  payingInterval: number[] = [3600, 86400, 604800, 2592000, 31104000];
  workTimePayingInterval: number[] = [3600, 86400, 144000, 594000, 7102800];
  moneyPerSecond: number = 0;
  timeToBuy: number = 0;
  bulk_userProfile: any = {};
  userProfile: UserProfile = {
    income: 0,
    incomeFrequency: 0,
    incomeCurrency: 0,
    purposeName: '',
    purposePrice: null,
    timeToBuy: 0,
    putOffPercent: 0.05,
    allTimeWork: true,
    //timerFace: this.timer_string,
    //timerValue: this.timer,
    userLang: false
  }

  constructor() {
  }

  ngOnInit(): void {
    let json_data = localStorage.getItem('user_data') || ''
    let json_save_date = localStorage.getItem('save_time') || ''
    let time_dif = Math.floor(
      (new Date().getTime() - new Date(json_save_date == '' ? '' : JSON.parse(json_save_date)).getTime()) / 1000
    );
    if (json_data != '') {

      this.bulk_userProfile = Object.assign({}, this.userProfile);
      this.userProfile = JSON.parse(json_data);

      //this.timer = this.userProfile.timerValue;
      //this.timer_string = Object.assign({}, this.userProfile.timerFace);
      //this.next_timer_string = Object.assign({}, this.userProfile.timerFace);
      this.userProfile.timeToBuy = this.userProfile.timeToBuy - time_dif;
      this.beginCalculate();
    }
    this.locale = this.userProfile.userLang ? EnLocale : RuLocale;
  }

  formatNumberInput(val: any) {
    return val.toString()
      .replace(/\s/g, '')
      .replace(/\D/g, '')
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
  }
  updateInputField(income_val: string, field: any) {
    //@ts-ignore
    this.userProfile[field] = +(income_val.toString().replace(/\s/g, '').replace(/\D/g, ''));
    this.updateClockFace();
  }

  fillClockFace() {
    this.f_clockface = {s: 0, m: 0, h: 0, d: 0, w: 0, y: 0};
    this.f_trigger = {s: false, m: false, h: false, d: false, w: false, y: false}
    this.fillAnimation$ = interval(10).subscribe(x => {
      // INF∞
      //TODO: refactor this
      if (this.f_clockface.s != this.timer.s) {
        this.f_clockface_string.s = `${this.f_clockface.s}`.padStart(2, '0');
        this.f_clockface.s++
        if (this.f_clockface.s > 60) this.f_clockface.s = 0
        this.f_clockface_next_string.s = `${this.f_clockface.s}`.padStart(2, '0');
      } else this.f_trigger.s = true
      if (this.f_clockface.m != this.timer.m) {
        this.f_clockface_string.m = `${this.f_clockface.m}`.padStart(2, '0');
        this.f_clockface.m++
        if (this.f_clockface.m > 60) this.f_clockface.m = 0
        this.f_clockface_next_string.m = `${this.f_clockface.m}`.padStart(2, '0');
      } else this.f_trigger.m = true
      if (this.f_clockface.h != this.timer.h) {
        this.f_clockface_string.h = `${this.f_clockface.h}`.padStart(2, '0');
        this.f_clockface.h++
        if (this.f_clockface.h > 60) this.f_clockface.h = 0
        this.f_clockface_next_string.h = `${this.f_clockface.h}`.padStart(2, '0');
      } else this.f_trigger.h = true
      if (this.f_clockface.d != this.timer.d) {
        this.f_clockface_string.d = `${this.f_clockface.d}`;
        this.f_clockface.d++
        if (this.f_clockface.d > 7) this.f_clockface.d = 0
        this.f_clockface_next_string.d = `${this.f_clockface.d}`;
      } else this.f_trigger.d = true
      if (this.f_clockface.w != this.timer.w) {
        this.f_clockface_string.w = `${this.f_clockface.w}`.padStart(2, '0');
        this.f_clockface.w++
        if (this.f_clockface.w > 52) this.f_clockface.w = 0
        this.f_clockface_next_string.w = `${this.f_clockface.w}`.padStart(2, '0');
      } else this.f_trigger.w = true
      if (this.f_clockface.y != this.timer.y && this.f_clockface.y < this.timer.y) {
        this.f_clockface_string.y = `${this.f_clockface.y}`.padStart(4, '0');
        this.f_clockface.y = this.f_clockface.y + (this.timer.y - this.f_clockface.y > 100 ? 111 : 1)
        if (this.f_clockface.y > 9999) return
        this.f_clockface_next_string.y = `${this.f_clockface.y}`.padStart(4, '0');
      } else this.f_trigger.y = true
      if (this.f_trigger.s && this.f_trigger.m && this.f_trigger.h && this.f_trigger.d && this.f_trigger.w && this.f_trigger.y) this.fillAnimation$.unsubscribe();
    });
  }

  updateClockFace() {
    this.isFormDirty = true;
    console.log(this.userProfile)
    this.initTimer();
    this.fillClockFace();
  }

  changeLocale() {
    this.userProfile.userLang = !this.userProfile.userLang;
    this.locale = this.userProfile.userLang ? EnLocale : RuLocale;
  }

  testTimerDimension(index: number) {
    this.calculateTimeDiff(index);
    // @ts-ignore
    this.t_trigger[this.t_dimens[index].name] = !this.t_trigger[this.t_dimens[index].name];
  }

  changeIncomeFrequency(i: number) {
    this.userProfile.incomeFrequency = i;
    this.updateClockFace();
  }

  changeIncomePart(event: any) {
    this.userProfile.putOffPercent = event.target.value;
    this.updateClockFace();
  }

  changeWorkTime() {
    this.userProfile.allTimeWork = !this.userProfile.allTimeWork;
    this.updateClockFace();
  }

  private calculateTimeDiff(t_ind: number) {
    // @ts-ignore
    this.timer_string[this.t_dimens[t_ind].name] = `${this.t_trigger[this.t_dimens[t_ind].name] ? this.timer[this.t_dimens[t_ind].name] : this.timer[this.t_dimens[t_ind].name] - 1}`.padStart(this.t_dimens[t_ind].format, '0');
    // @ts-ignore
    this.timer[this.t_dimens[t_ind].name]--;
    // @ts-ignore
    this.next_timer_string[this.t_dimens[t_ind].name] = `${this.t_trigger[this.t_dimens[t_ind].name] ? this.timer[this.t_dimens[t_ind].name] : this.timer[this.t_dimens[t_ind].name] + 1}`.padStart(this.t_dimens[t_ind].format, '0');
  }

  private timerUpdate() {
    this.userProfile.timeToBuy--;

    this.timer_string.s = `${this.timer.s}`.padStart(2, '0');
    this.timer.s--;
    this.next_timer_string.s = `${this.timer.s}`.padStart(2, '0');

    if (this.timer.s < 0) {
      this.timer.s = 59;
      this.next_timer_string.s = `${this.timer.s}`.padStart(2, '0');

      this.calculateTimeDiff(1);

      if (this.timer.m < 0) {
        this.timer.m = 60;
        //update minutes
        this.calculateTimeDiff(1);
        //update hours
        this.calculateTimeDiff(2);
        if (this.timer.h < 0) {
          this.timer.h = 24;
          this.calculateTimeDiff(2);

          this.calculateTimeDiff(3);
          if (this.timer.d < 0) {
            this.timer.d = 7;
            this.calculateTimeDiff(3);

            this.calculateTimeDiff(4);
            if (this.timer.w < 0) {
              this.timer.w = 52;
              this.calculateTimeDiff(4);

              this.calculateTimeDiff(5);
              this.t_trigger.y = !this.t_trigger.y;
            }
            this.t_trigger.w = !this.t_trigger.w;
          }
          this.t_trigger.d = !this.t_trigger.d;
        }
        this.t_trigger.h = !this.t_trigger.h;
      }
      this.t_trigger.m = !this.t_trigger.m;
    }

    this.t_trigger.s = !this.t_trigger.s;

    if (this.userProfile.timeToBuy <= 0) {
      this.next_timer_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y: '0000'};
      this.timer_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y: '0000'};
      this.userProfile = Object.assign({}, this.bulk_userProfile);
      this.subscription.unsubscribe();
      this.isPulseDisabled = true;
      this.isInputDisabled = false;

    }
  }

  initTimer() {
    if (this.isFormDirty) {
      this.moneyPerSecond = this.userProfile.income /
        (this.userProfile.allTimeWork ? this.payingInterval[this.userProfile.incomeFrequency] : this.workTimePayingInterval[this.userProfile.incomeFrequency]);
      this.userProfile.timeToBuy = this.userProfile.purposePrice / (this.moneyPerSecond * this.userProfile.putOffPercent);
    }
    this.timer.s = +(this.userProfile.timeToBuy % 60).toFixed();
    this.timer_string.s = `${this.timer.s}`.padStart(2, '0');
    this.next_timer_string.s = `${this.timer.s}`.padStart(2, '0');

    let minutes = Math.floor(this.userProfile.timeToBuy / 60);
    this.timer.m = minutes % 60;
    this.timer_string.m = `${this.timer.m}`.padStart(2, '0');
    this.next_timer_string.m = `${this.timer.m}`.padStart(2, '0');

    let hours = Math.floor(minutes / 60);
    this.timer.h = hours % (this.userProfile.allTimeWork ? 24 : 8);
    this.timer_string.h = `${this.timer.h}`.padStart(2, '0');
    this.next_timer_string.h = `${this.timer.h}`.padStart(2, '0');

    let days = Math.floor(hours / (this.userProfile.allTimeWork ? 24 : 8));
    this.timer.d = days % (this.userProfile.allTimeWork ? 7 : 5);
    this.timer_string.d = `${this.timer.d}`;
    this.next_timer_string.d = `${this.timer.d}`;

    let weeks = Math.floor(days / (this.userProfile.allTimeWork ? 7 : 5));
    this.timer.w = weeks % 52;
    this.timer_string.w = `${this.timer.w}`.padStart(2, '0');
    this.next_timer_string.w = `${this.timer.w}`.padStart(2, '0');

    this.timer.y = Math.floor(weeks / 52);
    if (this.timer.y > 9999) this.timer.y = 9999;
    this.timer_string.y = `${this.timer.y}`.padStart(4, '0');
    this.next_timer_string.y = `${this.timer.y}`.padStart(4, '0');
  }

  pauseTimer() {
    //this.heartPulse = !this.heartPulse;
    this.isPulseDisabled = true;
    this.isInputDisabled = !this.isInputDisabled;
    if (this.isInputDisabled)
      this.beginCalculate();
    else
      this.subscription.unsubscribe();
  }

  beginCalculate() {

    this.initTimer();
    this.isPulseDisabled = false;
    this.isInputDisabled = true;
    this.isFormDirty = false;

    this.subscription = interval(1000)
      .subscribe(x => {
        this.timerUpdate();
        //this.userProfile.timerFace = this.timer_string;
        //this.userProfile.timerValue = this.timer;
        localStorage.setItem('user_data', JSON.stringify(this.userProfile));
        localStorage.setItem('save_time', JSON.stringify(new Date()));
      });
  }
}
