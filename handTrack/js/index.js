navigator.mediaDevices.getUserMedia =
    navigator.mediaDevices.getUserMedia ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let model;

function handDetection() {
    model.detect(video).then(predictions => {
        // model.renderPredictions(predictions, canvas, context, video);
        predictions.forEach(item => {
            if (item.label === 'open') {
                const { bbox } = item;
                point.push({
                    x: bbox[0] + bbox[2] / 2,
                    y: bbox[1] + bbox[3] / 2
                })
            }
        })
    });
    requestAnimationFrame(handDetection);
}

function startVideo() {
    handTrack.startVideo(video).then((status = {}) => {
        if (status.status) {
            navigator.mediaDevices.getUserMedia(
                {video: true}
            ).then(stream => {
                video.srcObj = stream;
                handDetection();
            });
        }
    });
}

handTrack.load().then(loadedModel => {
    model = loadedModel;
    startVideo();
});
