import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletHistoryPage } from './wallet-history.page';

describe('WalletHistoryPage', () => {
  let component: WalletHistoryPage;
  let fixture: ComponentFixture<WalletHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletHistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
