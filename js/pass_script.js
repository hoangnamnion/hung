const passwordInput = document.querySelector('.input-area input');
const keypadButtons = document.querySelectorAll('.keypad button');

let enteredPassword = '';
const correctPassword = '1998';

keypadButtons.forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        const buttonText = button.textContent.trim();

        if (icon && icon.classList.contains('fa-backspace')) {
            // Backspace button
            if (enteredPassword.length > 0) {
                enteredPassword = enteredPassword.slice(0, -1);
            }
        } else if (buttonText === '*') {
            // Star button (nếu bạn muốn làm gì đó)
        } else {
            if (enteredPassword.length < correctPassword.length) {
                enteredPassword += buttonText;
            }
        }

        updatePasswordDisplay();
        checkPassword();
    });
});


function updatePasswordDisplay() {
    // Display asterisks based on enteredPassword length
    // passwordInput.value = ''.padStart(enteredPassword.length, '*');
    // Optionally display the actual password for debugging:
    passwordInput.value = enteredPassword;
}

function checkPassword() {
    if (enteredPassword.length === correctPassword.length) {
        passwordInput.classList.remove('success', 'error', 'shake');
        void passwordInput.offsetWidth; // Trigger reflow for shake

        if (enteredPassword === correctPassword) {
            passwordInput.classList.add('success');
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 300);
        } else {
            passwordInput.classList.add('error', 'shake');
            setTimeout(() => {
                enteredPassword = '';
                updatePasswordDisplay();
                passwordInput.classList.remove('error', 'shake');
            }, 600);
        }
    } else {
        // The provided modified code had a potentially misplaced else block here.
        // I will keep the logic to clear on incorrect length if needed, but the primary
        // check happens when length matches.
        // For now, I'll focus on applying the correct/incorrect feedback when length matches.
        // If you need behavior for incorrect length input *before* reaching the target length, please specify.

        // Based on the modified script structure, it seems the alert was intended for
        // when the length matches but the password is wrong. I'll remove the original alert here
        // as the CSS classes provide visual feedback.

        // setTimeout(() => {
        //     enteredPassword = '';
        //     updatePasswordDisplay();
        //     alert('Mật khẩu sai!'); // Optional: show alert
        // }, 300); // Delay before clearing
    }
} 