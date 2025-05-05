// Vocabulary data - Japanese-Mongolian dictionary
const vocabularyData = [
  {"word": "財布", "romaji": "saifu", "meaning": "түрийвч"},
  {"word": "わたし", "romaji": "watashi", "meaning": "би"},
  {"word": "わたしたち", "romaji": "watashitachi", "meaning": "бид нар"},
  {"word": "あなた", "romaji": "anata", "meaning": "чи, та"},
  {"word": "あのひと", "romaji": "ano hito", "meaning": "тэр хүн"},
  {"word": "あのかた", "romaji": "ano kata", "meaning": "тэр хүн (хүндэтгэлийн хэллэг)"},
  {"word": "みなさん", "romaji": "minasan", "meaning": "та бүхэн"},
  {"word": "～さん", "romaji": "~san", "meaning": "— гуай"},
  {"word": "～ちゃん", "romaji": "~chan", "meaning": "— хүүхэд, дотно эмэгтэй"},
  {"word": "～くん", "romaji": "~kun", "meaning": "хүний нэрний ард, өөртэйгөө адил зиндаа эсвэл доош эрэгтэй"},
  // ... more vocabulary data
];

// Application state variables
let currentIndex = 0;
let currentScore = 0;
let wrongAnswers = 0;
let filteredWords = [...vocabularyData];
let quizLength = 10; // How many words to show in a quiz session
let currentQuizWord = null;

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.getElementById('search-input');
const quizWord = document.getElementById('quiz-word');
const quizRomaji = document.getElementById('quiz-romaji');
const optionButtons = document.querySelectorAll('#jp-to-mn .option-button');
const mnOptionButtons = document.querySelectorAll('#mn-to-jp .option-button');
const progressBar = document.querySelector('.progress-bar');
const quizCount = document.querySelectorAll('.quiz-count');
const quizScore = document.querySelectorAll('.quiz-score');
const prevButton = document.getElementById('prev-word');
const nextButton = document.getElementById('next-word');
const randomButton = document.getElementById('random-word');
const prevButtonMn = document.getElementById('prev-word-mn');
const nextButtonMn = document.getElementById('next-word-mn');
const randomButtonMn = document.getElementById('random-word-mn');

// Main functionality
// 1. Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Reset quiz state when switching tabs
        currentIndex = 0;
        currentScore = 0;
        updateQuizUI();
    });
});

// 2. Generate quiz options
function generateOptions(correctAnswer, isJapaneseToMongolian = true) {
    // Create a set of options including the correct answer
    let options = [correctAnswer];
    
    // Add random options until we have 4 total
    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * vocabularyData.length);
        const randomOption = isJapaneseToMongolian ? 
            vocabularyData[randomIndex].meaning : 
            vocabularyData[randomIndex].word;
        
        // Only add if it's not already in options
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    
    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
}

// 3. Update UI for Japanese to Mongolian quiz
function updateQuizUI() {
    if (currentIndex < vocabularyData.length) {
        currentQuizWord = vocabularyData[currentIndex];
        
        // Update word display
        quizWord.textContent = currentQuizWord.word;
        quizRomaji.textContent = currentQuizWord.romaji;
        
        // Update options
        const options = generateOptions(currentQuizWord.meaning);
        optionButtons.forEach((button, index) => {
            button.textContent = options[index];
            button.classList.remove('correct', 'incorrect');
        });
        
        // Update progress
        const progress = ((currentIndex + 1) / quizLength) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update count and score
        quizCount.forEach(el => el.textContent = `${currentIndex + 1}/${quizLength}`);
        quizScore.forEach(el => el.textContent = `Оноо: ${currentScore}`);
    }
}

// 4. Handle option selection
optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedOption = button.textContent;
        const correctAnswer = currentQuizWord.meaning;
        
        if (selectedOption === correctAnswer) {
            button.classList.add('correct');
            currentScore++;
            quizScore.forEach(el => el.textContent = `Оноо: ${currentScore}`);
        } else {
            button.classList.add('incorrect');
            // Find and highlight the correct answer
            optionButtons.forEach(b => {
                if (b.textContent === correctAnswer) {
                    b.classList.add('correct');
                }
            });
            wrongAnswers++;
        }
        
        // Disable all buttons after selection
        optionButtons.forEach(b => b.disabled = true);
        
        // Move to next word after a short delay
        setTimeout(() => {
            optionButtons.forEach(b => b.disabled = false);
            if (currentIndex < quizLength - 1) {
                currentIndex++;
                updateQuizUI();
            } else {
                // Quiz completed
                alert(`Дууслаа! Таны оноо: ${currentScore}/${quizLength}`);
                currentIndex = 0;
                currentScore = 0;
                wrongAnswers = 0;
                updateQuizUI();
            }
        }, 1500);
    });
});

// 5. Navigation buttons
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateQuizUI();
    }
});

nextButton.addEventListener('click', () => {
    if (currentIndex < quizLength - 1) {
        currentIndex++;
        updateQuizUI();
    }
});

randomButton.addEventListener('click', () => {
    currentIndex = Math.floor(Math.random() * vocabularyData.length);
    updateQuizUI();
});

// 6. Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filteredWords = vocabularyData.filter(item => 
        item.word.toLowerCase().includes(searchTerm) || 
        item.romaji.toLowerCase().includes(searchTerm) || 
        item.meaning.toLowerCase().includes(searchTerm)
    );
    
    // Reset current index and update UI with filtered words
    currentIndex = 0;
    updateQuizUI();
});

// Initialize the application
updateQuizUI();
