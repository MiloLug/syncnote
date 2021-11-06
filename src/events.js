import VueEventsHelper from '@quartz-vision/vue-events-helper';
import { createGesture } from '@ionic/vue';

const quartz = new VueEventsHelper('quartz');

quartz.registerEvent('long-tap', {
    mounted(el, {handler}) {
        let timeout;

        const clearGestureTimeout = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        };

        const gesture = createGesture({
            el,
            threshold: 0,
            onStart: e => {
                clearGestureTimeout();					
                timeout = setTimeout(() => {
                    timeout = undefined;
                    handler(e);
                }, 500);
            },
            onMove: detail => {
                if (detail.deltaX <= 10 && detail.deltaY <= 10) {
                    return;
                }
                clearGestureTimeout();
            },
            onEnd: () => {
                clearGestureTimeout();
            },
        });

        gesture.enable();
    }
});

export default quartz;

