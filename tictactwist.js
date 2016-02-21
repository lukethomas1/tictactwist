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
    var row = 0;
    var column = 0;

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
            if(!currentBox.classList.contains("xbox") && !currentBox.classList.contains("obox")) {
                // Place an X            
                if(isNextX) {
                    currentBox.classList.toggle("xbox");
                    currentBox.textContent = "X";
                    currentMiniBox.classList.toggle("xbox");
                    currentMiniBox.textContent = "X";
                }

                // Place an O
                else {
                    currentBox.classList.toggle("obox");
                    currentBox.textContent = "O";
                    currentMiniBox.classList.toggle("obox");
                    currentMiniBox.textContent = "O";
                }

                isNextX = !isNextX;
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