// Quản lý âm nhạc toàn cục
let globalAudio = null;
let isFirstLoad = true;

function initializeMusic() {
    // Tạo audio element nếu chưa tồn tại
    if (!globalAudio) {
        globalAudio = new Audio('./songs/love5.mp3');
        globalAudio.loop = true;
        
        // Thêm sự kiện để tự động phát khi người dùng tương tác với trang
        document.addEventListener('touchstart', function startMusic() {
            if (isFirstLoad) {
                playMusic();
                isFirstLoad = false;
            }
            document.removeEventListener('touchstart', startMusic);
        }, { once: true });
        document.addEventListener('click', function startMusic() {
            if (isFirstLoad) {
                playMusic();
                isFirstLoad = false;
            }
            document.removeEventListener('click', startMusic);
        }, { once: true });
    }
}

function playMusic() {
    if (globalAudio) {
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

// Khởi tạo âm nhạc khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    initializeMusic();
    restoreMusicState();
    
    // Kiểm tra nếu đang ở page5a.html thì dừng nhạc
    if (window.location.pathname.includes('page5a.html')) {
        stopMusic();
    } else {
        // Chỉ phát nhạc nếu chưa phát bao giờ
        if (isFirstLoad) {
            playMusic();
        }
    }
}); 
