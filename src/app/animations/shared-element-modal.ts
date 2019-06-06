import { Animation } from '@ionic/core';

export function AnimateIn(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const contentAnimation = new AnimationC();
    contentAnimation.addElement(baseEl.querySelector('ion-content'));

    const wrapperAnimation = new AnimationC();

    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

    wrapperAnimation.beforeStyles({ opacity: 1 })
        .fromTo('translateX', '0%', '0%');

    baseEl.style.setProperty('--background', 'none');

    wrapperAnimation.fromTo('opacity', 1, 1);

    contentAnimation.fromTo('translateY', '100%', '0%');

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.645, 0.045, 0.355, 1)')
        .duration(localStorage.getItem('speed') || 500)
        .beforeAddClass('show-modal')
        .add(contentAnimation)
        .add(wrapperAnimation));
}

export function AnimateOut(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const contentAnimation = new AnimationC();
    contentAnimation.addElement(baseEl.querySelector('ion-content'));

    const wrapperAnimation = new AnimationC();

    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

    wrapperAnimation.beforeStyles({ opacity: 1 })
        .fromTo('translateX', '0%', '0%');

    wrapperAnimation.fromTo('opacity', 1, 1);

    contentAnimation.fromTo('translateY', '0%', '100%');

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.645, 0.045, 0.355, 1)')
        .duration(localStorage.getItem('speed') || 500)
        .beforeAddClass('show-modal')
        .add(contentAnimation)
        .add(wrapperAnimation));
}
