import React, {useState} from 'react';

import WheelDataService from "../services/wheel"




const Host = props => {

    const [nextRound, setNextRound] = useState(false)

    function handleCategoryChange (event){
       props.setCategory(event.target.value)
    }
    function handlePhraseChange (event){
        props.setPhrase(event.target.value)
     }
    function handleNumPlayerChange (event){
        props.setNumPlayers(event.target.value)
    }
    function startGame(event){
        const players = {}
        const totalPlayers = {}
        let i = 1;
        while (i <= props.numPlayers){
            players[i] = 0
            totalPlayers[i] = 0
            i++;
        }
        let data = {
            category: props.category,
            phrase: props.phrase,
            numPlayers: props.numPlayers,
            players: players,
            totalPlayers: totalPlayers

        }
        if(nextRound){
          WheelDataService.nextRoundPuzzle(data)
          .then( (response) =>{
            // props.setPhrase(phrase)
            props.setResetClicked(!props.apiHit);
            props.setTotalPlayerPoints(response.data.setTotalPlayerScores)
            setNextRound(false)
          });
        } else {
          WheelDataService.createGame(data)
          .then( () =>{
            // props.setPhrase(phrase)
            props.setResetClicked(!props.apiHit);
          });
        }
        
    }
    function generatePuzzle(event){
      const players = {}
      const totalPlayers = {}
      let i = 1;
      while (i <= props.numPlayers){
          players[i] = 0
          totalPlayers[i] = 0
          i++;
      }
      WheelDataService.getPuzzle()
      .then( (response) => {
        const category = response.data.category
        const phrase = response.data.puzzle
        // props.setCategory(category)
        
        let data = {
          category: category,
          phrase: phrase,
          numPlayers: props.numPlayers,
          players: players,
          totalPlayers: totalPlayers
        }
        if(nextRound){
          WheelDataService.nextRoundPuzzle(data)
          .then( () =>{
            // props.setPhrase(phrase)
            props.setResetClicked(!props.apiHit);
            setNextRound(false)
          });
        } else {
          WheelDataService.createGame(data)
          .then( () =>{
            // props.setPhrase(phrase)
            props.setResetClicked(!props.apiHit);
          });
        }
        
      });
      
  }
    function resetGame(event){
      WheelDataService.resetGame();
      props.setResetClicked(!props.apiHit);
    }
    function nextRoundClick(event){
      WheelDataService.prepareNextRound()
      .then( () =>{
        setNextRound(true)
        props.setCategory('');
        props.setPhrase('');
      });


    }
    return (
        <div>
            <h1>{props.gameStarted ? 'Game Started!' : 'Enter a category and phrase or generate a random puzzle!'}</h1>
            {
                props.gameStarted ? (
                  <div>
                    <button className='btn btn-outline-success' onClick={nextRoundClick}>Next Round</button>
                    <button className='btn btn-outline-danger' onClick={resetGame}>Reset Game</button>

                  </div>
                ) : null
            }
            <div>
              <div className="form-group">
                <label htmlFor="category">Category: </label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  required
                  value={props.category}
                  onChange={handleCategoryChange}
                  name="category"
                  placeholder="Category"
                  readOnly={props.gameStarted && !nextRound}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phrase">Phrase: </label>
                <input
                  type="text"
                  className="form-control"
                  id="phrase"
                  required
                  value={props.phrase}
                  onChange={handlePhraseChange}
                  name="phrase"
                  placeholder="Phrase"
                  hidden={props.gameStarted && !nextRound}
                />
              </div>
              <div className="form-group pb-1">
                <label htmlFor="numPlayer">Number of Players: </label>
                <input
                  type="text"
                  className="form-control"
                  id="numPlayer"
                  required
                  value={props.numPlayers}
                  onChange={handleNumPlayerChange}
                  name="numPlayer"
                  placeholder="Number of Players"
                  readOnly={props.gameStarted}
                />
              </div>
              {!props.gameStarted || nextRound ? (
                <div className='row pb-1'>
                  <div className='col-2'>
                    <button readOnly={props.gameStarted && !nextRound} onClick={startGame} className="btn btn-success">
                        Create Custom Game
                    </button>
                  </div>
                  <div className='col-2'>
                    <button readOnly={props.gameStarted && !nextRound} onClick={generatePuzzle} className="btn btn-warning">
                      Generate Puzzle
                    </button>
                  </div>
                </div>
              ) : null}
              
              
            </div>
        </div>
    )
}

export default Host;