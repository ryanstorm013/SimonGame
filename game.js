var array = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var score = 0;
var highscore = localStorage.getItem("highscore") ;
var begin = false;

//plays sound from sounds file
function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}


//Buttons have fade in and out animation 
function animatePress(currentColor) {
    
    
    $("#" + currentColor).addClass("pressed");

    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);


    $("#" + currentColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

//setting the score for high score in local storage 
function highScore() {
    if (highscore !== null) {
            localStorage.setItem("highscore", highscore);
    } 
    else {
        highscore = 0;
    }

}

//storage change in real time whenever high score changes
function handleStorageChange(event) {
    if(event.key === "highscore") {
        highscore = event.newValue;

    }
}

window.addEventListener("storage", handleStorageChange);

//choosing random button to for the user to activate
function nextSequence() {

    userClickedPattern = [];
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = array[randomNumber];
    

    
    gamePattern.push(randomChosenColour);
    
    
    level++;
    $("h1").text("Level " + level);
    $("h2").text("");

    

    playSound(randomChosenColour);
    animatePress(randomChosenColour);

}

//Checks user's answer if the input is either incorrect or correct
function checkAnswer(currentLevel) {
    var wrong = new Audio("sounds/wrong.mp3");
    //Correct Answer, next Sequence
    if(gamePattern[currentLevel] == userClickedPattern[currentLevel]) {
        if(gamePattern.length == userClickedPattern.length) {     
            setTimeout(function(){
                nextSequence();
                score++;
                highScore();
            }, 1000);
        }
    }
    //Incorrect Answer, stop the game and list score and high score
    else {
        wrong.play();
        if (score > highscore) {
            localStorage.setItem("highscore", score);
        }
        $("h1").text("Game over, Press the Enter Key to Restart");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);

        $(".myScore").text("Score: " + score);
        $(".myHighScore").text("High Score: " + highscore);

        score = 0;
        startOver();
    }
}

//Restart level to zero and resetting pattern to restart the game
function startOver() {
    begin = false;
    level = 0;
    gamePattern = [];
}

//button clicks for the colored buttons, will play sound and takes id from images
$(".btn").click(function() {
    var userChosenColour = $(this).attr("id");
    

    playSound(userChosenColour);
    animatePress(userChosenColour);

    userClickedPattern.push(userChosenColour);

    //Deletes previous answer once user clicks on the correct answer, back to 0
    //resets array for additional inputs
    checkAnswer(userClickedPattern.length - 1);

});

//Keypress for pressing enter to start the Simon game
$(document).keydown(function(event) {
    var key = (event.keyCode ? event.keyCode : event.which);
    
    if(!begin) {
        if (key == '13') {
            nextSequence();
            begin = true;
        }
    }
    
});

