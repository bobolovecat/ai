const MODEL_PATH = './models/';
const video = document.getElementById('video');

async function getCamera() {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = mediaStream;
    } catch (e) {
        console.error(e)
    }
}

async function loadModels() {
    await faceapi.loadTinyFaceDetectorModel(MODEL_PATH);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_PATH);
    await faceapi.loadFaceExpressionModel(MODEL_PATH);
    await faceapi.loadAgeGenderModel(MODEL_PATH);
    getCamera();
}

async function detectFace() {
    const canvas = faceapi.createCanvasFromMedia(video);
    const ctx = canvas.getContext('2d');
    const width = video.width;
    const height = video.height;

    document.body.append(canvas);
    // faceapi.matchDimensions(canvas, { width, height });

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceExpressions().withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(detections, { width, height });

        ctx.clearRect(0, 0, width, height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        resizedDetections.forEach(result => {
            const { age, gender, genderProbability } = result;
            new faceapi.draw.DrawTextField(
                [
                    `${~~age} years`,
                    `${gender} (${genderProbability.toFixed(1)})`,
                ],
                result.detection.box.bottomRight
            ).draw(canvas);
        });
    }, 300);
}

video.addEventListener('play', detectFace);

loadModels();


