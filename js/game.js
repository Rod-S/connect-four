$(() => {
    //define player 1 and player 2 arrays that will hold selected moves, respectively
    let p1box = [];
    let p2box = [];

    //convert all li box elements into a single array
    let boxes = $('.box').toArray();

    //RNG
    let getRandomNumber = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    //show current player's game piece image overlay
    function mouseInEffect(e) {
        if ($(this).hasClass('box-filled')) {return}
        if ($('#player1').is('.active')) {
            $(this).css("background-image", "url(img/o.svg)");
        } else if ($('#player2').is('.active')) {
            $(this).css("background-image", "url(img/x.svg)");
        }
    }

    //remove current player's game piece image overlay
    function mouseOutEffect(e) {
        if ($(this).hasClass('box-filled')) {return}
        if ($('#player1').is('.active')) {
            $(this).css("background-image", '');
        } else if ($('#player2').is('.active')) {
            $(this).css("background-image", '');
        }
    }

    //game board visual hover behavior
    $('.box').hover(mouseInEffect, mouseOutEffect);

    //start screen with options
    const startScreen = () => {
        let player_1;
        let player_2;
        $('#start').show();
        $('#board').hide();
        $('#finish').hide();
    }

//Close start screen and begin the game on player 1's turn
    const playerSetup = () => {
        window.player_1 = player_1;
        window.player_2 = player_2;
        $('#start').hide();
        $('#board').show();
        //append names to board
        $('.names').remove();
        $('#player1').addClass('active').append('<h3 class=names>' + player_1 + '</h2>');
        $('#player2').removeClass('active').append('<h3 class=names>' + player_2 + '</h2>');
    }

    //check if p1box or p2box contains a winning row/column/diagonal combination defined in winCombos.
    const winCheck = (winCombos, pArray) => {
        for (var i=0; i < winCombos.length; i++) {
            if(winCombos[i].every(value => pArray.indexOf(value) !== -1)) return true
        }
        return false
    };

    //REFACTOR THESE 3 into 1 function
    // const setScreen(outcome) {
    //   var cVal = '';
    //   var tVal = '';
    //   // check for value of argument
    //     // set the values of cVal and tVal
    //     //
    //   $('#finish').addClass(cVal).show();
    //   $('p.message').text(tVal);
    // }

    //Player 1 win screen
    const winOneScreen = () => {
        $('#finish').addClass('screen-win-one').show();
        $('p.message').text(`WINNER ${player_1}!`);
    };

    //player 2 win screen
    const winTwoScreen = () => {
        $('#finish').addClass("screen-win-two").show();
        $('p.message').text(`WINNER ${player_2}!`);
    };

    //tie game win screen
    const tieScreen = () => {
        $('#finish').addClass('screen-win-tie').show();
        $('p.message').text(`IT'S A TIE!`);
    };

    const winCheckScreen = () => {
        //check if p1box array contains any of the winning combinations, if so:
        if (winCheck(winCombos, p1box)) {
            winOneScreen();
            //check if p2box array contains any of the winning combinations, if so:
        } else if (winCheck(winCombos, p2box)) {
            winTwoScreen();
            //check if all boxes have been played, if no winning combinations (p1box due to p1 having last playable move):
        } else if (($('.box-filled').length === 9) && (!winCheck(winCombos, p1box))) {
            tieScreen();
        }
    }

    const player1Move = (e) => {
        if ($('#player1').is('.active')) {
            //find 'this' index within boxes array
            let thisToBoxesIndex = boxes.indexOf(e.target);
            //add box's 2nd class name to p1box array
            p1box.push($(e.target).attr('class').split(' ')[1]);
            //visually change box for player 1 chosen move and disable
            $(e.target).toggleClass('box-filled box-filled-1').attr('disabled', true);
            //once move is used, remove from boxes array
            boxes.splice(thisToBoxesIndex, 1);
            console.log(boxes);
            //player 1 turn ends, computer turn begins
            $('#player1').toggleClass('active');
            $('#player2').toggleClass('active');
            computerMove();
        }
    }

    const player2Move = (e) => {
        if ($('#player2').is('.active')){
            //add box's 2nd class name to p2box array
            p2box.push($(e.target).attr('class').split(' ')[1]);
            //visually change box for player 2 chosen move and disable
            $(e.target).toggleClass('box-filled box-filled-2').attr('disabled', true);
            //player 2 turn ends, player 1 begins
            $('#player1').toggleClass('active');
            $('#player2').toggleClass('active');
        }
    }

//computer will select an unused box from available moves in boxes array
    let randomizedMove = (array) => {
        let index = getRandomNumber(array.length);
        p2box.push($(array[index]).attr('class').split(' ')[1]);
        $(array[index]).addClass('box-filled box-filled-2');
        $(array[index]).attr('disabled', true);
        //once move is used, remove from boxes array
        array.splice(index, 1);
    }

    const computerMove = () => {
        //if empty boxes are currently in play:
        if (boxes.length !== 0) {
            //run computer's move
            randomizedMove(boxes);
            //computer turn ends, player 1 turn begins
            $('#player2').toggleClass('active');
            $('#player1').toggleClass('active');
        }
    }

    //start game button handler
    $('#startButton').on('click', function () {
        //replace start game button with 1-player and 2-player button options
        $('#startButton').after('<a href="#" class="button" id="start1">1-Player</a>');
        $('#start1').after('<a href="#" class="button" id="start2">2-Player</a>');
        $('#startButton').hide();
    })

    //new game button board wipe handler
    $('.newButton').on('click', function() {
        // p1box = [];
        // p2box = [];
        // boxes = $('.box').toArray();
        // $('#board').hide();
        // $('#finish').removeClass('screen-win-one screen-win-two screen-win-tie');
        // $('li').removeClass(['box-filled', 'box-filled-1', 'box-filled-2']).css('background-image', 'none');
        // startScreen();

        //TEMPORARY FIX, NEW GAME BREAKS FUNCTIONALITY (need to fully reset game values
        window.location.reload();
    });

    //1-player button handler
    $("body").on('click', "#start1", function(){
        //enter player 1 name
        player_1 = prompt('Please enter a name for player 1', 'Player 1');
        player_2 = 'Computer';
        playerSetup();
        pveGame();
    });

    //2-player button handler
    $('body').on('click', '#start2', function (){
        //enter names for player 1 and player 2
        player_1 = prompt('Please enter a name for player 1', 'Player 1');
        player_2 = prompt('Please enter a name for player 2', 'Player 2');
        playerSetup();
        pvpGame();
    });

    //1-player game functionality (box click handler)
    const pveGame = () => {
        $('.box').on('click', function(e) {
            //do nothing if box is already in play and claimed
            if ($(this).hasClass('box-filled')) return
            //run specific game logic depending on which player's turn it is
            $('#player1').is('.active') ? player1Move(e) : null
            winCheckScreen();
        })
    }

    //2-player game functionality (box click handler)
    const pvpGame = () => {
        $('.box').on('click', function (e) {
            if ($(this).hasClass('box-filled')) return
            $('#player1').is('.active') ? player1Move(e) : player2Move(e);
            winCheckScreen();
        })
    }


    startScreen();
    $('#board').hide();
    $('#finish').hide();


})