const Gameboard = (() => {
    
    let board = [];
    
    for ( i = 0; i < 3; i++ ) {
        board[i] = [];
        for ( j = 0; j < 3; j++ ) {
            board[i].push('');
        }
    }
    
    const getBoard = () => board;
    const placeMark = (row, col, mark) => {
        board[row][col] = mark;
    };

    const getCell = (row, col) => board[row][col];

    const resetBoard = () => {
        for (row in board){
            for (cell in board[row]){
                board[row][cell] = '';
            };
        };
    };

    return {
        getBoard,
        placeMark,
        getCell,
        resetBoard
    };

});

const GameController = (() => {
    const board = Gameboard();

    const players = [
        {
            name: 'Player One',
            token: 'X',
            wins: 0
        },
        {
            name: 'Player Two',
            token: 'O',
            wins: 0
        }
    ];

    const getPlayers = () => players

    let startingPlayer = players[0];
    let currentPlayer = startingPlayer;

    const changePlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const getCurrentPlayer = () => currentPlayer;

    const updatePlayerNames = (player, name) => {
        players[player].name = name;
    }

    const checkWins = () => {
        let wins = false;
        let winningToken;
        const checkRows = (() => {
            for(row in board.getBoard()){
                if(
                    board.getCell(row, 0) === board.getCell(row, 1) && 
                    board.getCell(row, 0) === board.getCell(row, 2) &&
                    board.getCell(row, 0) !== ''
                ){
                    wins =  true;
                    winningToken = board.getCell(row, 0);
                    return;
                }
            }
        })();

        if (wins) return {wins, winningToken};
        
        const checkCols = (() => {
            for (let col = 0; col < 3; col++){
                if(
                    board.getCell(0, col) === board.getCell(1, col) &&
                    board.getCell(0, col) === board.getCell(2, col) &&
                    board.getCell(0, col) !== ''
                ){
                    wins =  true;
                    winningToken = board.getCell(0, col);
                    return;
                }
            }
        })();
        
        if (wins) return {wins, winningToken};

        const checkDiags = (() => {
            if ((
                board.getCell(0, 0) === board.getCell(1, 1) &&
                board.getCell(0, 0) === board.getCell(2, 2) &&
                board.getCell(0, 0) !== ''
            ) || (
                board.getCell(0, 2) === board.getCell(1, 1) &&
                board.getCell(0, 2) === board.getCell(2, 0) &&
                board.getCell(0, 2) !== ''
            )){
                wins =  true;
                winningToken = board.getCell(1, 1);
                return;
            }
        })();

        return {
            wins,
            winningToken
        };
        
    }

    const checkDraw = () => {
        for(row = 0; row < 3; row++){
            for(col = 0; col < 3; col++){
                if(board.getCell(row, col) === ''){
                    return false;
                }
            }
        }
        return true;
  
    }

    const restartGame = () => {
        startingPlayer = startingPlayer === players[0] ? players[1] : players[0];
        currentPlayer = startingPlayer;
        board.resetBoard();
        gameOver = false;
    }

    let gameOver = false;

    const getGameOver = () => gameOver;

    let gameDraw = false;

    const getDraw = () => gameDraw;

    let winningPlayer;

    const getWinningPlayer = () => winningPlayer;

    const takeTurn = (row, col) => {
        if (!gameOver && board.getCell(row,col) === '') {
            board.placeMark(row, col, currentPlayer.token);
            const gameResult = checkWins();
            gameDraw = checkDraw();
            if(gameResult.wins){
                winningPlayer = currentPlayer;
                winningPlayer.wins++
                gameOver = true;
            } else {
                if(gameDraw){
                    gameOver = true;
                }else{
                    changePlayer();
                };
            }
        }
    }

    return {
        takeTurn,
        restartGame,
        updatePlayerNames,
        getCurrentPlayer,
        getDraw,
        getGameOver,
        getWinningPlayer,
        getPlayers,
        board
    }

});

const GameDisplay = (() => {
    const controller = GameController();

    const gameBoardDisplay = document.querySelector('#gameboard');

    const reStartButton = document.querySelector('#restart-button');

    const statusDisplay = document.querySelector('#status-display');

    const playerOneInfo = document.querySelector('#player-one-info');
    const playerTwoInfo = document.querySelector('#player-two-info');

    const playerOneNameBox = document.querySelector('#player-one-name');
    const playerTwoNameBox = document.querySelector('#player-two-name');

    playerOneNameBox.textContent = '';
    playerTwoNameBox.textContent = '';

    playerOneNameBox.addEventListener('input', (e) => {
        if(e.target.value !== ''){
            controller.updatePlayerNames(0, e.target.value);
            updateStatus();
        }else{
            controller.updatePlayerNames(0, 'Player One');
            updateStatus();
        }
    })
    
    playerTwoNameBox.addEventListener('input', (e) => {
        if(e.target.value !== ''){
            controller.updatePlayerNames(1, e.target.value);
            updateStatus();
        }else{
            controller.updatePlayerNames(1, 'Player Two');
            updateStatus();
        }
    })

    const updatePlayerInfo = () => {
        playerOneInfo.textContent = `Token: ${controller.getPlayers()[0].token} Wins: ${controller.getPlayers()[0].wins}`
        playerTwoInfo.textContent = `Token: ${controller.getPlayers()[1].token} Wins: ${controller.getPlayers()[1].wins}`
    }

    reStartButton.addEventListener('click', () => {
        controller.restartGame();
        updateBoard();
    })

    const updateStatus = () => {
        if(!controller.getGameOver()){
            statusDisplay.textContent = `Current Player: ${controller.getCurrentPlayer().name}`
        } else {
            if(controller.getDraw()){
                statusDisplay.textContent = `The game is a draw, try again.`;
            }else{
                statusDisplay.textContent = `Game over, ${controller.getWinningPlayer().name} wins!`
            }
        }
    }

    const updateBoard = () => {
        const boardData = controller.board.getBoard();
        gameBoardDisplay.innerHTML = '';
        for(let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col ++){
                let newCell = document.createElement('button');
                newCell.className = 'square';
                newCell.textContent = controller.board.getCell(row, col);
                newCell.dataset.row = row;
                newCell.dataset.col = col;
                gameBoardDisplay.appendChild(newCell);
                newCell.addEventListener('click', (e) => {
                    if (!controller.gameOver) {
                        const row = e.target.dataset.row;
                        const col = e.target.dataset.col;
                        controller.takeTurn(row,col);
                        updateBoard();
                    }
                })
                setTimeout(() => {
                    newCell.addEventListener('mouseover', (e) => {
                    if(newCell.textContent === '' && !controller.getGameOver()){
                        const originalContent = newCell.textContent;
                        newCell.textContent = controller.getCurrentPlayer().token;

                        newCell.addEventListener('mouseout', () => {
                            newCell.textContent = originalContent;
                        })
                    }  
                    })
                }, 10);

    
            }
        }
        updateStatus();
        updatePlayerInfo();
    }

    playerOneNameBox.value = '';
    playerTwoNameBox.value = '';
    updateBoard();
})();
