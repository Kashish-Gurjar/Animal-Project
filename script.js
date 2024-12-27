// Speech recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;

// Text to speech setup
const speech = new SpeechSynthesisUtterance();

// Game state
let currentAnimalIndex = 0;
let score = 0;

// Animal data
const animals = [
    { name: 'cat', image: 'images/cat.jpg' },
    { name: 'dog', image: 'images/dog.jpg' },
    { name: 'lion', image: 'images/lion.jpg' },
    // { name: 'elephant', image: 'images/elephant.jpg' }
];

// DOM Elements
const animalImage = document.getElementById('animalImage');
const speakButton = document.getElementById('speakButton');
const hintButton = document.getElementById('hintButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const scoreValue = document.getElementById('scoreValue');
const feedback = document.getElementById('feedback');

// Initialize game
function initGame() {
    // Show image loading message
    animalImage.src = '';
    feedback.textContent = 'Loading images...';
    
    // Preload images
    Promise.all(animals.map(animal => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => {
                feedback.textContent = `Failed to load ${animal.name} image. Please check images folder.`;
                reject();
            };
            img.src = animal.image;
        });
    }))
    .then(() => {
        feedback.textContent = '';
        updateAnimalDisplay();
        setupEventListeners();
    })
    .catch(() => {
        feedback.textContent = 'Some images failed to load. Please check the images folder.';
    });
}

// Update display
function updateAnimalDisplay() {
    animalImage.src = animals[currentAnimalIndex].image;
    animalImage.alt = `Image of ${animals[currentAnimalIndex].name}`;
    feedback.textContent = '';
}

// Event listeners
function setupEventListeners() {
    speakButton.addEventListener('click', startSpeechRecognition);
    hintButton.addEventListener('click', showHint);
    prevButton.addEventListener('click', showPreviousAnimal);
    nextButton.addEventListener('click', showNextAnimal);
}

// Speech recognition
function startSpeechRecognition() {
    feedback.textContent = 'Listening...';
    recognition.start();
}

recognition.onresult = (event) => {
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    checkAnswer(spokenWord);
};

recognition.onend = () => {
    if (feedback.textContent === 'Listening...') {
        feedback.textContent = 'No speech detected. Try again.';
    }
};

// Game logic
function checkAnswer(spokenWord) {
    const correctAnswer = animals[currentAnimalIndex].name;
    if (spokenWord === correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    score++;
    scoreValue.textContent = score;
    feedback.textContent = 'Correct!';
    speech.text = 'Congratulations!';
    window.speechSynthesis.speak(speech);
}

function handleWrongAnswer() {
    feedback.textContent = 'Try again!';
    speech.text = 'Try again!';
    window.speechSynthesis.speak(speech);
}

// Navigation
function showNextAnimal() {
    currentAnimalIndex = (currentAnimalIndex + 1) % animals.length;
    updateAnimalDisplay();
}

function showPreviousAnimal() {
    currentAnimalIndex = (currentAnimalIndex - 1 + animals.length) % animals.length;
    updateAnimalDisplay();
}

// Hint system
function showHint() {
    const currentAnimal = animals[currentAnimalIndex].name;
    feedback.textContent = `Hint: The animal starts with '${currentAnimal[0]}'`;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);