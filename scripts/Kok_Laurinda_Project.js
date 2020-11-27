/*
Kok_Laurinda_COMP_2312_Project
*/
const imagePlaceholder = document.getElementById("imagePlaceholder");
const letterSlotsPlaceholder    = document.getElementById("letterSlotsPlaceholder");
const hintToGuessPlaceholder = document.getElementById("hintToGuess");
const incorrectGuesses = document.getElementById("incorrectGuesses");
const keyboardPlaceholder     = document.getElementById("keyboardPlaceholder");
const outputGameInProgress = document.getElementById("output_gameInProgress");
const outpputRemainingLettersToGuess = document.getElementById("output_remainingLettersToGuess");
const outputGuessRemaining = document.getElementById('output_guessRemaining');

//constants for pop up box
const gameResultBox = document.getElementById('gameResult');
const btnPlayAgain = document.getElementById('btn-playAgain');
const resultImage = document.getElementById('resultImage');



//boolean to track if game is in progress
let gameHasStarted = true;

//boolean to track winning or losing
let youWin = false;
let youLose = false;

//max num of guesses
const maxGuesses = 7;

//word object
class Word {
    constructor (spelling, hint) {
        this.spelling = spelling;
        this.hint = hint;
    }

    describeHint() {
        return this.hint;
    }
    
    spellWord() {
        return this.spelling;
    }
}

//create guessing words
const word1 = new Word('canada', 'A country with a maple leaf');
const word2 = new Word('beaver', 'An animal associated with Canada');
const word3 = new Word('vancouver', 'A city in Beautiful British Columbia');
const word4 = new Word('whistler', 'A ski resort near Vancouver');
const word5 = new Word('rabbit', 'An animal with long ears');

//create list of words
let arrayOfWords = [word1, word2, word3, word4, word5];

//the word In Play
let theWord;

//guess a Letter
let yourGuess;

//sound effects
const soundCorrect = new Audio("audio/correct.mp3");
const soundIncorrect = new Audio("audio/incorrect.mp3");
const soundWinning = new Audio("audio/musicWinning.mp3");
const soundLosing = new Audio("audio/musicLosing.mp3");

/*
Starting Game
*/
//build keyboard
//buildKeyboard();

//draw new word
drawWord();

//initialize guess when game starts
let guessRemaining;
guessRemaining = maxGuesses;
outputGuessRemaining.innerHTML = `Guess Remaining: ${guessRemaining}`;
let remainingLettersToGuess;

remainingLettersToGuess = theWord.length;
console.log('remainingletterstoguess: ' + remainingLettersToGuess);
console.log(youWin);
outpputRemainingLettersToGuess.innerHTML = `Remaining Letters to Guess: ${theWord.length}`;


//Letter slots
let letterSlotsInPlay = new Array(theWord.length);
let emptySlot = "_ "; 
let startingSlots = "";
startingSlots += emptySlot.repeat(theWord.length);
letterSlotsPlaceholder.innerHTML = startingSlots;
console.dir(startingSlots);

//randomly draw a word from list
function drawWord() {
    let index = Math.round(Math.random() * arrayOfWords.length);
    theWord = arrayOfWords[index].spellWord();
    console.log(theWord);
    hintToGuessPlaceholder.innerHTML = "HINT: " + arrayOfWords[index].describeHint();

}

/*
//get guess key
function getKey(aKey) {
        let guessKey = aKey;
        console.log(guessKey);
}

function buildKeyboard() {
    let arrayOfKeys1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    let arrayOfKeys2 = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for(let index = 0; index < arrayOfKeys1.length; index++ ) {
        keyboardPlaceholder.innerHTML += `<button id ='btn-${arrayOfKeys1[index]}' value='${arrayOfKeys1[index]}' class = 'key' onclick='getKey(${arrayOfKeys1[index]})'>${arrayOfKeys1[index]}</button>`;

    }
}
*/

//creating eventlistener for each key
$(".btn").click(function(){
    yourGuess = $(this).text();
    console.log(yourGuess);

    //match guesssing letter with theWord
    matchLetter(yourGuess);

    //disable button
    $(this).attr('disabled', 'disabled');

});



function matchLetter(guess) {
    console.log('matchLetter: ' + guess);

    //convert the word string into an array for matching
    let theWordInArray = theWord.toUpperCase().split('');
    console.dir(theWord);
    console.dir(theWordInArray);

    let letterSlots = [theWord.length];
    letterSlots = letterSlotsInPlay;

    //flag to check if no match
    let youMadeAnincorrectGuess = false;

    console.dir('before: ' +letterSlots);


    //matching each characters and update the slot array
    theWordInArray.forEach(function(element, index) {
        //if match
        if(element == guess) {
            letterSlots[index] = element;

            //update remaining letters to guess
            remainingLettersToGuess--;
            outpputRemainingLettersToGuess.innerHTML = remainingLettersToGuess;

            //update image
            updateAnimationCorrect();
        }
        //if no match
        else {
            youMadeAnincorrectGuess = true;
        }
    });
    letterSlotsInPlay = letterSlots;
    updateLetterSlots();

    //made incorrect guess
    //update guess remaining
    if(youMadeAnincorrectGuess == true ) {
        updateAnimationIncorrect();
        guessRemaining--;
        outputGuessRemaining.innerHTML = `${guessRemaining}/${maxGuesses}`;
    }

    //reset flag to default false
    //youMadeAnincorrectGuess == false;
    
    console.log(guessRemaining);
    console.dir('letterSlots: ' + letterSlots);
    console.dir("letterSlotsInPlay:" + letterSlotsInPlay);
}

function updateLetterSlots() {
    letterSlotsPlaceholder.innerHTML = "";
    let slotString;
    for(let i= 0; i < letterSlotsInPlay.length; i++) {
        if (letterSlotsInPlay[i] == undefined) {
            slotString += "_";
        }
        else {
            slotString += letterSlotsInPlay[i];
        }
    }
    console.dir(slotString);
    letterSlotsPlaceholder.innerHTML = slotString;
}

//guess is correct
function updateAnimationCorrect() {
    let imagePath = "images";

        //play a sound
        soundCorrect.play();

        //no more letters left to guess
        if(remainingLettersToGuess == 0) {
            //you won
            youWin = true;
            gameHasStarted = false;
            console.log(youWin);
            
            //popup to display result
            gameResultBox.style.visibility = "visible";
            resultImage.innerHTML = `<img src='${imagePath}/youWon.gif' style="width:500px"/>`;
        }
}
    
//guess is incorrect
 function updateAnimationIncorrect() {
    let imagePath = "images";

        //play incorrect sound
        soundIncorrect.play();

        if(guessRemaining  == 6) {
            //update image inccorrect
            imagePlaceholder.src = `${imagePath}/incorrect1.png`;

        }
        else if (guessRemaining == 5) {
            imagePlaceholder.src = `${imagePath}/incorrect2.png`;
        }
        else if (guessRemaining == 4) {
            imagePlaceholder.src = `${imagePath}/incorrect3.png`;
        }
        else if (guessRemaining == 3) {
            imagePlaceholder.src = `${imagePath}/incorrect4.png`;
        }        
        else if (guessRemaining == 2) {
            imagePlaceholder.src = `${imagePath}/incorrect5.png`;
        }
        else if (guessRemaining == 1) {
            imagePlaceholder.src = `${imagePath}/incorrect6.png`;
        }
        //using up all guesses
        else if (guessRemaining == 0) {
            imagePlaceholder.src = `${imagePath}/dying1.png`;

            youLose = true;
            gameHasStarted = false;

            //popup to display info
            gameResultBox.style.visibility = "visible";
            resultImage.innerHTML = `<img src='${imagePath}/youLost.gif' style="height:250px" />`;
        }
}
 


//button to close the popup
btnPlayAgain.addEventListener("click", function(){
    if(!gameHasStarted) {
        gameResultBox.style.visibility = "hidden";
        //reload page
        location.reload();
    }
});

function animationDying(){
    let maxImageNum = 5;

}