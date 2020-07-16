import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast-msg.service';
import { ToastController } from '@ionic/angular';
import { ToastControllerMock } from '../testing-utility/toast-mock';


describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers :[
            { provide : ToastController, useClass : ToastControllerMock}
        ]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
