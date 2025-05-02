document.addEventListener(`DOMContentLoaded`, () => {
    // --- Game Page (game.html) ---
    const usernameDisplay = document.querySelector('.username-display');
    const textDisplay = document.getElementById('text-display');
    const userInput = document.getElementById('user-input');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const accuracyDisplay = document.getElementById('accuracy');
    const historyList = document.getElementById('history-list');
    const showHistoryBtn = document.getElementById('show-history-btn');
    const words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
    let currentWordIndex = 0;
    let startTime;
    let correctChars = 0;
    let totalChars = 0;
    let gameHistory = JSON.parse(localStorage.getItem('typingHistory')) || [];
    let score = 0;
    let intervalId;
  
    function displayUsername() {
      const loggedInUsername = localStorage.getItem('loggedInUser');
      if (usernameDisplay && loggedInUsername) {
        usernameDisplay.textContent = `Welcome ${loggedInUsername}`;
      }
    }
  
    function loadWord() {
      if (textDisplay) {
        textDisplay.textContent = words[currentWordIndex];
      }
      userInput.value = '';
      userInput.focus();
    }
  
    function startGame() {
      if (!startTime) {
        loadWord();
        startTime = new Date().getTime();
        correctChars = 0;
        totalChars = 0;
        score = 0;
        scoreDisplay.textContent = score;
        accuracyDisplay.textContent = '0%';
        userInput.disabled = false;
        currentWordIndex = 0;
        loadWord();
        intervalId = setInterval(updateTimer, 10);
      }
    }
  
    function updateGame() {
      if (!startTime) return;
      const typedText = userInput.value;
      const currentWord = words[currentWordIndex];
      totalChars++;
      let correct = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentWord[i]) {
          correct++;
        }
      }
      correctChars += correct;
      if (typedText === currentWord) {
        correctChars += currentWord.length - correct;
        score += currentWord.length;
        currentWordIndex++;
        if (currentWordIndex < words.length) {
          loadWord();
        } else {
          endGame();
        }
      }
      const accuracy = totalChars === 0 ? 0 : (correctChars / totalChars) * 100;
      accuracyDisplay.textContent = `${accuracy.toFixed(2)}%`;
      scoreDisplay.textContent = score;
    }
  
    function endGame() {
      if (startTime) {
        const endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000;
        const accuracy = totalChars === 0 ? 0 : (correctChars / totalChars) * 100;
        let scoreText = "Good Trial";
        if (accuracy === 100) scoreText = "Excellent";
        else if (accuracy >= 80) scoreText = "Great";
        else if (accuracy >= 60) scoreText = "Good";
        else scoreText = "Poor";
        const result = { time: timeTaken.toFixed(2), accuracy: accuracy.toFixed(2), score: scoreText, date: new Date().toLocaleString() };
        gameHistory.push(result);
        localStorage.setItem('typingHistory', JSON.stringify(gameHistory));
        timerDisplay.textContent = timeTaken.toFixed(2);
        scoreDisplay.textContent = scoreText;
        userInput.disabled = true;
        startTime = null;
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  
    function updateTimer() {
      if (startTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = (currentTime - startTime) / 1000;
        timerDisplay.textContent = timeElapsed.toFixed(2);
      }
    }
  
    if (window.location.pathname.endsWith('game.html')) {
      displayUsername();
      startGame();
      userInput.addEventListener('input', updateGame);
      if (showHistoryBtn && historyList) {
        showHistoryBtn.addEventListener('click', function () {
          historyList.innerHTML = '';
          gameHistory.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `Time: ${entry.time}s, Accuracy: ${entry.accuracy}%, Score: ${entry.score} (${entry.date})`;
            historyList.appendChild(listItem);
          });
        });
      }
    }
  
    //  Homepage (index.html) 
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      const h1 = document.querySelector('h1');
      if (h1) {
        h1.style.color = 'blue'; //keep this
        h1.addEventListener('mouseenter', () => {
          h1.style.color = 'black'; // Change to black on hover
        });
        h1.addEventListener('mouseleave', () => {
          h1.style.color = 'blue'; // Change back to blue on mouse leave
        });
      }
    }
  });