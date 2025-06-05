document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    let currentMessageIndex = parseInt(localStorage.getItem('currentMessageIndex')) || 0; // Lấy chỉ số tin nhắn gửi đi từ localStorage

    // Function to add a new message
    function addMessage(text, isSent = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message when clicking the send button
    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            // Danh sách tin nhắn gửi đi và trả lời tương ứng
            const messagePairs = [
                {
                    sent: "Heluuuuu b cho mình làm quen nha ^^",
                    reply: "Mình yêu nhau luôn đi cho đỡ mất công đoạn làm quen được không ạ ?"
                },
                {
                    sent: "Vậy thì lại đây nắm lấy tay anh nào ^^",
                    reply: "Dạ đây,cho em chơm miếng 😍"
                },
                {
                    sent: "Hứa với anh,chúng mình sẽ nắm tay nhau đi hết cuộc đời này,cùng nhau vượt qua mọi khó khăn nha",
                    reply: "Dạ vâng,em đồng ý ạaaaaaaaaaaaaaa ❤️"
                },
                {
                    sent: "Anh không hứa sẽ mang lại cho em sự giàu sang,nhưng anh hứa sẽ mang lại cho em hạnh phúc với 1 bến đỗ an toàn ☺️",
                    reply: "Chỉ cần anh luôn bên em và yêu thương em thôi,ngoài kia có mệt mỏi thì về với em nha,có em chờ ☺️"
                },
                {
                    sent: "Đương nhiên là chỉ yêu thương mình em rồi ☺️ anh yêu em nhiều lắm 🥰",
                    reply: "Dạ,em cũm yêu anh nhìuuuuuuuuuuuu 🥰"
                }
            ];
            
            // Gửi tin nhắn theo thứ tự
            addMessage(messagePairs[currentMessageIndex].sent, true);
            
            messageInput.value = '';
            
            // Simulate a reply after 1 second
            setTimeout(() => {
                // Trả lời tương ứng với tin nhắn gửi đi
                addMessage(messagePairs[currentMessageIndex].reply, false);
                // Tăng chỉ số và quay lại đầu nếu đã hết
                currentMessageIndex = (currentMessageIndex + 1) % messagePairs.length;
                // Lưu chỉ số mới vào localStorage
                localStorage.setItem('currentMessageIndex', currentMessageIndex);
            }, 1000);
        }
    });

    // Send message when pressing Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
