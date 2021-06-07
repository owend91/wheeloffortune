import React, {useState, useEffect} from 'react';


const GameBoard = props => {
    let [listOfGuesses, setListOfGuesses] = useState('')
   function listOfLetters(){
       console.log('listOfLetters')
       let listOfLetters = '';
       props.allLetters.sort().forEach( letter => {
            listOfLetters += letter + ', '
        })
        setListOfGuesses(listOfLetters.slice(0,listOfLetters.length-2))
   }
   
   useEffect( () => {
       listOfLetters()
   }, [props.allLetters])

    return (
        <div className="card">
            <div className="row">
                <div className="col-6 card">
                    <div className="card-header">
                        Scores
                    </div>
                    
                    <div className="card-body">
                        <h6 className="card-body">This Round</h6>
                        <ul class="list-group list-group-flush">
                            {Object.keys(props.playerPoints).map( key => {
                                return (
                                    <li class="list-group-item">Player {key}: {props.playerPoints[key]}</li>
                                )}
                            )}
                        </ul>
                        <br />
                        <h6 className="card-body">Totals</h6>
                        <ul class="list-group list-group-flush">
                            {Object.keys(props.totalPlayerPoints).map( key => {
                                return (
                                    <li class="list-group-item">Player {key}: {props.totalPlayerPoints[key]}</li>
                                )}
                            )}
                        </ul>
                    </div>
                </div>
                <div className="col-6 card">
                    <div className="card-header">
                        Letters guessed
                    </div>
                    
                    <div className="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">{listOfGuesses}</li>
                        </ul>
                    </div>
                </div>
            </div>          
        </div>
    )
}

export default GameBoard;