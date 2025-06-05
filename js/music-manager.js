// Quản lý âm nhạc toàn cục
let globalAudio = null;
let isFirstLoad = true;

// Kiểm tra thiết bị mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Khởi tạo audio sớm nhất có thể
const audioElement = new Audio();
audioElement.preload = 'auto';
audioElement.src = './songs/love5.mp3';
audioElement.load(); // Bắt đầu tải ngay lập tức

// Thêm xử lý cho mobile
if (isMobile) {
    // Tắt các tính năng có thể gây độ trễ trên mobile
    audioElement.autoplay = true;
    audioElement.playsInline = true;
}

function initializeMusic() {
    // Sử dụng audio element đã được preload
    if (!globalAudio) {
        globalAudio = audioElement;
        globalAudio.loop = true;
        
        // Cố gắng phát nhạc ngay lập tức
        playMusic();
        
        // Xử lý sự kiện mobile-specific
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        
        // Thêm xử lý cho các sự kiện mobile
        document.addEventListener('pause', handlePause, false);
        document.addEventListener('resume', handleResume, false);
        
        // Thêm xử lý cho các sự kiện audio
        globalAudio.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play');
            // Thử phát lại khi audio đã sẵn sàng
            playMusic();
        });
        
        globalAudio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            addPlayButton();
        });

        // Thêm xử lý cho các sự kiện mobile khác
        if (isMobile) {
            document.addEventListener('touchstart', () => {
                playMusic();
            }, { once: true });
            
            // Xử lý khi ứng dụng bị tạm dừng
            document.addEventListener('pause', () => {
                saveMusicState();
            }, false);
            
            // Xử lý khi ứng dụng được tiếp tục
            document.addEventListener('resume', () => {
                restoreMusicState();
            }, false);
        }
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        saveMusicState();
    } else {
        restoreMusicState();
    }
}

function handleBlur() {
    saveMusicState();
}

function handleFocus() {
    restoreMusicState();
}

function handlePause() {
    saveMusicState();
}

function handleResume() {
    restoreMusicState();
}

function playMusic() {
    if (globalAudio) {
        // Đặt volume và currentTime trước khi play để giảm độ trễ
        globalAudio.volume = 1;
        globalAudio.currentTime = 0;
        
        // Thử phát nhạc và xử lý lỗi nếu có
        const playPromise = globalAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Auto-play prevented:', error);
                // Thêm nút play nhạc nếu tự động phát bị chặn
                addPlayButton();
            });
        }
    }
}

function addPlayButton() {
    // Kiểm tra xem nút đã tồn tại chưa
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
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        `;
        button.onclick = function() {
            playMusic();
            this.remove();
        };
        document.body.appendChild(button);
    }
}

function pauseMusic() {
    if (globalAudio) {
        globalAudio.pause();
    }
}

function stopMusic() {
    if (globalAudio) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
    }
}

// Lưu trạng thái âm nhạc vào localStorage
function saveMusicState() {
    if (globalAudio) {
        localStorage.setItem('musicTime', globalAudio.currentTime);
        localStorage.setItem('isPlaying', !globalAudio.paused);
    }
}

// Khôi phục trạng thái âm nhắn từ localStorage
function restoreMusicState() {
    if (globalAudio) {
        const savedTime = localStorage.getItem('musicTime');
        const wasPlaying = localStorage.getItem('isPlaying') === 'true';
        
        if (savedTime) {
            globalAudio.currentTime = parseFloat(savedTime);
        }
        
        if (wasPlaying) {
            playMusic();
        }
    }
}

// Xử lý khi chuyển trang
window.addEventListener('beforeunload', saveMusicState);

// Khởi tạo âm nhạc ngay khi script được tải
initializeMusic();

// Khởi tạo lại khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra nếu đang ở page5a.html thì dừng nhạc
    if (window.location.pathname.includes('page5a.html')) {
        stopMusic();
    } else {
        // Khôi phục trạng thái nhạc từ localStorage
        restoreMusicState();
    }
}); 
