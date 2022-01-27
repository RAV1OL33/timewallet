import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeWalletComponent } from './time-wallet.component';

describe('TimeWalletComponent', () => {
  let component: TimeWalletComponent;
  let fixture: ComponentFixture<TimeWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
