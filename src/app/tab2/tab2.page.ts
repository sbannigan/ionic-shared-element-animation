import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardDetailKeyframeComponent } from '../card-detail-keyframe/card-detail-keyframe';
import { AnimateIn, AnimateOut } from '../animations/shared-element-modal';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    constructor(
        private modalCtrl: ModalController
    ) { }

    async viewDetail(img: HTMLImageElement) {
        const modal = await this.modalCtrl.create({
            component: CardDetailKeyframeComponent,
            enterAnimation: AnimateIn,
            leaveAnimation: AnimateOut,
            componentProps: {
                src: img.src,
                originEl: img
            }
        });
        modal.present();
    }

}
