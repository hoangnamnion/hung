document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 100);
        });
    }

    // Add fade-in animation to content
    const content = document.querySelector('.content');
    if (content) {
        content.style.opacity = '0';
        content.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            content.style.opacity = '1';
        }, 100);
    }

    const slideshowContainer = document.querySelector('.slideshow-container');
    const slideshow = slideshowContainer.querySelector('.slideshow');
    const slides = slideshow.querySelectorAll('.slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to load image for a specific slide index
    function loadImage(index) {
        if (index >= 0 && index < totalSlides) {
            const img = slides[index].querySelector('.lazyload');
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                img.onload = () => {
                    img.classList.remove('lazyload');
                };
                img.onerror = () => {
                    console.error('Failed to load image:', img.dataset.src);
                    img.src = './images/placeholder.png'; // Path to a placeholder image
                    img.alt = 'Image failed to load';
                    img.classList.remove('lazyload'); // Remove lazyload class even on error
                    // Optional: Add a class to style the placeholder if needed
                    // img.classList.add('placeholder-image');
                };
            }
        }
    }

    // Function to load surrounding images (current, prev, next)
    function loadSurroundingImages() {
        loadImage(currentSlide);
        loadImage(currentSlide - 1);
        loadImage(currentSlide + 1);
    }

    // Function to update slideshow position
    function updateSlideshow(smoothTransition = true) {
        if (smoothTransition) {
             slideshow.style.transition = 'transform 0.5s ease';
        } else {
             slideshow.style.transition = 'none';
        }
       slideshow.style.transform = `translateX(-${currentSlide * 100}%)`;
       loadSurroundingImages(); // Tải ảnh khi slide thay đổi
    }

    // Next slide function (non-looping)
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlideshow();
        }
    }

    // Previous slide function (non-looping)
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlideshow();
        }
    }

    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThresholdTouch = 50;

    slideshowContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideshowContainer.addEventListener('touchmove', e => {
        // Cho phép scroll tự nhiên
        const touch = e.touches[0];
        const currentX = touch.screenX;
        const diff = currentX - touchStartX;
        
        // Nếu vuốt ngang nhiều hơn dọc, ngăn scroll
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    slideshowContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleTouchSwipe();
    }, { passive: true });

    function handleTouchSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) < swipeThresholdTouch) return; // Bỏ qua nếu vuốt quá ngắn

        if (swipeDistance < 0) {
            // Vuốt trái
            nextSlide();
        } else {
            // Vuốt phải
            prevSlide();
        }
    }

    // Mouse drag functionality
    let isDragging = false;
    let mouseStartX = 0;
    let mouseCurrentX = 0;
    const swipeThresholdMouse = 50;

    slideshowContainer.addEventListener('mousedown', e => {
        isDragging = true;
        mouseStartX = e.screenX;
        slideshowContainer.style.cursor = 'grabbing';
         updateSlideshow(false);
         mouseCurrentX = mouseStartX;
        e.preventDefault();
    });

    slideshowContainer.addEventListener('mousemove', e => {
        if (!isDragging) return;
        mouseCurrentX = e.screenX;
        requestAnimationFrame(updateDragPosition);
    });

     function updateDragPosition() {
         if (!isDragging) return;
         const walk = mouseCurrentX - mouseStartX;
         const currentTranslateX = -currentSlide * slideshowContainer.offsetWidth;
         slideshow.style.transform = `translateX(${currentTranslateX + walk}px)`;
     }

    slideshowContainer.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        slideshowContainer.style.cursor = 'grab';

        const dragDistance = mouseCurrentX - mouseStartX;

        if (dragDistance < -swipeThresholdMouse) {
            // Kéo sang trái (chuyển next)
            nextSlide();
        } else if (dragDistance > swipeThresholdMouse) {
            // Kéo sang phải (chuyển prev)
            prevSlide();
        } else {
            // Không đủ khoảng cách kéo, về vị trí cũ
            updateSlideshow();
        }
         updateSlideshow(true);
    });

    // Ngừng kéo nếu chuột rời khỏi container hoặc cửa sổ
    slideshowContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            slideshowContainer.style.cursor = 'grab';
            updateSlideshow();
        }
    });

     document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            slideshowContainer.style.cursor = 'grab';
            updateSlideshow();
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

     // Cập nhật vị trí slideshow khi cửa sổ resize để đảm bảo đúng vị trí slide
    window.addEventListener('resize', () => {
        updateSlideshow(false);
    });

     // Hiển thị slide đầu tiên và tải ảnh lân cận khi tải trang
     updateSlideshow(false);
     loadSurroundingImages();
}); 