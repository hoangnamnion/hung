document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzleContainer');
    const solvedOverlay = document.getElementById('solvedOverlay');
    const imageSrc = 'https://img.upanh.tv/2025/06/05/z6674777532431_c8d61ad831507a0d3ab7e81c579aa566.jpg'; // Sử dụng ảnh gốc mới nhất
    const rows = 3;
    const cols = 3;
    const totalPieces = rows * cols;
    let pieces = [];
    let currentDraggingPiece = null;

    // Tạo các mảnh ghép từ ảnh gốc
    function createPieces() {
        pieces = [];
        puzzleContainer.innerHTML = ''; // Xóa các mảnh ghép cũ nếu có

        for (let i = 0; i < totalPieces; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.setAttribute('data-index', i); // Lưu trữ vị trí đúng của mảnh ghép

            const row = Math.floor(i / cols);
            const col = i % cols;

            // Tính toán background-position để hiển thị đúng phần ảnh
            const bgX = (col / (cols - 1)) * 100; // Vị trí X của background trong mảnh ghép
            const bgY = (row / (rows - 1)) * 100; // Vị trí Y của background trong mảnh ghép

            piece.style.backgroundImage = `url(${imageSrc})`;
            piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`; // Phóng to background để phủ kín lưới 3x3
            piece.style.backgroundPosition = `${bgX}% ${bgY}%`;

            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }
         // Kích thước container sẽ được quản lý bởi CSS grid và aspect-ratio
         // Không cần đặt width/height cố định ở đây

        // Ẩn mảnh ghép cuối cùng để tạo khoảng trống (tùy chọn cho puzzle classic)
        // pieces[totalPieces - 1].style.visibility = 'hidden';
    }

     // Cập nhật vị trí hiển thị của các mảnh ghép dựa trên thứ tự trong mảng 'pieces'
     // Khi sử dụng position: absolute, cần cập nhật top/left
    function updatePiecePositions() {
        const containerRect = puzzleContainer.getBoundingClientRect();
        const pieceWidth = containerRect.width / cols;
        const pieceHeight = containerRect.height / rows;

        pieces.forEach((piece, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            piece.style.position = 'absolute'; // Đảm bảo position là absolute
            piece.style.left = `${col * pieceWidth}px`;
            piece.style.top = `${row * pieceHeight}px`;
            piece.style.width = `${pieceWidth}px`; // Cập nhật kích thước khi cần
            piece.style.height = `${pieceHeight}px`;
        });
    }

    // Xáo trộn các mảnh ghép
    function shufflePieces(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí trong mảng
        }
        updatePiecePositions(); // Cập nhật vị trí hiển thị sau khi xáo trộn
    }

    // Kiểm tra xem trò chơi đã hoàn thành chưa
    function checkWin() {
        for (let i = 0; i < totalPieces; i++) {
             // Kiểm tra chỉ số ban đầu (data-index) của mảnh ghép ở vị trí hiện tại trong mảng
             // So sánh thứ tự hiện tại trong mảng (i) với data-index của mảnh ghép tại vị trí đó
            if (pieces[i].getAttribute('data-index') != i) {
                return false;
            }
        }
        return true;
    }

    // Hiển thị overlay khi hoàn thành
    function showSolvedOverlay() {
        solvedOverlay.classList.add('visible');
         // Thêm event listener cho nút đóng khi overlay hiển thị
         const closeButton = document.getElementById('closeOverlayButton');
         if (closeButton) {
             closeButton.addEventListener('click', hideSolvedOverlay);
         }
         startCelebration(); // Bắt đầu hiệu ứng chúc mừng
    }

    // Ẩn overlay
    function hideSolvedOverlay() {
        solvedOverlay.classList.remove('visible');
         // Xóa event listener để tránh trùng lặp nếu overlay hiển thị lại
         const closeButton = document.getElementById('closeOverlayButton');
         if (closeButton) {
             closeButton.removeEventListener('click', hideSolvedOverlay);
         }
         stopCelebration(); // Dừng hiệu ứng chúc mừng khi đóng overlay
    }

    let celebrationInterval = null;
    const celebrationElements = ['✨', '💖', ' confetti', '🎉', '🌸']; // Các biểu tượng/emoji chúc mừng

    // Tạo một phần tử chúc mừng rơi xuống
    function createCelebrationElement() {
        const element = document.createElement('div');
        element.classList.add('celebration-element');
        const emoji = celebrationElements[Math.floor(Math.random() * celebrationElements.length)];
        element.innerHTML = emoji.trim(); // Sử dụng trim() để loại bỏ khoảng trắng nếu có
        if (emoji.trim() === 'confetti') { // Ví dụ: nếu muốn dùng style khác cho confetti
             // Có thể thêm class hoặc style riêng tại đây nếu cần
             element.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Màu ngẫu nhiên cho confetti giả
             element.style.width = '10px';
             element.style.height = '10px';
             element.style.borderRadius = '50%';
             element.style.fontSize = '0.1em'; // Giảm font size cho chấm màu
             element.innerHTML = ''; // Xóa emoji nếu dùng chấm màu
        }

        // Randomize starting horizontal position
        const startX = Math.random() * window.innerWidth;
        element.style.left = `${startX}px`;

        // Randomize animation duration and delay
        const duration = Math.random() * 3 + 3; // Duration between 3 and 6 seconds
        element.style.animationDuration = `${duration}s`;
        const delay = Math.random() * 1; // Delay between 0 and 1 seconds
        element.style.animationDelay = `-${delay}s`; // Use negative delay
        element.style.opacity = 0; // Bắt đầu với opacity 0 để animation opacity hoạt động

        document.body.appendChild(element);

        // Remove element after animation ends
        element.addEventListener('animationend', () => {
            element.remove();
        });
    }

    // Bắt đầu tạo hiệu ứng chúc mừng
    function startCelebration() {
        // Tạo một vài phần tử ban đầu
        for(let i = 0; i < 20; i++) {
            createCelebrationElement();
        }
        // Tiếp tục tạo phần tử theo khoảng thời gian
        celebrationInterval = setInterval(createCelebrationElement, 100); // Tạo mới mỗi 100ms
    }

    // Dừng tạo hiệu ứng chúc mừng và xóa các phần tử đang rơi
    function stopCelebration() {
        clearInterval(celebrationInterval);
        const elements = document.querySelectorAll('.celebration-element');
        elements.forEach(el => el.remove());
    }

    // Thêm sự kiện kéo thả
    function addDragListeners() {
        pieces.forEach(piece => {
            // Kiểm tra xem mảnh ghép có bị ẩn (khoảng trống) không trước khi thêm listener
            // if (piece.style.visibility !== 'hidden') {
                piece.addEventListener('mousedown', onMouseDown);
                piece.addEventListener('touchstart', onTouchStart, { passive: false });
            // }
        });

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchcancel', onTouchEnd); // Xử lý khi chạm bị hủy
    }

    let offsetX, offsetY;

    function onMouseDown(e) {
        if (e.button !== 0) return; // Chỉ xử lý click trái chuột
         // e.target có thể là <img> nếu có, cần lấy element cha .puzzle-piece
        currentDraggingPiece = e.target.closest('.puzzle-piece');
        if (!currentDraggingPiece) return;

        currentDraggingPiece.classList.add('dragging');
        const rect = currentDraggingPiece.getBoundingClientRect();
        const containerRect = puzzleContainer.getBoundingClientRect(); // Lấy rect của container
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Đặt lại vị trí kéo bằng cách sử dụng position absolute và top/left
        currentDraggingPiece.style.position = 'absolute';
        currentDraggingPiece.style.zIndex = 100; // Đảm bảo mảnh ghép đang kéo nằm trên cùng

    }

    function onMouseMove(e) {
        if (!currentDraggingPiece) return;
        const containerRect = puzzleContainer.getBoundingClientRect();
        let newLeft = e.clientX - containerRect.left - offsetX;
        let newTop = e.clientY - containerRect.top - offsetY;

        // Giới hạn di chuyển trong phạm vi container
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - currentDraggingPiece.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - currentDraggingPiece.offsetHeight));

        currentDraggingPiece.style.left = `${newLeft}px`;
        currentDraggingPiece.style.top = `${newTop}px`;
    }

    function onMouseUp() {
        if (!currentDraggingPiece) return;

        currentDraggingPiece.classList.remove('dragging');
        currentDraggingPiece.style.zIndex = ''; // Reset z-index
        snapPieceToGrid(currentDraggingPiece);
        currentDraggingPiece = null;

        if (checkWin()) {
            showSolvedOverlay();
        }
    }

     function onTouchStart(e) {
         // e.target có thể là <img> nếu có, cần lấy element cha .puzzle-piece
        currentDraggingPiece = e.target.closest('.puzzle-piece');
        if (!currentDraggingPiece) return;

        currentDraggingPiece.classList.add('dragging');
        const rect = currentDraggingPiece.getBoundingClientRect();
        const touch = e.touches[0];
        const containerRect = puzzleContainer.getBoundingClientRect(); // Lấy rect của container

        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        // Đặt lại vị trí kéo bằng cách sử dụng position absolute và top/left
        currentDraggingPiece.style.position = 'absolute';
        currentDraggingPiece.style.zIndex = 100; // Đảm bảo mảnh ghép đang kéo nằm trên cùng

        e.preventDefault(); // Ngăn cuộn trang khi bắt đầu kéo
    }

    function onTouchMove(e) {
        if (!currentDraggingPiece) return;
        const containerRect = puzzleContainer.getBoundingClientRect();
        const touch = e.touches[0];
        let newLeft = touch.clientX - containerRect.left - offsetX;
        let newTop = touch.clientY - containerRect.top - offsetY;

        // Giới hạn di chuyển trong phạm vi container
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - currentDraggingPiece.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - currentDraggingPiece.offsetHeight));

        currentDraggingPiece.style.left = `${newLeft}px`;
        currentDraggingPiece.style.top = `${newTop}px`;
        e.preventDefault(); // Ngăn cuộn trang khi đang kéo
    }

     function onTouchEnd() {
        if (!currentDraggingPiece) return;
        currentDraggingPiece.classList.remove('dragging');
        currentDraggingPiece.style.zIndex = ''; // Reset z-index
        snapPieceToGrid(currentDraggingPiece);
        currentDraggingPiece = null;

        if (checkWin()) {
            showSolvedOverlay();
        }
    }

    // Snap mảnh ghép về vị trí lưới gần nhất hoặc hoán đổi vị trí
    function snapPieceToGrid(piece) {
        const containerRect = puzzleContainer.getBoundingClientRect();
        const pieceWidth = containerRect.width / cols;
        const pieceHeight = containerRect.height / rows;

        const currentLeft = parseFloat(piece.style.left);
        const currentTop = parseFloat(piece.style.top);

        // Tính toán vị trí lưới gần nhất mà tâm mảnh ghép được thả vào
        const pieceCenterX = currentLeft + piece.offsetWidth / 2;
        const pieceCenterY = currentTop + piece.offsetHeight / 2;

        const targetCol = Math.floor(pieceCenterX / pieceWidth);
        const targetRow = Math.floor(pieceCenterY / pieceHeight);

        // Kiểm tra nếu vị trí đích nằm ngoài lưới (không nên xảy ra với giới hạn di chuyển)
        if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols) {
             // Đặt lại vị trí về vị trí hiện tại trong mảng nếu nằm ngoài lưới
            const currentIndexInArray = pieces.indexOf(piece);
            const currentRowInArray = Math.floor(currentIndexInArray / cols);
            const currentColInArray = currentIndexInArray % cols;
             piece.style.left = `${currentColInArray * pieceWidth}px`;
             piece.style.top = `${currentRowInArray * pieceHeight}px`;
            return;
        }

        // Tính toán chỉ số đích trong mảng 1D dựa trên vị trí lưới
        const targetIndex = targetRow * cols + targetCol;

         // Tìm mảnh ghép (nếu có) hiện đang ở vị trí đích trong MẢNG pieces
         // Ta cần tìm mảnh ghép trong mảng pieces mà vị trí HIỂN THỊ của nó khớp với vị trí lưới đích.
         // Duyệt qua mảng pieces và kiểm tra vị trí hiển thị
        let pieceAtTargetPosition = null;
        for (let i = 0; i < pieces.length; i++) {
            const p = pieces[i];
            if (p === piece) continue; // Bỏ qua chính mảnh ghép đang kéo

            const pLeft = parseFloat(p.style.left);
            const pTop = parseFloat(p.style.top);

            // Kiểm tra xem vị trí hiển thị của mảnh ghép p có khớp với vị trí lưới đích không
            // Cần so sánh với một sai số nhỏ do tính toán float
            const epsilon = 1; // Sai số chấp nhận được (pixels)
            const isAtTarget = Math.abs(pLeft - targetCol * pieceWidth) < epsilon &&
                               Math.abs(pTop - targetRow * pieceHeight) < epsilon;

            if (isAtTarget) {
                pieceAtTargetPosition = p;
                break; // Tìm thấy mảnh ghép ở vị trí đích
            }
        }


        if (pieceAtTargetPosition) {
             // Nếu có mảnh ghép khác ở vị trí đích, hoán đổi vị trí trong mảng pieces
            const currentIndex = pieces.indexOf(piece);
            const targetIndexInArray = pieces.indexOf(pieceAtTargetPosition);

             [pieces[currentIndex], pieces[targetIndexInArray]] = [pieces[targetIndexInArray], pieces[currentIndex]];

            // Cập nhật lại vị trí hiển thị của cả hai mảnh ghép
            updatePiecePositions();

        } else {
            // Nếu ô đích trống, chỉ đặt mảnh ghép hiện tại vào vị trí lưới đó
            // Tìm vị trí hiện tại của mảnh ghép trong mảng pieces
            const currentIndex = pieces.indexOf(piece);
             // Tạm thời xóa mảnh ghép khỏi vị trí hiện tại trong mảng
            const [movedPiece] = pieces.splice(currentIndex, 1);
             // Chèn mảnh ghép vào vị trí đích mới trong mảng
            pieces.splice(targetIndex, 0, movedPiece);

            // Cập nhật lại vị trí hiển thị dựa trên mảng pieces đã được cập nhật
             updatePiecePositions();
        }

    }


    // Khởi tạo trò chơi
    function initializeGame() {
        createPieces();
        shufflePieces(pieces);
        // Không cần updatePiecePositions ở đây nữa vì shufflePieces gọi nó
        addDragListeners();
    }

    // Khởi tạo khi trang load
    initializeGame();

     // Cập nhật vị trí mảnh ghép khi resize cửa sổ
    window.addEventListener('resize', updatePiecePositions);
});
