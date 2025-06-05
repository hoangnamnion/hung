document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    const keypad = document.querySelector('.keypad');
    let currentInput = '';

    // Fixed password
    const CORRECT_PASSWORD = '1104';

    // Create notification element
    function createNotification(message, isSuccess = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Handle keypad clicks
    keypad.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const value = e.target.textContent;
            
            if (value === '⌫') {
                // Backspace
                currentInput = currentInput.slice(0, -1);
            } else if (value === '*') {
                // Clear
                currentInput = '';
            } else {
                // Number
                if (currentInput.length < 4) {
                    currentInput += value;
                }
            }

            // Update display
            passwordInput.value = currentInput;

            // Check password only if we have 4 digits
            if (currentInput.length === 4) {
                if (currentInput === CORRECT_PASSWORD) {
                    createNotification('Mật khẩu đúng! Đang chuyển trang...', true);
                    setTimeout(() => {
                        window.location.href = 'page5a.html';
                    }, 1000);
                } else {
                    createNotification('Mật khẩu không đúng! Vui lòng thử lại.');
                    currentInput = '';
                    passwordInput.value = '';
                }
            }
        }
    });

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
}); 