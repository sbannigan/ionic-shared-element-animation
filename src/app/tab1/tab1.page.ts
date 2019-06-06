import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnimateIn, AnimateOut } from '../animations/shared-element-modal';
import { CardDetailKeyframeComponent } from '../card-detail-keyframe/card-detail-keyframe';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    constructor(
        private modalCtrl: ModalController
    ) { }

    loadingIndex: number;
    indexLoaded: number;
    slowEnabled: boolean;

    gridItems = [
        {
            image: 'https://source.unsplash.com/1VwnyOv40bQ/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/aaIN3y2zcMQ/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/ZVB51OWrriM/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/KqDPFodx-d0/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/Gv-bIY2M4xo/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/yQkwYCMauKc/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/RXi9NAlwB00/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/HOZBkahTT_w/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/uGz2WEvP1b0/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/uQDRDqpYJHI/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/5Ijn2-YYJio/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/zJnro_vjewE/1000x1000'
        },
        {
            image: 'https://source.unsplash.com/x_9Btz9Pczo/1000x1000'
        }
    ];

    ngOnInit() {
        this.slowEnabled = !!localStorage.getItem('speed');
    }

    toggleSpeed(e) {
        if (e.detail.checked) {
            localStorage.setItem('speed', '5000');
        } else {
            localStorage.removeItem('speed');
        }
    }

    async viewDetail(ev: any, item: any, index: number) {
        if (!this.loadingIndex) {
            this.loadingIndex = index;
            const res = await fetch(item.image);
            const modal = await this.modalCtrl.create({
                component: CardDetailKeyframeComponent,
                enterAnimation: AnimateIn,
                leaveAnimation: AnimateOut,
                componentProps: {
                    src: res.url,
                    originEl: ev.target
                }
            });
            this.loadingIndex = undefined;
            modal.present();
            this.indexLoaded = index;

            await modal.onWillDismiss();
            this.indexLoaded = undefined;
        }
    }

}
