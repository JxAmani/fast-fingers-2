document.addEventListener(`DOMContentLoaded`, () => {
    // Game Page (game.html)
    // placing html elements into javaScript variables for manipulation
    const usernameDisplay = document.querySelector('.username-display'); // Displays the username
    const textDisplay = document.getElementById('text-display');  // Displays the word to type
    const userInput = document.getElementById('user-input');// The text input field--place the user will type
    const timerDisplay = document.getElementById('timer'); // Displays the timer
    const scoreDisplay = document.getElementById('score');  // Displays the score
    const accuracyDisplay = document.getElementById('accuracy');// Displays the accuracy
    const historyList = document.getElementById('history-list');// The list to display history -- plan is it to be dependant on user
    const showHistoryBtn = document.getElementById('show-history-btn'); // The button to show history of the user
    const words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]; //words to be displayed which contain collectively every letter on the alphabet.
  
    // These variables-- storing the game stats .which is updates the more the user plays.
    let currentWordIndex = 0;   // 0 means starting from first word
    let startTime;         // Time when the game started
    let correctChars = 0;    // Accuracy--Number of correctly typed characters(Chars--characters )
    let totalChars = 0;      // Total number of typed characters
    let gameHistory = JSON.parse(localStorage.getItem('typingHistory')) || []; // Array to store game history
    let score = 0;           // Player's score
    let intervalId;        // To store the ID of the timer interval (for clearing it later)
  
    // This function displays the logged-in user's username.
    function displayUsername() {
      const loggedInUsername = localStorage.getItem('loggedInUser'); // Get username from local storage
      if (usernameDisplay && loggedInUsername) {
        // If the usernameDisplay  exists and a user is logged in, -- meaning that the user has registered
        // display the username.
        usernameDisplay.textContent = `Welcome ${loggedInUsername}`;
      }
    }
  
    // This function displays the word to be typed,  for id(text-dispay)
    // clears the user input  and focuses the input -meaning it will refresh and be ready eliminating need for user to manually refresh then click on bar to type.
    function loadWord() {
      if (textDisplay) {
        textDisplay.textContent = words[currentWordIndex]; // the words that will be displayed for the user to type whih are stored under the variable words
      }
      userInput.value = '';      // Clear the input field. '' empty string
      userInput.focus();          // Focus the input field-- this to eliminate the need for user to click on tab so as to start typing
    }
  
    // This function starts the game.= what user se's before starting the game
    function startGame() {
      if (!startTime) { // the reason for the !(negative) is because the game hasn't technicaly started and start time is hence undefined
        loadWord();           // Load the first word
        startTime = new Date().getTime(); // Record the start time
        correctChars = 0;    // Reset correct character count
        totalChars = 0;      // Reset total character count
        score = 0;           // Reset the score
        scoreDisplay.textContent = score;       // Display initial score
        accuracyDisplay.textContent = '0%';   // Display initial accuracy
        userInput.disabled = false;     // Enable the input field
        currentWordIndex = 0;     // Reset word index
        loadWord();               // Load the first word
        intervalId = setInterval(updateTimer, 10); // Start the timer (update every 10ms) & stores the ID of the interval
      }
    }
  
    // This function is for every time the user types a character
    // It updates the game stats (correct characters,total characters, score, accuracy) and checks if the current word has been completed.
    function updateGame() {
      if (!startTime) return; // If the game hasn't started -- this is what i want displayed before the user starts playing the game
  
      const typedText = userInput.value;      // Get the text the user has typed
      const currentWord = words[currentWordIndex]; // Get the current word
      totalChars++;                          // Increment the total number of characters typed
  
      let correct = 0;
      for (let i = 0; i < typedText.length; i++) {//This is a lop that is initialized by i=0 which is first word
        if (typedText[i] === currentWord[i]) {//i++ is so that the words displayed can move to the next one
          correct++;
        }
      }
      correctChars += correct;
  
      if (typedText === currentWord) {
        // If the user has typed the current word correctly...
        correctChars += currentWord.length - correct;
        score += currentWord.length;        // Add the word's length to the score
        currentWordIndex++;                // Move to the next word
  
        if (currentWordIndex < words.length) {
          // If there are more words to type...
          loadWord();             // Load the next word
        } else {
          // Otherwise, the game is over...
          endGame();              // End the game
        }
      }
  
      const accuracy = totalChars === 0 ? 0 : (correctChars / totalChars) * 100; // Calculate accuracy
      accuracyDisplay.textContent = `${accuracy.toFixed(2)}%`; // Display accuracy (to 2 decimal places)
      scoreDisplay.textContent = score;                  // Display the score
    }
  
    // This function ends the game.  It calculates the time taken,
    // accuracy, and score, stores the results in local storage -- so as to put in history of user,
    // updates the display, and resets the game stats.
    function endGame() {
      if (startTime) {
        const endTime = new Date().getTime();      // Record the end time
        const timeTaken = (endTime - startTime) / 1000; // Calculate time taken in seconds
        const accuracy = totalChars === 0 ? 0 : (correctChars / totalChars) * 100; // Calculate accuracy
        let scoreText = "Good Trial";
        if (accuracy === 100) scoreText = "Excellent";// can only get excellent when user has strictly 100% accuracy
        else if (accuracy >= 80) scoreText = "Great";
        else if (accuracy >= 60) scoreText = "Good trial";
        else scoreText = "Poor";//anything under 60% is poor attempt
        const result = {
          time: timeTaken.toFixed(2),    // Time taken (to 2 decimal places)
          accuracy: accuracy.toFixed(2), // Accuracy (to 2 decimal places)
          score: scoreText,              // Score text
          date: new Date().toLocaleString() // Date and time of the game
        };
  
        gameHistory.push(result);                                     // Add the result to the game history
        localStorage.setItem('typingHistory', JSON.stringify(gameHistory)); // Save history -- when logged-in
  
        timerDisplay.textContent = timeTaken.toFixed(2);    // Display time taken
        scoreDisplay.textContent = scoreText;                // Display score
        userInput.disabled = true;        // Disable the input f
        startTime = null;                 // Reset start time
        clearInterval(intervalId);        // Stop the timer interval
        intervalId = null;              // Clear the interval ID
      }
    }
  
    // This function updates the timer display.  It is called by the
    // setInterval() function every 10 milliseconds. so that evey 10 ms the timer is updated to show current time
    function updateTimer() {
      if (startTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
        timerDisplay.textContent = timeElapsed.toFixed(2);    // Display time taken
      }
    }
  
    // Check if the current page is game.html
    if (window.location.pathname.endsWith('game.html')) {
      displayUsername(); // Display the username
      startGame();     // Start the game
  
      userInput.addEventListener('input', updateGame); // Listen for user input
  
      if (showHistoryBtn && historyList) {
        showHistoryBtn.addEventListener('click', function () {
          historyList.innerHTML = ''; // empty string
          gameHistory.forEach(entry => {
            // Create a list item for each entry in the game history
            const listItem = document.createElement('li');
            listItem.textContent = `Time: ${entry.time}s, Accuracy: ${entry.accuracy}%, Score: ${entry.score} (${entry.date})`;
            historyList.appendChild(listItem); // Add the item to the history list
          });
        });
      }
    }
  
    // Homepage (index.html) 
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      // To style h1
      const h1 = document.querySelector('h1');
      if (h1) {
        h1.style.color = 'blue'; // Initial color of h1 is blue
        h1.addEventListener('mouseenter', () => {
          h1.style.color = 'black'; // Change to black when user hover
        });
        h1.addEventListener('mouseleave', () => {//when mouse is no longer hovering over h1
          h1.style.color = 'blue'; // Change back to blue on mouse leave
        });
      }
     
    }
  });