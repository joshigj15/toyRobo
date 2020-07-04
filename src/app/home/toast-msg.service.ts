import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class ToastService {


    constructor(private toastController: ToastController) {
    }

    /**
     * Method for rendering toast messages
     */
    async showError(messageText: string) {
        let notification = await this.toastController.create({
            message: messageText,
            duration: 2000,
            position: 'bottom',
            translucent: true,
            color: 'danger',
        });
        await notification.present();
    }

}
