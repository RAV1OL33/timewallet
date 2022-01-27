import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeWalletComponent } from './time-wallet/time-wallet.component';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";



@NgModule({
    declarations: [
        TimeWalletComponent
    ],
    exports: [
        TimeWalletComponent
    ],
    imports: [
        CommonModule,
      BrowserModule,
      BrowserAnimationsModule
    ]
})
export class ItemsModule { }
