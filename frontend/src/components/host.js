import React from 'react';
import WheelDataService from "../services/wheel"




const Host = props => {
    function handleCategoryChange (event){
      console.log(`category: ${event.target.value}`)
       props.setCategory(event.target.value)
    }
    function handlePhraseChange (event){
        props.setPhrase(event.target.value)
     }
    function handleNumPlayerChange (event){
        props.setNumPlayers(event.target.value)
    }
    function startGame(event){
        console.log(`numPlayers: ${props.numPlayers}`)
        const players = {}
        let i = 1;
        while (i <= props.numPlayers){
            players[i] = 0
            i++;
        }
        let data = {
            category: props.category,
            phrase: props.phrase,
            numPlayers: props.numPlayers,
            players: players
        }
        WheelDataService.createGame(data)
        .then( () =>{
          props.setResetClicked(!props.apiHit);
        });
        
    }
    function resetGame(event){
      WheelDataService.resetGame();
      props.setResetClicked(!props.apiHit);
    }
    return (
        <div>
            <h1>{props.gameStarted ? 'Game Started!' : 'Enter a category and phrase!'}</h1>
            {
                props.gameStarted ? (
                    <button className='btn btn-outline-danger' onClick={resetGame}>Reset Game</button>
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
                  readOnly={props.gameStarted}
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
                  hidden={props.gameStarted}
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
              {!props.gameStarted ? (
                <button readOnly={props.gameStarted} onClick={startGame} className="btn btn-success">
                    Submit
                </button>
              ) : null}
              
            </div>
        </div>
    )
}

export default Host;