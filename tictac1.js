$(document).ready(function() {
    // Start at correct initial position
    $(document).scrollLeft(0);
    $(document).scrollTop(0);

    // Get the amount of rows and columns
    var NUM_ROWS = document.querySelectorAll(".row-container").length;
    // Get the amount of boxes and divide by the amount of rows
    // assumes each row has the same number of boxes
    var NUM_COLS = document.querySelectorAll(".box").length / NUM_ROWS;

    // Create an array to hold each row, each row will hold boxes
    var nums = [];

    // Create each row, and fill it with all the boxes in that row
    for(var numRow = 0; numRow < NUM_ROWS; numRow++) {
        // Create row
        nums.push([]);

        // Add boxes
        for(var numCol = 0; numCol < NUM_COLS; numCol++) {
            nums[numRow].push(document.querySelectorAll(".col" + numCol)[numRow]);
        }
    }

    // Grid System Diagram
    //
    //          col[0] col[1] col[2]
    //  row[0]  1      2      3
    //  row[1]  4      5      6
    //  row[2]  7      8      9

    // X and Y coordinates of the current box
    // Increasing row will move right, decreasing row will move left
    // Increasing column will move down, decreasing column will move up
    var row = 0;
    var column = 0;

    // Moves window horizontally to new position
    function moveHorizontal() {
        $('body').animate({
            scrollLeft: $(nums[row][column]).offset().left
        }, 100);
    }

    // Moves window vertically to new position
    function moveVertical() {
        $('body').animate({
            scrollTop: $(nums[row][column]).offset().top
        }, 100);
    }

    // Intercept keydown events and handle appropriately
    $(document).keydown(function(evt) {
        // Make sure event is valid
        evt = evt || window.event;
        // Suppress default key event
        evt.preventDefault();

        // Left arrow key
        if (evt.keyCode == 37) {
            // Stay in bounds
            if(column > 0) {
                // Decreasing column moves left
                column--;
                moveHorizontal();
            }
        }

        // Up arrow key
        if (evt.keyCode == 38) {
            // Stay in bounds
            if(row > 0) {
                // Decreasing row moves up
                row--;
                moveVertical();
            }
        }

        // Right arrow key
        if (evt.keyCode == 39) {
            // Stay in bounds
            if(column < NUM_COLS - 1) {
                // Increasing column moves right
                column++;
                moveHorizontal();
            }
        }

        // Down arrow key
        if (evt.keyCode == 40) {
            // Stay in bounds
            if(row < NUM_ROWS - 1) {
                // Increasing row moves down
                row++;
                moveVertical();
            }
        }
    });
});