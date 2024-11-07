import { useState } from 'react';
import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './components/winning-combinations.js';

const PLAYERS = {
    'X' : 'Player1',
    'O' : 'Player2'
};
const initialGameBoard = [
  [null,null,null],
  [null,null,null],
  [null,null,null]
];

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if(gameTurns.length>0 && gameTurns[0].player==='X'){
    currentPlayer='O';
  }
  return currentPlayer;
}
function deriveGameBoard(gameTurns){
  let gameboard = [...initialGameBoard.map(array=>[...array])];

    for(const turn of gameTurns){
        const{square,player} = turn;
        const{row,col} = square;

        gameboard[row][col] = player;
    }

    return gameboard;

}
function deriveWinner(gameboard,player){
  let winner;
  for(const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameboard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameboard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameboard[combination[2].row][combination[2].column];

    if(
      firstSquareSymbol && 
      firstSquareSymbol===secondSquareSymbol && 
      firstSquareSymbol===thirdSquareSymbol){
      winner=player[firstSquareSymbol];
    }
  
  }
  return winner;
  
}
function App() {
  const [gameTurns,setGameTurns]=useState([]);
  const [player,setPlayerName] = useState(PLAYERS);
  // const[activePlayer,setActivePlayer] = useState();
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameboard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameboard,player); 
  const hasDraw = gameTurns.length===9 && !winner;
  function handleRestart(){
    setGameTurns([]);
  }

  function handleSelectSquare(rowIndex,colIndex){
    //setActivePlayer((currActive)=>currActive==='X'?'O':'X');
    setGameTurns((prevTurns)=>{
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [{square:{row:rowIndex,col:colIndex},player:currentPlayer},...prevTurns];
    return updatedTurns;
    });
  }
  function handlePlayerNameChange(symbol,newName){
    setPlayerName(prevPlayer =>{
      return{
        ...prevPlayer,
        [symbol]:newName
      };
    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className='highlight-player'>
          <Player initialPlayerName= {PLAYERS.X} symbol='X' isActive={activePlayer==='X'} onChangeName={handlePlayerNameChange}/>
          <Player initialPlayerName={PLAYERS.O} symbol='O' isActive={activePlayer==='O'}onChangeName={handlePlayerNameChange}/>
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameboard}/>
      </div>
     <Log turns={gameTurns}/>
    </main>
  );
}

export default App
