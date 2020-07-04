import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { tableWidth, tableHeight } from '../app-constant';
import { PopoverController } from '@ionic/angular';
import { PlaceMyRoboComponent } from './place-my-robo/place-my-robo.component';
import { ToastService } from './toast-msg.service';


// toy robot position interface
export interface Position {
  "xpos" : number;
  "ypos" : number;
  "facing" : number; // deg number allowed 0,90,180,270
} 

//direction const
const availableDirections = [
  {
    key:0,
    value : 'East'
  },
  {
    key:270,
    value : 'North'
  },
  {
    key:180,
    value : 'West'
  },
  {
    key:90,
    value : 'South'
  }
];


// direction of the toy
enum DirectionClasses {
  '90Deg'= "toy-north",
  '270Deg' = "toy-south",
  '0Deg' = "toy-east",
  '180Deg' = "toy-west"
}

// direction of the toy
enum Facing {
  '90Deg'= "North",
  '270Deg' = "South",
  '0Deg' = "East",
  '180Deg' = "West"
}

enum MoveDirection {
  'X+' = 'Linear-increasing',
  'Y+' = 'Vertical-increasing',
  'X-' = 'Linear-decreasing',
  'Y-' = 'Vertical-decreasing'
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit{
  tableWidth : number;
  tableHeight : number;
  private oneStepOnX_direction:number;
  private oneStepOnY_direction:number;
  currentPosition : Position;
  directions : any[];
  
  constructor(private renderer : Renderer2,
    private alertSerice : ToastService,
    private  popoverController: PopoverController,
    private alertController: AlertController ) {
    this.tableWidth = tableWidth;
    this.tableHeight = tableHeight;
    this.directions = availableDirections;
    this.oneStepOnX_direction = 100 / this.tableWidth;
    this.oneStepOnY_direction = 100 / this.tableHeight;
  }

  ngAfterViewInit() {
    // initialize the robo at (0,0) facing east
    this.currentPosition = {
      "xpos":0,
      'ypos':0,
      'facing':0
    };
    this.setPositionClassOfToyOnTable();
  }

  // take input for placement 
  async placeMyRobot() {
    console.log(this.currentPosition);
    
    const popover = await this.popoverController.create({
      component: PlaceMyRoboComponent,
      componentProps:{
        maximumWidth:this.tableWidth,
        maximumHeight:this.tableHeight,
        currentPosition : this.currentPosition,
        directionArray:this.directions
      }
    });
    await popover.present();
    let data = (await popover.onDidDismiss()).data;
    if(!!data && !!data.position) {
      this.placeToy(data.position["xpos"],data.position["ypos"],data.position["facing"])
    }
  }

  // place the toy
  placeToy(xPos:number,yPos:number,facing:number) {
    this.currentPosition["xpos"] = xPos
    this.currentPosition["ypos"] = yPos
    this.currentPosition["facing"] = facing;
    this.setPositionClassOfToyOnTable();
  }

  // rotate anti-clock wise (rotate left)
  rotateLeft() {
    this.currentPosition["facing"] = this.currentPosition["facing"] !== 0 ? this.currentPosition["facing"] - 90 :  270;
    console.log(this.currentPosition);
    this.setPositionClassOfToyOnTable();
  }

  // rotate clock wise (rotate right)
  rotateRight() {
    this.currentPosition["facing"] = this.currentPosition["facing"] !== 270 ? this.currentPosition["facing"] + 90 :  0;
    this.setPositionClassOfToyOnTable();
  }

  // move the toy in which it face
  moveToy() {
    if(this.currentPosition["facing"] === 270) {
      this.currentPosition["ypos"] = !!this.checkValidMove(1,'Y+') ? this.currentPosition["ypos"] + 1 : this.currentPosition["ypos"]; 
    }
    else if(this.currentPosition["facing"] === 180) {
      this.currentPosition["xpos"] = !!this.checkValidMove(1,'X-') ? this.currentPosition["xpos"] - 1 : this.currentPosition["xpos"];
    }
    else if(this.currentPosition["facing"] === 90) {
      this.currentPosition["ypos"] = !!this.checkValidMove(1,'Y-') ? this.currentPosition["ypos"] - 1 : this.currentPosition["ypos"];
    }
    else {
      this.currentPosition["xpos"] = !!this.checkValidMove(1,'X+') ? this.currentPosition["xpos"] + 1 : this.currentPosition["xpos"];
    }
    this.setPositionClassOfToyOnTable();
  }

  // report position
  async shoutCurrentStatus() {
    const alert = await this.alertController.create({
      header: 'Hi',
      subHeader: 'I am robot toy',
      message: 'I am on ('+this.currentPosition['xpos']+','+this.currentPosition['ypos']+') '+ 'and I am facing '+Facing[this.currentPosition['facing']+'Deg'],
      buttons: ['COOL']
    });
    await alert.present();
  }

  // set the position on the toy according to table size
  setPositionClassOfToyOnTable() {
    const xPosition:string = this.oneStepOnX_direction * this.currentPosition['xpos']+'%';
    const yPosition:string = this.oneStepOnY_direction * this.currentPosition['ypos']+'%';
    const robotFacingClass : string = 'rotate('+this.currentPosition['facing']+'Deg'+') '+this.setTranslation();
    let robot = document.querySelector('#myRobot');
    this.renderer.setStyle(robot,'left',xPosition);
    this.renderer.setStyle(robot,'bottom',yPosition);
    this.renderer.setStyle(robot,'transform',robotFacingClass);
  }

  setTranslation() {
    let translationPropertyCss : string;
    if(this.currentPosition['facing'] == 0) {
      translationPropertyCss = 'translateX(-50%) translateY(50%)';
    }
    else if(this.currentPosition['facing'] == 90) {
      translationPropertyCss = 'translateX(50%) translateY(50%)';
    }
    else if(this.currentPosition['facing'] == 180) {
      translationPropertyCss = 'translateX(50%) translateY(-50%)';
    }
    else {
      translationPropertyCss = 'translateX(-50%) translateY(-50%)';
    }
    return translationPropertyCss;
  }

  // check for valid move
  checkValidMove(moveAmount:number,direction:string) {
    let isValidMove : boolean = false;
    if(MoveDirection[direction] === 'Linear-increasing') {
      isValidMove = this.currentPosition['xpos'] + moveAmount <= this.tableWidth;
    }
    else if(MoveDirection[direction] === 'Linear-decreasing') {
      isValidMove = this.currentPosition['xpos'] - moveAmount >=  0;
    }
    else if(MoveDirection[direction] === 'Vertical-decreasing') {
      isValidMove = this.currentPosition['ypos'] - moveAmount  >=  0; 
    }
    else {
      isValidMove =  this.currentPosition['ypos'] + moveAmount <= this.tableHeight; 
    }
    if(!isValidMove) {
      this.presentError();
    }
    return isValidMove;
  }

  // error message for not a valid move
  async presentError() {
    this.alertSerice.showError('Not a valid move');
  }

}

