import React, { useState, useEffect } from 'react'

const TicTacToe = () => {
  const [board, setBoard] = useState(
      [
          [null, null, null],
          [null, null, null],
          [null, null, null]
      ]
  );

  const [userStarts, setUserStarts] = useState(true);
  const [player, setPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [isTie, setIsTie] = useState(false);

  useEffect(() => {
      if (player === 'O' && !gameOver) {
        console.log("ai");
        makeAIMove();
      }
    }, [player, board]);

  const handleClick = (rowIndex, cellIndex) => {
      if (board[rowIndex][cellIndex] === null && !gameOver) {
        const newBoard = board.map((row, rIndex) => {
            if (rIndex === rowIndex) {
            return row.map((cell, cIndex) => {
              return cIndex === cellIndex ? player : cell;
            });
            }
            return row;
      });

      
      setBoard(newBoard);
      
      if (checkGameStatus(newBoard, player)) {
        setGameOver(true);
      } else if (isBoardFull(newBoard)) {
        setGameOver(true);
        setIsTie(true);
      } else {
        setPlayer(player === 'X' ? 'O' : 'X');
      }
    }
  };

  const checkGameStatus = (board) => {
    const directions = [
      // rzedy
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      // kolumny
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      // skosy
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];
  
    for (const direction of directions) {
      const [a, b, c] = direction.map(([row, col]) => board[row][col]);
      

      if (a !== null && a === b && a === c) {
        return a === 'X' ? 10 : -10;
      }
    }

    return 0;
  };

  const isBoardFull = (board) => {
    return board.every((row) => row.every((cell) => cell !== null));
  };

  const minmax = (isMaximizing, board) => {
    const result = checkGameStatus(board);

    if (result !== 0) return result;
    if (isBoardFull(board)) return 0;

    const human = 'X';
    const computer = 'O';

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j] === null) {
            board[i][j] = computer;
            const score = minmax(false, board);
            bestScore = Math.max(score, bestScore);
            board[i][j] = null;
          }
        }
      }

      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j] === null) {
            board[i][j] = human;
            const score = minmax(true, board);
            bestScore = Math.min(score, bestScore);
            board[i][j] = null;
          }
        }
      }

      return bestScore;
    }
  };
      
        
  const makeAIMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === null) {
          board[i][j] = player;
          const score = minmax(false, board);
          board[i][j] = null;
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }

    if (move) handleClick(move.i, move.j);
  };

  const resetGame = () => {
    setBoard([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ])
    setGameOver(false);
    setIsTie(false);
    setPlayer(userStarts ? "X" : "O");
    setUserStarts(userStarts);
  }

  return (
    <div className="xo">
      <h1>Reversed Tic Tac Toe</h1>
      <div className="buttons">
        <h4>pick who starts</h4>
        <button
          className={`${userStarts && 'active'}`}
          onClick={() => {
            setUserStarts(true);
            setBoard([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ])
            setGameOver(false);
            setPlayer("X");
            setIsTie(false);
          }}
        >
          Human
        </button>
        <button
          className={`${!userStarts && 'active'}`}
          onClick={() => {
            setUserStarts(false);
            setBoard([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ])
            setGameOver(false);
            setIsTie(false);
            setPlayer("O");

          }}
        >
          AI
        </button>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <>
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="square"
                onClick={() => handleClick(rowIndex, cellIndex)}
              >
                {cell}
              </div>
            ))}
          </>
        ))}
      </div>
      <div className="logs">
        {gameOver && 
            <>
                {!isTie ? <div>{`${player} lost`}</div> : <div>Tie!</div>}
                <div><button onClick={() => resetGame()}>reset game</button></div> 
            </>
        }
      </div>
    </div>
  );
}

export default TicTacToe