function $(selector) {
    return document.querySelector(selector);
}

let format = $('#format');
let downloadR = $("#downloadR");
let startR = $("#startR");
let stopR = $("#stopR");
let videoRecording = $("#videoRecording");
let showing = $("#showing");
let mediaRecorder;
let mediaChunks = [];
let selectedFormat = "video/webm";

async function startVideoRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: selectedFormat });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                mediaChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(mediaChunks, { type: selectedFormat });
            videoRecording.src = URL.createObjectURL(blob);
            format.removeAttribute("disabled");
            downloadR.classList.remove("disabled");
            startR.classList.remove("disabled");
            stopR.classList.add("disabled");
        };

        mediaRecorder.start();
        mediaChunks = [];
        format.setAttribute("disabled", true);
        downloadR.classList.add("disabled");
        stopR.classList.remove("disabled");
        startR.classList.add("disabled");
    } catch (err) {
        console.error("Failed to start recording:", err);
    }
}

function changeFormat(e) {
    selectedFormat = e.target.value;
}

function stopVideoRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
}

function downloadVideoRecording() {
    const blob = new Blob(mediaChunks, { type: selectedFormat });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Recording_${Date.now()}.${selectedFormat.split("/")[1]}`;
    a.click();
    URL.revokeObjectURL(url);
}

startR.addEventListener("click", startVideoRecording);
stopR.addEventListener("click", stopVideoRecording);
downloadR.addEventListener("click", downloadVideoRecording);
format.addEventListener("change", changeFormat);
