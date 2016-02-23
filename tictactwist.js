/******************************************************************************

                                                    Created By: Luke Thomas
                                                    Updated: Feb 21, 2016
                                                    github.com/lukethethomas1
                                Tic Tac Twist
    
    File: tictactwist.js
    Description: Provides core functionality of the tictactwist application:
    handling arrow key events and moving the window accordingly.

    Plans for the future:
     - Spacebar to place X and O, turn into actual tic tac toe
     - Create a mini map in one corner of the screen in order to see board

******************************************************************************/

$(document).ready(function() {

        // Grid System Diagram
    //
    //          col[0] col[1] col[2]
    //  row[0]  1      2      3
    //  row[1]  4      5      6
    //  row[2]  7      8      9

    // X and Y coordinates of the currentBox box
    // Increasing row will move right, decreasing row will move left
    // Increasing column will move down, decreasing column will move up
    var row = 1;
    var column = 1;

    // Hold the css classes for X and O, to be used in contains and toggle
    var xClass = "xbox";
    var oClass = "obox";

    var xScore = document.querySelector("#xscore");
    var oScore = document.querySelector("#oscore");

    // Variables to track of game state
    var boxCount = 0;
    var gameOver = false;

    // The text to display win or cats game
    var victoryText = document.querySelector("#victory");
    // Start victory text as hidden
    $(victoryText).hide();

    // Get the amount of rows and columns
    var NUM_ROWS = document.querySelectorAll(".row-container").length;
    // Get the amount of boxes and divide by the amount of rows
    // assumes each row has the same number of boxes
    var NUM_COLS = document.querySelectorAll(".box").length / NUM_ROWS;

    var isNextX = true;

    // Create an array to hold each row, each row will hold boxes
    var boxes = [];

    // Initialize boxes array by creating each row and filling it with all the
    // boxes in that row
    for(var numRow = 0; numRow < NUM_ROWS; numRow++) {
        // Create row
        boxes.push([]);

        // Add boxes
        for(var numCol = 0; numCol < NUM_COLS; numCol++) {
            boxes[numRow].push(document.querySelectorAll(".col" + numCol)[numRow]);
        }
    }

    var miniboxes = [];

    // Initialize boxes array by creating each row and filling it with all the
    // boxes in that row
    for(var numRow = 0; numRow < NUM_ROWS; numRow++) {
        // Create row
        miniboxes.push([]);

        // Add boxes
        for(var numCol = 0; numCol < NUM_COLS; numCol++) {
            miniboxes[numRow].push(document.querySelectorAll(".data" + numCol)[numRow]);
        }
    }

    // Set default box, at point 0,0
    var currentBox = boxes[row][column];
    // Set default minimap box, at point 0,0
    var currentMiniBox = miniboxes[row][column];

    // Start at correct initial position
    moveVertical();
    moveHorizontal();
    updateMiniMap();


    // Beginning of dynamic code


    // I feel like this isn't the most efficient method, plan on finding a
    // better way in the future
    function checkWin(player) {
        // Variables to keep track of win, start at true and are proved false
        var horizontalWin = true;
        var verticalWin = true;
        var d1Win = true;
        var d2Win = true;

        // Check horizontally
        for(var cIndex = 0; cIndex < NUM_COLS; cIndex++) {
            // Check each column at the same row value
            if(!boxes[row][cIndex].classList.contains(player)) {
                horizontalWin = false;
            }
        }

        // Check vertically
        for(var rIndex = 0; rIndex < NUM_ROWS; rIndex++) {
            // Check each row at the same column value
            if(!boxes[rIndex][column].classList.contains(player)) {
                verticalWin = false;
            }
        }

        // Check if the latest piece was placed in a position that could win
        // diagonally
        if((row === column) || (Math.abs(row - column) === NUM_ROWS - 1)) {
            for(var d = 0; d < NUM_ROWS; d++) {
                // Check diagonally from top left to bottom right
                if(!boxes[d][d].classList.contains(player)) {
                    d1Win = false;
                }

                // Check diagonally from bottom left to top right
                if(!boxes[NUM_ROWS - d - 1][d].classList.contains(player)) {
                    d2Win = false;
                }
            }
        }

        // Couldn't have won diagonally
        else {
            d1Win = false;
            d2Win = false;
        }

        //console.log("H: " + horizontalWin + ", V: " + verticalWin + ", D: " + d1Win + ", " + d2Win);

        // Player wins
        if(horizontalWin || verticalWin || d1Win || d2Win) {
            if(player === xClass) {
                victoryText.textContent = "X Player Wins!";
                // Increase score of X player
                xScore.textContent = Number(xScore.textContent) + 1
            }
            else {
                victoryText.textContent = "O Player Wins!";
                // Increase score of O player
                oScore.textContent = Number(oScore.textContent) + 1
            }

            $(victoryText).show('slow');
            gameOver = true;
            return true;
        }

        // If all spaces are taken and nobody has won
        if(boxCount === NUM_ROWS * NUM_COLS) {
            victoryText.textContent = "Cat's Game";
            $(victoryText).show('slow');
            gameOver = true;
        }

        // Didn't win... yet
        return false;

    }

    // Resets the game; the boxes, the victory text, and game over condition
    function resetGame() {
        // Clear the main boxes and the minimap boxes
        for(var rIndex = 0; rIndex < NUM_ROWS; rIndex++) {
            for(var cIndex = 0; cIndex < NUM_COLS; cIndex++) {
                // Clear main boxes
                boxes[rIndex][cIndex].classList.remove(xClass, oClass);
                boxes[rIndex][cIndex].textContent = "";
                // Clear minimap boxes
                miniboxes[rIndex][cIndex].classList.remove(xClass, oClass);
                miniboxes[rIndex][cIndex].textContent = "";
            }
        }

        // Hide end game text
        $(victoryText).hide();

        // Reset number of filled boxes
        boxCount = 0;

        // Start the game again
        gameOver = false;
    }

    // Moves window horizontally to new position
    function moveHorizontal() {
        $('body').animate({
            scrollLeft: $(currentBox).offset().left
        }, 100);
    }


    // Moves window vertically to new position
    function moveVertical() {
        $('body').animate({
            scrollTop: $(currentBox).offset().top
        }, 100);
    }

    function updateMiniMap() {
        // Remove from old box
        currentMiniBox.classList.remove("current-mini-box");
        // Update minimap box
        currentMiniBox = miniboxes[row][column];
        // Add to new box
        currentMiniBox.classList.add("current-mini-box");
    }


    // Intercept keydown events and handle appropriately
    $(document).keydown(function(evt) {
        // Make sure event is valid
        evt = evt || window.event;
        // Suppress default key event
        evt.preventDefault();

        // Space bar
        if (evt.keyCode === 32) {
            // Box is empty, no x or o
            if(!currentBox.classList.contains(xClass) && 
               !currentBox.classList.contains(oClass) && !gameOver) {
                // Increment number of spaces filled
                boxCount++;

                // Place an X            
                if(isNextX) {
                    // Set the main box to an X
                    currentBox.classList.toggle(xClass);
                    currentBox.textContent = "X";
                    // Set the minimap box to an X
                    currentMiniBox.classList.toggle(xClass);
                    currentMiniBox.textContent = "X";

                    // Check if X player won the game
                    checkWin(xClass);
                }

                // Place an O
                else {
                    // Set the main box to an O
                    currentBox.classList.toggle(oClass);
                    currentBox.textContent = "O";
                    // Set the minimap box to an O
                    currentMiniBox.classList.toggle(oClass);
                    currentMiniBox.textContent = "O";

                    // Check if O player won the game
                    checkWin(oClass);
                }

                // Change next piece placed
                isNextX = !isNextX;
            }

            // If player presses space after game is over, restart game
            else if(gameOver) {
                resetGame();
            }
        }

        // Left arrow key
        if (evt.keyCode === 37) {
            // Stay in bounds
            if(column > 0) {
                // Decreasing column moves left
                currentBox = boxes[row][--column];
                moveHorizontal();
            }
        }

        // Up arrow key
        if (evt.keyCode === 38) {
            // Stay in bounds
            if(row > 0) {
                // Decreasing row moves up
                currentBox = boxes[--row][column];
                moveVertical();
            }
        }

        // Right arrow key
        if (evt.keyCode === 39) {
            // Stay in bounds
            if(column < NUM_COLS - 1) {
                // Increasing column moves right
                currentBox = boxes[row][++column];
                moveHorizontal();
            }
        }

        // Down arrow key
        if (evt.keyCode === 40) {
            // Stay in bounds
            if(row < NUM_ROWS - 1) {
                // Increasing row moves down
                currentBox = boxes[++row][column];
                moveVertical();
            }
        }

        // Keep track of position in minimap
        updateMiniMap();
    });
});