import { PlaceMyRoboComponent } from  './place-my-robo.component';
import { TestBed } from '@angular/core/testing';
import { PopoverController, IonicModule } from '@ionic/angular';
import { PopoverControllerMock, PopoverMock } from 'src/app/testing-utility/popover-mock';
import { createSpyObj } from 'src/app/testing-utility/create-spy';

describe('Component : Place Robot', ()=>{
    let popOverObj:any;
    let toastMessageServiceMock:any;
    beforeEach(()=>{
        toastMessageServiceMock = createSpyObj('ToastService',['showError']);
        popOverObj = PopoverControllerMock.instance(PopoverMock.instance().dismiss);
        TestBed.configureTestingModule({
            declarations : [PlaceMyRoboComponent],    
            imports : [IonicModule.forRoot()],
            providers :[
                { provide: PopoverController, useValue: popOverObj }
            ],
        }).compileComponents();
    })
    it('should create the app', ()=>{
        let fixture = TestBed.createComponent(PlaceMyRoboComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});