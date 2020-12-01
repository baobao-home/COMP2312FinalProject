/*
Kok_Laurinda_COMP_2312_Project
*/
const imagePlaceholder = document.getElementById("imagePlaceholder");
const letterSlotsPlaceholder    = document.getElementById("letterSlotsPlaceholder");
const hintToGuessPlaceholder = document.getElementById("hintToGuess");
const outpputRemainingLettersToGuess = document.getElementById("output_remainingLettersToGuess");
const outputGuessRemaining = document.getElementById('output_guessRemaining');

//constants for pop up box
const gameResultBox = document.getElementById('gameResult');
const btnPlayAgain = document.getElementById('btn-playAgain');
const resultImage = document.getElementById('resultImage');

const imagePath = "images";

//boolean to track if game is in progress
let gameHasStarted = true;

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
const word6 = new Word('chocolate', 'Something dark and sweet and yummy')

//create list of words
let arrayOfWords = [word1, word2, word3, word4, word5, word6];

//the word In Play
let theWord = {};

//guess a Letter
let yourGuess;

//sound objects
const soundCorrect = new Audio("audio/correct.mp3");
const soundIncorrect = new Audio("audio/incorrect.mp3");
const soundWinning = new Audio("audio/musicWinning.mp3");
const soundLosing = new Audio("audio/musicLosing.mp3");

/*
Starting Game
*/

//draw new word
drawWord();

/* 
initialize status when game starts 
*/
//max num of guesses
const maxGuesses = 7;

let guessRemaining = maxGuesses;

let remainingLettersToGuess;
remainingLettersToGuess = theWord.length;

//display status
displayStatus(guessRemaining, remainingLettersToGuess);

//create letter slots array in the size of theWord
let letterSlotsInPlay = new Array(theWord.length);
let emptySlot = "_ "; 
let startingSlots = "";

//create letter slots to display
startingSlots += emptySlot.repeat(theWord.length);
letterSlotsPlaceholder.innerHTML = startingSlots;

//counter for dying animation
let counterDying = 0;

//creating eventlistener for each key
$(".btn").click(function(){
    yourGuess = $(this).text();

    //match guesssing letter with theWord
    matchLetter(yourGuess);

    //disable button
    $(this).attr('disabled', 'disabled');
});

/*
All functions follow here
*/

//randomly draw a word from list
function drawWord() {
    //random number. maximum num is the size of array
    let index = Math.round(Math.random() * arrayOfWords.length);
    theWord = arrayOfWords[index].spellWord();
    //display hint
    hintToGuessPlaceholder.innerHTML = "HINT: " + arrayOfWords[index].describeHint();
}

//function to update status display
function displayStatus(NumGuessRemaining, NumRemainingLetters) {
    outputGuessRemaining.innerHTML = `Guess Remaining: ${NumGuessRemaining}/${maxGuesses}`;
    outpputRemainingLettersToGuess.innerHTML = `Remaining letters to guess: ${NumRemainingLetters}`;
}

//function to match your guess letter
function matchLetter(guess) {

    //convert the word string into an array for matching
    let theWordInArray = theWord.toUpperCase().split('');

    //create an array of empty slots
    let letterSlots = [theWord.length];

    //update letterslots with every guess to get the main letterSlotsInPlay
    letterSlots = letterSlotsInPlay;

    //if word includes guess letter
    if(theWordInArray.includes(guess)) {
          
        //matching each character and update the letter slot array
        theWordInArray.forEach(function(element, index) {
            //if match
            if(element == guess) {
                //same index in theWord and in letterSlots
                letterSlots[index] = element;
    
                //update remaining letters to guess
                remainingLettersToGuess--;

                //display status
                displayStatus(guessRemaining, remainingLettersToGuess);
    
                //update image
                updateAnimationCorrect();
            }
        });
        //update letterSlotsInPlay with the updated newly matched letter slots
        letterSlotsInPlay = letterSlots;
        updateLetterSlotsDisplay();
    }
    //no match in word
    else {
        guessRemaining--;

        //animation incoorect
        updateAnimationIncorrect();      

        //display status
        displayStatus(guessRemaining, remainingLettersToGuess);
    }
}

//function to update the display letter slots
function updateLetterSlotsDisplay() {
    //clear main slot display
    letterSlotsPlaceholder.innerHTML = "";
    let slotString = "";
    for(let i= 0; i < letterSlotsInPlay.length; i++) {
        //if array member is empty, return undefined
        if (letterSlotsInPlay[i] == undefined) {
            slotString += "_";
        }
        else {
            slotString += letterSlotsInPlay[i];
        }
    }
    //update main slot display
    letterSlotsPlaceholder.innerHTML = slotString;
}

//function to update image if guess is correct
function updateAnimationCorrect() {
        //play a sound
        soundCorrect.play();

        //no more letters left to guess
        if(remainingLettersToGuess == 0) {
            //end game
            gameHasStarted = false;

            //disable keyboard
            $(".btn").attr('disabled', 'disabled');
            
            //popup to display winning result
            showPopUp('won');
        }
}

//funcion to update image if guess is incorrect
 function updateAnimationIncorrect() {

        //play incorrect sound
        soundIncorrect.play();

        //unhide warning and add style to incorrect guess
        $("#incorrectGuesses").css('visibility', "visible");
        $("#incorrectGuesses").addClass("incorrectWarning");

        if(guessRemaining  == 6) {
            //update image inccorrect
            imagePlaceholder.src = `${imagePath}/incorrect1.png`;
            updateIncorrectStatus();
        }
        else if (guessRemaining == 5) {
            imagePlaceholder.src = `${imagePath}/incorrect2.png`;
            updateIncorrectStatus();
        }
        else if (guessRemaining == 4) {
            imagePlaceholder.src = `${imagePath}/incorrect3.png`;
            updateIncorrectStatus();
        }
        else if (guessRemaining == 3) {
            imagePlaceholder.src = `${imagePath}/incorrect4.png`;
            updateIncorrectStatus();
        }        
        else if (guessRemaining == 2) {
            imagePlaceholder.src = `${imagePath}/incorrect5.png`;
            updateIncorrectStatus();
        }
        else if (guessRemaining == 1) {
            imagePlaceholder.src = `${imagePath}/incorrect6.png`;
             updateIncorrectStatus();           
            //update style for last warning for incorrect guess
            $("#incorrectGuesses").removeClass("incorrectWarning").addClass('incorrectLastWarning');
        }
        //using up all guesses
        else if (guessRemaining == 0) {

            //animate dying
            animationDying();

            //ending game
            gameHasStarted = false;

            //disable keyboard
            $(".btn").attr('disabled', 'disabled');

            //update incorrect bar
            updateIncorrectStatus();

            //update style
            $("#incorrectGuesses").removeClass('incorrectLastWarning').addClass('incorrectDying');

           //delay popup result to display losing result
           setTimeout(function(){
            showPopUp('lost');            
           }, 4500);
        }
}

//function to update Incorrect warning box
function updateIncorrectStatus() {
    $("#incorrectGuesses").text(`Incorrect Guesses: ${guessRemaining}/${maxGuesses}`);
}

//function to show result popup
function showPopUp(winOrLost) {
    //show result popup
    //$("#gameResult").css("visibility", "visible");
    $("#gameResult").fadeIn('slow');

    //display winning or losing message
    if (winOrLost == 'won') {
        //winning
        resultImage.innerHTML = `<img src='${imagePath}/youWon.gif' style="width:500px"/>`;
        $("#resultWinLost").text("YOU WON!");
        soundWinning.play();
    }
    else if (winOrLost == 'lost'){
        //losing
        resultImage.innerHTML = `<img src='${imagePath}/youLost.gif' style="height:250px"/>`;   
        $("#resultWinLost").text("YOU LOST!");    
    }
}

//button to close the popup
btnPlayAgain.addEventListener("click", function(){
    //button works only if game has ended
    if(!gameHasStarted) {
        gameResultBox.style.visibility = "hidden";
        //reload page to start new game
        location.reload();
    }
});

//function for dying animation
function animationDying(){
    let maxImageNum = 6;

    //create interval to loop through dying images
    let dyingInterval = setInterval(function(){
        counterDying ++;

        imagePlaceholder.src = imagePath + "/dying" + counterDying + ".png";
        if(counterDying >= maxImageNum) {
            clearInterval(dyingInterval);

            //play losing audio
            soundLosing.play();            
        }
    }, 400);
}

/*
//this keyboard code doesn't work
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

