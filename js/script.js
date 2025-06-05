let clickCount = 0;
const colorBox = document.getElementById('colorBox');
const clickCountElement = document.getElementById('clickCount');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeColor() {
    colorBox.style.backgroundColor = getRandomColor();
    clickCount++;
    clickCountElement.textContent = clickCount;
}

function resetColor() {
    colorBox.style.backgroundColor = '#3498db';
    clickCount = 0;
    clickCountElement.textContent = clickCount;
} 