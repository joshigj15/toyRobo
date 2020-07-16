import { HomePage } from  './home.page';
import { TestBed } from '@angular/core/testing';
import { PopoverControllerMock, PopoverMock } from '../testing-utility/popover-mock';
import { PopoverController, AlertController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { tableWidth, tableHeight } from '../app-constant';
import { AlertControllerMock } from '../testing-utility/alert-mock';
import { By } from '@angular/platform-browser';
import { createSpyObj } from '../testing-utility/create-spy';
import { ToastService } from './toast-msg.service';

describe('Component : Home', ()=>{
    let alertObj:any;
    let popOverObj:any;
    let toastMessageServiceMock:any;
    beforeEach(async()=>{
        toastMessageServiceMock = createSpyObj('ToastService',['showError']);
        popOverObj = PopoverControllerMock.instance(PopoverMock.instance().present);
        alertObj = AlertControllerMock.instance();

        TestBed.configureTestingModule({
            declarations : [
                HomePage
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers :[
                { provide: ToastService, useValue: toastMessageServiceMock },
                { provide: PopoverController, useValue: popOverObj },
                { provide: AlertController, useValue : alertObj}
            ]

        }).compileComponents();
    });

    it('should create the app', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'Curve Table'`, ()=>{
        let fixture = TestBed.createComponent(HomePage);
        let app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('Curve Table');
    });

    it('title in h3 tag', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h3').textContent).toContain('Curve Table');
    });

    it(`should have as table width`, ()=>{
        let fixture = TestBed.createComponent(HomePage);
        let app = fixture.debugElement.componentInstance;
        expect(app.tableWidth).toEqual(tableWidth);
    });

    it(`should have as table height`, ()=>{
        let fixture = TestBed.createComponent(HomePage);
        let app = fixture.debugElement.componentInstance;
        expect(app.tableHeight).toEqual(tableHeight);
    });

    it('dimension of table in p tag', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        let dimensionText : string = 'Dimension Assumed (' + tableWidth +' * ' + tableHeight + ')';
        expect(compiled.querySelector('.dimension').textContent).toContain(dimensionText);
    });

    it('assumption in p tag', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        let assumption:string = "Toy is assumed as point object (very smaller than table) so its width and height are not considered"
        expect(compiled.querySelector('.assumption').textContent).toContain(assumption);
    });

    it('instruction in div tag', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        let instruction:string = "Click robot to know position";
        expect(compiled.querySelector('.instruction').textContent).toContain(instruction);
    });

    it('current position of toy robot', ()=> {
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        expect(app.currentPosition.xpos).toBeLessThanOrEqual(tableWidth);
        expect(app.currentPosition.ypos).toBeLessThanOrEqual(tableHeight);
        expect(app.currentPosition.facing).toBeGreaterThanOrEqual(0);
        expect(app.currentPosition.facing).toBeLessThanOrEqual(270);
    });

    it('table is available', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.table')).toBeTruthy();
    });

    it('my robo should be on table', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('#myRobot')).toBeTruthy();
    });

    it('all four buttons should be there', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let compiled = fixture.debugElement.queryAll(By.css('ion-button'));
        expect(compiled.length).toEqual(4);
    });

    it('shout my location working', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let myRobo : HTMLElement = fixture.debugElement.nativeElement.querySelector('#myRobot');
        myRobo.click();
        expect(alertObj.create).toHaveBeenCalled();
    });

    it('when place robo button the app popOver should be open', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let placeRoboButton : HTMLButtonElement = fixture.debugElement.queryAll(By.css('ion-button'))[0].nativeElement;
        placeRoboButton.click();
        expect(popOverObj.present).toBeUndefined();
    });

    it('when make a valid move when facing North', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 270
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(3);
        expect(app.currentPosition.facing).toEqual(270);
    });

    it('when make an invalid move when facing North', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 5,
            facing : 270
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(5);
        expect(app.currentPosition.facing).toEqual(270);
        expect(toastMessageServiceMock.showError).toHaveBeenCalled();
    });

    it('when make a valid move when facing South', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 90
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(1);
        expect(app.currentPosition.facing).toEqual(90);
    });

    it('when make an invalid move when facing South', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 0,
            facing : 90
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(0);
        expect(app.currentPosition.facing).toEqual(90);
        expect(toastMessageServiceMock.showError).toHaveBeenCalled();
    });

    it('when make a valid move when facing West', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 2,
            ypos : 2,
            facing : 180
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(1);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(180);
    });

    it('when make an invalid move when facing West', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 0,
            facing : 180
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(0);
        expect(app.currentPosition.facing).toEqual(180);
        expect(toastMessageServiceMock.showError).toHaveBeenCalled();
    });

    it('when make a valid move when facing East', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 0
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(1);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(0);
    });

    it('when make an invalid move when facing West', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 5,
            ypos : 0,
            facing : 0
        };
        let moveRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#move');
        moveRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(5);
        expect(app.currentPosition.ypos).toEqual(0);
        expect(app.currentPosition.facing).toEqual(0);
        expect(toastMessageServiceMock.showError).toHaveBeenCalled();
    });

    it('when rotate 90 left while facing north', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 270
        };
        let leftRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#left');
        leftRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(180);
    });

    it('when rotate 90 left while facing South', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 90
        };
        let leftRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#left');
        leftRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(0);
    });

    it('when rotate 90 left while facing West', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 180
        };
        let leftRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#left');
        leftRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(90);
    });

    it('when rotate 90 left while facing East', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 0
        };
        let leftRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#left');
        leftRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(270);
    });

    it('when rotate 90 Right while facing north', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 270
        };
        let rightRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#right');
        rightRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(0);
    });

    it('when rotate 90 Right while facing South', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 90
        };
        let rightRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#right');
        rightRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(180);
    });

    it('when rotate 90 Right while facing West', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 180
        };
        let rightRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#right');
        rightRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(270);
    });

    it('when rotate 90 Right while facing East', ()=>{
        let fixture = TestBed.createComponent(HomePage);
        fixture.detectChanges();
        let app = fixture.debugElement.componentInstance;
        app.currentPosition = {
            xpos : 0,
            ypos : 2,
            facing : 0
        };
        let rightRoboButton : HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#right');
        rightRoboButton.click();
        expect(app.currentPosition.xpos).toEqual(0);
        expect(app.currentPosition.ypos).toEqual(2);
        expect(app.currentPosition.facing).toEqual(90);
    });

    
    
});

export class ToastMessageServiceMock {
    public static instance(): any {
      const instance = createSpyObj('Toast', [
        'present',
        'dismissAll',
        'setContent',
        'setSpinner'
      ]);
      instance.present.and.returnValue(Promise.resolve());
      return instance;
    }
}

