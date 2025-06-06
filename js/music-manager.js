
let globalAudio = null;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isPassPage = window.location.pathname.includes('pass.html');
const isPage5a = window.location.pathname.includes('page5a.html');

const audioElement = new Audio();
audioElement.preload = 'auto';
audioElement.src = './songs/love5.mp3';
audioElement.loop = true;

if (isMobile) {
    audioElement.autoplay = true;
    audioElement.playsInline = true;
}

function initializeMusic() {
    if (!globalAudio) {
        globalAudio = audioElement;

        // Đặt currentTime nếu đã lưu
        const savedTime = localStorage.getItem('musicTime');
        if (savedTime) {
            globalAudio.currentTime = parseFloat(savedTime);
        }

        globalAudio.volume = 1;
        const playPromise = globalAudio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay error:', error);
                addPlayButton();
            });
        }

        // Lưu liên tục thời gian phát mỗi giây
        setInterval(() => {
            if (!globalAudio.paused) {
                localStorage.setItem('musicTime', globalAudio.currentTime);
                localStorage.setItem('isPlaying', 'true');
            }
        }, 1000);

        // Các sự kiện liên quan
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        if (isMobile) {
            document.addEventListener('touchstart', () => {
                globalAudio.play();
            }, { once: true });
        }
    }
}

function handleVisibilityChange() {
    if (document.hidden) saveMusicState();
    else restoreMusicState();
}

function handleBlur() {
    saveMusicState();
}

function handleFocus() {
    restoreMusicState();
}

function saveMusicState() {
    if (globalAudio) {
        localStorage.setItem('musicTime', globalAudio.currentTime);
        localStorage.setItem('isPlaying', !globalAudio.paused);
    }
}

function restoreMusicState() {
    if (globalAudio) {
        const savedTime = localStorage.getItem('musicTime');
        const wasPlaying = localStorage.getItem('isPlaying') === 'true';

        if (savedTime) {
            globalAudio.currentTime = parseFloat(savedTime);
        }

        if (wasPlaying) {
            globalAudio.play().catch(() => addPlayButton());
        }
    }
}

function addPlayButton() {
    if (!document.getElementById('musicPlayButton')) {
        const button = document.createElement('button');
        button.id = 'musicPlayButton';
        button.innerHTML = '🎵 Play Music';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #ff69b4;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        button.onclick = function() {
            globalAudio.play();
            this.remove();
        };
        document.body.appendChild(button);
    }
}

function stopMusic() {
    if (globalAudio) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
        localStorage.removeItem('musicTime');
        localStorage.removeItem('isPlaying');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (isPage5a) {
        stopMusic();
    } else {
        initializeMusic();
    }
});

window.addEventListener('beforeunload', saveMusicState);
