import React from "react";

interface GameOverProps {
  gameWon: boolean;
  finalTime: string;
}

function GameOver({ gameWon, finalTime }: GameOverProps) {
  return (
    <div className="gameOver">
      {gameWon ? (
        <div>
          <h1>CONGRATULATIONS, YOU WON!</h1>
          <h1>TIME PLAYED: {finalTime}</h1>
          <button onClick={() => window.location.reload()}>
            Click Here to Restart
          </button>
        </div>
      ) : (
        <div>
          <h1>YOU DETONATED A BOMB!</h1>
          <h1>TIME PLAYED: {finalTime}</h1>
          <button onClick={() => window.location.reload()}>
            Click Here to Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default GameOver;
