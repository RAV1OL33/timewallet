import {Component, OnInit} from '@angular/core';
import {Subscription, interval} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

const shrinkTrigger = trigger(
  'shrinkTrigger', [
    state('*', style({fontSize: '5rem'})),
    state('true', style({fontSize: '5rem'})),
    state('false', style({fontSize: '4rem'})),
    state(':hover', style({fontSize: '4rem'})),
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
]);const fadeinTrigger2 = trigger(
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

const enterTransition = transition('true=>false', [
  style({
    opacity: 0
  }),
  animate('1s ease-in', style({
    opacity: 1
  }))
]);
const exitTransition = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('1s ease-out', style({
    opacity: 0
  }))
]);


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
  private fillSubscription: any;

  t_dimens = [
    {name: 's', format: 2}, {name: 'm', format: 2}, {name: 'h', format: 2},
    {name: 'd', format: 1}, {name: 'w', format: 2}, {name: 'y', format: 4}
  ]
  //time trigger
  t_trigger = {s: true, m: true, h: true, d: true, w:true, y: true};
  heartPulse = true;
  timer = {s: 0, m: 0, h: 0, d: 0, w: 0, y: 0}
  timer_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y:'0000'};
  next_timer_string = {s: '00', m: '00', h: '00', d: '0', w: '00', y:'0000'};

  isPulseDisabled = true;
  testu = true;

  userShoppingTarget: string = '';

  moneyPerSecond: number = 0;
  secondsTo: number = 3600;
  payingIntervalArray: number[] = [3600, 86400, 604800, 2592000, 31104000]
  activeCurrency: number = 0;

  userIncome: number = 0;
  activeUserIncomeInterval: number = 0;
  userShoppingTargetPrice: number = 0;
  timeToBuy: number = 0;
  incomePart: number = 5;
  userInvestmentPart: number = 0.05;

  constructor() {
  }

  ngOnInit(): void {
    this.t_trigger.s = true
  }

  changeIncomeInterval(incomeIntervalIndex: number) {
    this.secondsTo = this.payingIntervalArray[incomeIntervalIndex];
    this.activeUserIncomeInterval = incomeIntervalIndex;
  }

  calculateTimeDiff(t_ind: number) {
    // @ts-ignore
    this.timer_string[this.t_dimens[t_ind].name] = `${this.t_trigger[this.t_dimens[t_ind].name] ? this.timer[this.t_dimens[t_ind].name] : this.timer[this.t_dimens[t_ind].name] - 1}`.padStart(this.t_dimens[t_ind].format, '0');
    // @ts-ignore
    this.timer[this.t_dimens[t_ind].name]--;
    // @ts-ignore
    this.next_timer_string[this.t_dimens[t_ind].name] = `${this.t_trigger[this.t_dimens[t_ind].name] ? this.timer[this.t_dimens[t_ind].name] : this.timer[this.t_dimens[t_ind].name] + 1}`.padStart(this.t_dimens[t_ind].format, '0');
  }

  testTimerDimension(index: number){
    this.calculateTimeDiff(index);
    // @ts-ignore
    this.t_trigger[this.t_dimens[index].name] = !this.t_trigger[this.t_dimens[index].name];
  }
  private timerUpdate() {
    this.timeToBuy--;

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

    if (this.timeToBuy <= 0) {
      this.subscription.unsubscribe();
      this.isPulseDisabled = true;
    }
  }

  changeIncomePart(event: any) {
    this.userInvestmentPart = event.target.value
  }

  initTimer() {
    this.moneyPerSecond = this.userIncome / this.secondsTo;
    this.timeToBuy = this.userShoppingTargetPrice / (this.moneyPerSecond * this.userInvestmentPart);

    this.timer.s = +(this.timeToBuy % 60).toFixed();
    this.timer_string.s = `${this.timer.s}`.padStart(2, '0');
    this.next_timer_string.s = `${this.timer.s}`.padStart(2, '0');

    let minutes = Math.floor(this.timeToBuy / 60);
    this.timer.m = minutes % 60;
    this.timer_string.m = `${this.timer.m}`.padStart(2, '0');
    this.next_timer_string.m = `${this.timer.m}`.padStart(2, '0');

    let hours = Math.floor(minutes / 60);
    this.timer.h = hours % 24;
    this.timer_string.h = `${this.timer.h}`.padStart(2, '0');
    this.next_timer_string.h = `${this.timer.h}`.padStart(2, '0');

    let days = Math.floor(hours / 24);
    this.timer.d = days % 7;
    this.timer_string.d = `${this.timer.d}`;
    this.next_timer_string.d = `${this.timer.d}`;

    let weeks = Math.floor(days / 7);
    this.timer.w = weeks % 52;
    this.timer_string.w = `${this.timer.w}`.padStart(2, '0');
    this.next_timer_string.w = `${this.timer.w}`.padStart(2, '0');

    this.timer.y = Math.floor(weeks / 52);
    this.timer_string.y = `${this.timer.y}`.padStart(4, '0');
    this.next_timer_string.y = `${this.timer.y}`.padStart(4, '0');

  }

  beginCalculate() {
    this.initTimer();
    this.isPulseDisabled = false;
    this.subscription = interval(1000)
      .subscribe(x => {
        this.timerUpdate();
      });
  }
}
