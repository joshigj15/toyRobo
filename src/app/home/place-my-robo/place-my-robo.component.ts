import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ToastService } from '../toast-msg.service';

@Component({
  selector: 'app-place-my-robo',
  templateUrl: './place-my-robo.component.html'
})
export class PlaceMyRoboComponent implements OnInit {
  @Input() maximumWidth:number;
  @Input() maximumHeight:number;
  @Input() currentPosition;
  @Input() directionArray:any[];

  isValidMove:boolean;

  constructor(   
    private alertService :ToastService,
    private popoverController: PopoverController) {
      this.isValidMove = false;
     }

  ngOnInit() {
  }

  async close() {
    await this.popoverController.dismiss();
  }

  validMove() {
    // check that it do not exceeds the table width and height
    console.log(this.currentPosition);
    
    this.isValidMove = this.currentPosition['xpos'] <= this.maximumWidth ? this.currentPosition['xpos'] >= 0 : false;
    this.isValidMove = this.currentPosition['ypos'] <= this.maximumHeight ? this.currentPosition['ypos'] >= 0 : false;
    if(!!this.isValidMove) {
      this.closeWithData();
    }
    else {
      this.alertService.showError("You will fall");
    }
  }

  async closeWithData() {
      await this.popoverController.dismiss({
        position : this.currentPosition
      });
  }

}
