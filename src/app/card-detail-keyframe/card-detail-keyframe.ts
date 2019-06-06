import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-card-detail-keyframe',
    templateUrl: './card-detail-keyframe.html',
    styleUrls: ['./card-detail-keyframe.scss']
})
export class CardDetailKeyframeComponent implements OnInit {

    src: string;
    originEl: HTMLImageElement;

    @ViewChild('header', { read: ElementRef }) headerEl: ElementRef<HTMLElement>;
    @ViewChild('image', { read: ElementRef }) imageEl: ElementRef<HTMLImageElement>;

    expanded: boolean;
    collapsed: boolean;

    // Frame calculation for generating keyframes
    private nFrames = Math.round((500 /* Duration */) / (1000 / 60));

    constructor(
        public modalCtrl: ModalController,
        private renderer: Renderer2,
        private element: ElementRef
    ) { }

    ngOnInit() {
        if (localStorage.getItem('speed')) {
            // tslint:disable-next-line:radix
            this.nFrames = Math.round((parseInt(localStorage.getItem('speed'))) / (1000 / 60));
            this.element.nativeElement.style.setProperty('--speed', localStorage.getItem('speed') + 'ms');
            // tslint:disable-next-line:radix
            this.element.nativeElement.style.setProperty('--half-speed', (parseInt(localStorage.getItem('speed')) / 2) + 'ms');
        }

        // Hide the header element until its position is set correctly to prevent flickering
        this.renderer.setStyle(this.headerEl.nativeElement, 'visibility', 'hidden');

        setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Header is positioned, set visible
                    this.renderer.removeStyle(this.headerEl.nativeElement, 'visibility');

                    // Hide the original element so it looks like the element moves to the header
                    this.renderer.setStyle(this.originEl, 'opacity', 0);

                    // The original element's position
                    const originalHeaderPosition = this.originEl.getBoundingClientRect();

                    // The header's final position
                    const finalHeaderPosition = this.headerEl.nativeElement.getBoundingClientRect();

                    const keyframes = this.calculateKeyframes(originalHeaderPosition, finalHeaderPosition);

                    this.insertKeyframes(`
                        @keyframes headerExpandAnimation {
                            ${keyframes.headerAnimation}
                        }
                        @keyframes imgExpandAnimation {
                            ${keyframes.imageAnimation}
                        }
                    `);

                    this.expanded = true;
                });
            });
        }, 50);
    }

    ionViewWillLeave() {
        requestAnimationFrame(() => {
            const originalHeaderPosition = this.headerEl.nativeElement.getBoundingClientRect();
            const finalHeaderPosition = this.originEl.getBoundingClientRect();

            const keyframes = this.calculateKeyframes(originalHeaderPosition, finalHeaderPosition);

            this.insertKeyframes(`
                @keyframes headerCollapseAnimation {
                    ${keyframes.headerAnimation}
                }
                @keyframes imgCollapseAnimation {
                    ${keyframes.imageAnimation}
                }
            `);

            this.headerEl.nativeElement.style.top = `${finalHeaderPosition.top}px`;
            this.headerEl.nativeElement.style.left = `${finalHeaderPosition.left}px`;
            this.headerEl.nativeElement.style.width = `${finalHeaderPosition.width}px`;
            this.headerEl.nativeElement.style.height = `${finalHeaderPosition.height}px`;

            this.expanded = false;
            this.collapsed = true;

            setTimeout(() => {
                this.renderer.removeStyle(this.originEl, 'opacity');
            // tslint:disable-next-line:radix
            }, parseInt(localStorage.getItem('speed')) || 500);
        });

    }

    private calculateKeyframes(originalHeaderPosition: ClientRect, finalHeaderPosition: ClientRect) {
        // Calculate changes in position and scale
        const deltaX = originalHeaderPosition.left - finalHeaderPosition.left;
        const deltaY = originalHeaderPosition.top - finalHeaderPosition.top;
        const deltaW = originalHeaderPosition.width / finalHeaderPosition.width;
        const deltaH = originalHeaderPosition.height / finalHeaderPosition.height;

        // Animation steps for the header
        let headerAnimation = '';
        // Animation steos for the image
        let imageAnimation = '';

        const percentIncrement = 100 / this.nFrames;
        for (let i = 0; i <= this.nFrames; i++) {
            const step = this.ease(i / this.nFrames);
            const percentage = (i * percentIncrement);

            // Calculate the transform of the header.
            const translateX = deltaX + (0 - deltaX) * step;
            const translateY = deltaY + (0 - deltaY) * step;

            // Calculate the scale of the header
            const scaleX = (deltaW + (1 - deltaW) * step);
            const scaleY = (deltaH + (1 - deltaH) * step);

            // Add a step to the header animation
            headerAnimation += `${percentage}% {
                transform: translate3d(${translateX}px, ${translateY}px, 0) scale3d(${scaleX}, ${scaleY}, 1);
            }`;

            // Calculate image scaling based on ratios
            const imageRatio = this.imageEl.nativeElement.naturalWidth / this.imageEl.nativeElement.naturalHeight;
            const headerRatio = originalHeaderPosition.width / originalHeaderPosition.height;
            const finalHeaderRatio = finalHeaderPosition.width / finalHeaderPosition.height;

            let startX = 1,
                startY = 1,
                endX = 1,
                endY = 1;

            if (headerRatio > imageRatio) {
                startY = (originalHeaderPosition.width / imageRatio) / originalHeaderPosition.height;
            } else {
                startX = (originalHeaderPosition.height * imageRatio) / originalHeaderPosition.width;
            }
            if (finalHeaderRatio > imageRatio) {
                endY = (finalHeaderPosition.width / imageRatio) / finalHeaderPosition.height;
            } else {
                endX = (finalHeaderPosition.height * imageRatio) / finalHeaderPosition.width;
            }

            const imageScaleX = (startX + (endX - startX) * step);
            const imageScaleY = (startY + (endY - startY) * step);

            // Add a step to the image animation
            imageAnimation += `${percentage}% {
                transform: scale3d(${imageScaleX}, ${imageScaleY}, 1);
            }`;
        }

        return { headerAnimation, imageAnimation };
    }

    private insertKeyframes(keyframes: string) {
        const styleTag = document.createElement('style');
        styleTag.textContent = keyframes;
        this.element.nativeElement.appendChild(styleTag);
    }

    private ease(k: number, pow = 4) {
        // tslint:disable-next-line:no-conditional-assignment
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k + 2);
    }

}
