import React, { useState, useEffect } from 'react';
import {Switch, Route, Link} from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Host from './components/host'
import Players from './components/player'
import GameBoard from './components/gameBoard'

import WheelDataService from "./services/wheel"

function App() {
  const [playerPoints, setPlayerPoints] = useState({})
  const [totalPlayerPoints, setTotalPlayerPoints] = useState({})

  const [numPlayers, setNumPlayers] = useState(0)
  const [phrase, setPhrase] = useState('')
  const [category, setCategory] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [incorrectLetters, setIncorrectLetters] = useState([])
  const [allLetters, setAllLetters] = useState([])
  const [correctLetters, setCorrectLetters] = useState([])
  const [submitToServer, setSubmitToServerClicked] = useState(true)
  const [currentPlayer, setCurrentPlayer] = useState('')
  const [puzzle, setPuzzle] = useState('')
  const [winner, setWinner] = useState('')




  function populateGame() {
    
    WheelDataService.getGameStatus()
    .then( response => {
      console.log(response.data);
      setPlayerPoints(response.data.playerScores)
      setTotalPlayerPoints(response.data.totalPlayerScores)
      setGameStarted(response.data.gameStarted)
      setCorrectLetters(response.data.correctLetters)
      setIncorrectLetters(response.data.incorrectLetters)
      setAllLetters(response.data.allLetters)
      setCurrentPlayer(response.data.currentPlayer)
      // console.log(response.data)
      setPuzzle(response.data.puzzle)
      setWinner(response.data.winner)
    })
    .catch(e => {
      console.log(e);
    });
  }
  function populateCompleteGame() {
    
    WheelDataService.getGameStatus()
    .then( response => {
      // console.log('currentPlayer: ' + response.data.currentPlayer)
      console.log(response.data);
      setNumPlayers(parseInt(response.data.numPlayers));
      setPhrase(response.data.phrase)
      setCategory(response.data.category)
      setPlayerPoints(response.data.playerScores)
      setTotalPlayerPoints(response.data.totalPlayerScores)
      setGameStarted(response.data.gameStarted)
      setCorrectLetters(response.data.correctLetters)
      setIncorrectLetters(response.data.incorrectLetters)
      setAllLetters(response.data.allLetters)
      setCurrentPlayer(response.data.currentPlayer)
      setPuzzle(response.data.puzzle)
      setWinner(response.data.winner)

      // console.log(response.data)
    })
    .catch(e => {
      console.log(e);
    });
  }
  useEffect(() => {
      const interval = setInterval(() => {
        console.log('auto hook!');
        populateGame();
      }, 2000);
      return () => clearInterval(interval);
  });

  useEffect(() => {
      console.log('click hook!');
      populateCompleteGame();
  }, [submitToServer]);


  return (
    <div>
      <nav className='navbar navbar-expand navbar-dark bg-dark'>
        <a href="/home" className="navbar-brand">
            Home
         </a>
         <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/host"} className="nav-link">
              Host
            </Link>
          </li>
          { gameStarted ?
            Object.keys(playerPoints).map( key => {
              return (
                <li className="nav-item">
                  <Link to={"/player/" +key} className="nav-link">
                    Player {key}
                  </Link>
                </li>
            
              )
            } ) : null
           
          }
        </div>
      </nav>
      <div className="container mt-3">
        <Switch>
          {/* <Route exact path={["/", "/restaurants"]} component={RestaurantsList} /> */}
          <Route 
            path="/host"
            render={(props) => (
              <Host {...props} 
                gameStarted={gameStarted} 
                setPlayers={setPlayerPoints} 
                startGame={setGameStarted} 
                setCategory={setCategory}
                category={category}
                setPhrase={setPhrase}
                phrase={phrase}
                numPlayers={numPlayers}
                setNumPlayers={setNumPlayers}
                setResetClicked={setSubmitToServerClicked}
                apiHit={submitToServer}
                setTotalPlayerPoints={setTotalPlayerPoints}
              />
            )}
          />
          
          <Route 
            path="/player/:playerNum"
            render={(props) => (
              <Players {...props} 
                setPlayers={setPlayerPoints}
                category={category}
                // phrase={phrase}
                playerPoints={playerPoints}
                correctLetters={correctLetters}
                setCorrectLetters={setCorrectLetters}
                incorrectLetters={incorrectLetters}
                setIncorrectLetters={setIncorrectLetters}
                setApiHit={setSubmitToServerClicked}
                apiHit={submitToServer}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                puzzle={puzzle}
                winner={winner}
              />
            )}
          />
        </Switch>
      </div>
      <GameBoard 
        playerPoints={playerPoints}
        allLetters={allLetters}
        setApiHit={setSubmitToServerClicked}
        apiHit={submitToServer}
        totalPlayerPoints={totalPlayerPoints}
      />
      
    </div>
  );
}

export default App;
