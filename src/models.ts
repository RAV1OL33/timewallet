export interface LangInterface {
  incomeTitle: string;
  incomeFrequency:{
    in:string;
    h:string;
    d:string;
    w:string;
    m:string;
    y:string;
  };
  purposeTitle: string;
  purposeInvestPercent: string;
  purposeWorkTime: {
    w: string,
    a: string
  };
  timerTitle: string;
  timerDimensionsTip: string;
  timerDimensions:{
    s:string;
    m:string;
    h:string;
    d:string;
    w:string;
    y:string;
  };
  timerThankUsText: string;
  thankUsBtn:string;
  shareBtn:string;
  textUsBtn:string;
}

export let RuLocale: LangInterface ={
  incomeTitle: 'Мой доход',
  incomeFrequency:{
    in:'в',
    h:'час',
    d:'день',
    w:'неделю',
    m:'месяц',
    y:'год',
  },
  purposeTitle: 'Хочу купить',
  purposeInvestPercent: 'Откладываю',
  purposeWorkTime: {
    w: 'раб. время',
    a: 'всё время'
  },
  timerTitle: 'Заплачу своей жизнью',
  timerDimensionsTip: 'годы•недели•дни•часы•минуты•секунды',
  timerDimensions:{
    s:'секунды',
    m:'минуты',
    h:'часы',
    d:'дни',
    w:'недели',
    y:'годы',
  },
  timerThankUsText: 'Если было полезно, познавательно, забавно и помогло осуществить или, наоброт, не осуществлять, и вы хотите поблагодарить - мы будем крайне признательны',
  thankUsBtn:'Спасибо',
  shareBtn:'Поделиться',
  textUsBtn:'Написать'
}
export let EnLocale: LangInterface ={
  incomeTitle: 'My income',
  incomeFrequency:{
    in:'per',
    h:'hour',
    d:'day',
    w:'week',
    m:'month',
    y:'year',
  },
  purposeTitle: 'Want to buy',
  purposeInvestPercent: 'put off',
  purposeWorkTime: {
    w: 'work time',
    a: 'all time'
  },
  timerTitle: 'Pay with my life',
  timerDimensionsTip: 'years•weeks•days•hours•minutes•seconds',
  timerDimensions:{
    s:'seconds',
    m:'minutes',
    h:'hours',
    d:'days',
    w:'weeks',
    y:'years',
  },
  timerThankUsText: 'Если было полезно, познавательно, забавно и помогло осуществить или, наоброт, не осуществлять, и вы хотите поблагодарить - мы будем крайне признательны',
  thankUsBtn:'Thank us',
  shareBtn:'Share',
  textUsBtn:'Contact us'
}

export interface UserProfile {
  income: any;
  incomeFrequency: number;
  incomeCurrency: number;
  purposeName: string;
  purposePrice: any;
  timeToBuy: number;
  putOffPercent: number;
  allTimeWork: boolean;
  /*timerFace:{
    s:string;
    m:string;
    h:string;
    d:string;
    w:string;
    y:string;
  };
  timerValue:{
    s:number;
    m:number;
    h:number;
    d:number;
    w:number;
    y:number;
  };*/
  userLang: boolean;
}
