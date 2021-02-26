import ImageViewer from './imageViewer.js';

const defaults = {
    index: 0,
    imgArr: []
};
let name = 1;
let imgViewerInstance;

function getImgViewerInstance(opts) {
    imgViewerInstance =
        imgViewerInstance ||
        ImageViewer.newInstance(Object.assign({}, defaults, opts));

    return imgViewerInstance;
}

function init(opts) {
    let instance = getImgViewerInstance(opts);

    instance.open(Object.assign({}, { name: 'imageViewer' }, defaults, opts));

    // 用于手动消除
    return (function() {
        let target = name++;

        return function() {
            console.log(target);
            // instance.remove(`${prefixKey}${target}`);
        };
    })();
}

export default {
    name: 'ImageViewer',

    open(options) {
        return init(options);
    },
    close() {
        let instance = getImgViewerInstance();
        instance.close();
    },
    destroy() {
        let instance = getImgViewerInstance();
        imgViewerInstance = null;
        instance.destroy('es-imageviewer-container');
    }
};
