document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    let currentMessageIndex = 0; // Biến để theo dõi tin nhắn gửi đi
    let currentReplyIndex = parseInt(localStorage.getItem('currentReplyIndex')) || 0; // Lấy chỉ số từ localStorage

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
            // Danh sách tin nhắn gửi đi theo thứ tự
            const sentMessages = [
                "Hứa với anh,chúng mình sẽ nắm tay nhau đi hết cuộc đời này,cùng nhau vượt qua mọi khó khăn nha",
                "Anh không hứa sẽ mang lại cho em sự giàu sang,nhưng anh hứa sẽ mang lại cho em hạnh phúc với 1 bến đỗ an toàn ☺️",
                "Đương nhiên là chỉ yêu thương mình em rồi ☺️ anh yêu em nhiều lắm 🥰"
            ];
            
            // Gửi tin nhắn theo thứ tự
            addMessage(sentMessages[currentMessageIndex], true);
            // Tăng chỉ số và quay lại đầu nếu đã hết
            currentMessageIndex = (currentMessageIndex + 1) % sentMessages.length;
            
            messageInput.value = '';
            
            // Simulate a reply after 1 second
            setTimeout(() => {
                const replies = [
                    "Dạ vâng,em đồng ý ạaaaaaaaaaaaaaa ❤️",
                    "Chỉ cần anh luôn bên em và yêu thương em thôi,ngoài kia có mệt mỏi thì về với em nha,có em chờ ☺️",
                    "Dạ,em cũm yêu anh nhìuuuuuuuuuuuu 🥰"
                ];
                // Trả lời theo thứ tự
                addMessage(replies[currentReplyIndex], false);
                // Tăng chỉ số và quay lại đầu nếu đã hết
                currentReplyIndex = (currentReplyIndex + 1) % replies.length;
                // Lưu chỉ số mới vào localStorage
                localStorage.setItem('currentReplyIndex', currentReplyIndex);
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
