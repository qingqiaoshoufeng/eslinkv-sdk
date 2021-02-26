import ImageViewer from './imageViewer.vue';
import Vue from 'vue';

ImageViewer.newInstance = (properties) => {
    const _props = properties || {};

    const Instance = new Vue({
        render(h) {
            return h(ImageViewer, {
                props: _props
            });
        }
    });

    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const imageViewer = Instance.$children[0];

    return {
        open(imgViewerProps) {
            imageViewer.open(imgViewerProps);
        },
        close() {
            imageViewer.closeSelf();
        },
        component: imageViewer,
        destroy(element) {
            setTimeout(function() {
                document.body.removeChild(document.getElementById(element));
            }, 500);
        }
    };
};

export default ImageViewer;
