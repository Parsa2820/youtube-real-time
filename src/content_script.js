let videoPlayer = document.getElementsByClassName('video-stream html5-main-video')[0];
let remaining = document.getElementsByClassName('ytp-time-separator')[0];
let elapsedTime = document.getElementsByClassName('ytp-time-current')[0];

function secondsToTime(initSeconds) {
    let hours = Math.floor(initSeconds / 3600);
    let minutes = Math.floor((initSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(initSeconds - (hours * 3600) - (minutes * 60));

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

function reverseScaleTime(time, scale) {
    let seconds = time;
    seconds = seconds / scale;
    return secondsToTime(seconds);
}

function addSeparator(time) {
    return ' / ' + time + ' / ';
}

function getScaledRemainingTime() {
    normalRemainingTime = videoPlayer.duration - videoPlayer.currentTime;
    let playbackSpeed = document.getElementsByClassName('ytp-menuitem-content');
    let speed = 1;

    if (playbackSpeed.length > 0 && playbackSpeed[1].innerText != 'Normal') {
        speed = playbackSpeed[1].innerText;
    }

    return reverseScaleTime(normalRemainingTime, speed);
}

videoPlayer.addEventListener('timeupdate', () => {
    scaledRemainingTime = getScaledRemainingTime();
    videoPlayer.scaledRemainingTime = scaledRemainingTime;
});

videoPlayer.addEventListener('loadeddata', () => {
    if(theVidWasStopped){
        observer.observe(elapsedTime, {attributes: true, childList: true, characterData: true});
    }
});

let observer = new MutationObserver(() =>{
    remaining.innerText = addSeparator(videoPlayer.scaledRemainingTime);
});

observer.observe(elapsedTime, {attributes: true, childList: true, characterData: true});

videoPlayer.addEventListener('ended', () => {
    observer.disconnect();
    theVidWasStopped = true;
});

videoPlayer.addEventListener('abort', () => {
    observer.disconnect();
    theVidWasStopped = true;
});

videoPlayer.addEventListener('error', () => {
    observer.disconnect();
    theVidWasStopped = true;
});