import React, { useState} from 'react';
import Actions from '../helpers/actions';
import WheelDataService from "../services/wheel";




const Player = props => {
    const playerNum = props.match.params.playerNum;
    const [letter, setLetter] = useState('')
    const [vowel, setVowel] = useState('')
    const [phraseGuess, setPhraseGuess] = useState('')
    const [spinValue, setSpinValue] = useState('');
    const [spinLabel, setSpinLabel] = useState('');
    const vowels = ['a','e','i','o','u']

    function handleVowelChange(event){
        setVowel(event.target.value)
    }
    function handleLetterChange(event){
        setLetter(event.target.value)
    }
    function buyVowel() {
        const guess = vowel.toLowerCase();
        console.log('buy vowel: ', guess)

        if(!vowels.includes(guess)){
            setSpinLabel("You tried to buy a consenant.  You must guess for it!")
            return;
        }

        if(props.playerPoints[playerNum] < 250){
            setSpinLabel("You don't have enough to buy a vowel!")
            return;
        }
        const data = {
            playerNum: playerNum,
            vowel: guess
        }

        WheelDataService.buyVowel(data)
        .then (response => {
            if(response.data.alreadyGuessed){
                setSpinLabel("Letter already bought")
            } else {
                if(response.data.correctGuess){
                    setSpinLabel("Yup!")
                } else {
                    setSpinLabel("Nope!")
                }
                props.setPlayers(response.data.playerScores)
            }
            if(response.data.playerScores)
            props.setApiHit(!props.apiHit)
            setVowel('');
            setSpinValue('');
            props.setCurrentPlayer(response.data.currentPlayer)
        })
        setVowel('');


    }
    function guessLetter() {
        const guess = letter.toLowerCase();
        const data = {
            playerNum: playerNum,
            guess: guess,
            amount: spinValue
        }
        if(vowels.includes(guess)){
            setSpinLabel("You tried to guess a vowel.  You must buy it!  Your spin was " + spinValue)
            setVowel('');
            return;
        }
        WheelDataService.guessLetter(data)
        .then( response => {
            if(response.data.alreadyGuessed){
                setSpinLabel("Letter already guessed")
            } else {
                if(response.data.correctGuess){
                    setSpinLabel("Correct")
                } else {
                    setSpinLabel("Incorrect")
                }
                props.setPlayers(response.data.playerScores)
            }
            if(response.data.playerScores)
            props.setApiHit(!props.apiHit)
            setLetter('');
            setSpinValue('');
            props.setCurrentPlayer(response.data.currentPlayer)
        });
    }
    function handlePhraseChange(event){
        setPhraseGuess(event.target.value)
    }
    function guessPhrase() {
        const guess = phraseGuess.toLowerCase();
        const data = {
            guess: guess,
            playerNum: playerNum
        }
        WheelDataService.guessPhrase(data)
        .then( response => {
            if(response.data.correctGuess){
                setSpinLabel('Correct.  You Win!')
            } else {
                setSpinLabel('Incorrect.')
            }
        });
        setPhraseGuess('')
    }
    function spinWheel(){
        const spinVal = Actions.spinWheel();
        if(spinVal === 'Bankrupt') {
            console.log('Bankrupt!')
            const data = {
                playerNum: playerNum,
                amount: 0
            }
            WheelDataService.updateScore(data)
            .then(response => {
                props.setPlayers(response.data.playerScores)
                props.setApiHit(!props.apiHit)
                props.setCurrentPlayer(response.data.currentPlayer)
            });
        } else if (spinVal === 'Lose a Turn'){
            console.log('Lose a Turn')
            const data = {
                playerNum: playerNum,
                amount: props.playerPoints[playerNum]
            }
            WheelDataService.updateScore(data)
            .then(response => {
                props.setPlayers(response.data.playerScores)
                props.setApiHit(!props.apiHit)
                props.setCurrentPlayer(response.data.currentPlayer)
            });
        }
        setSpinValue(spinVal);
        setSpinLabel(spinVal);
    }
    return (
        <div className='card'>
            <div className='card-header'>
                {props.category}
            </div>
            <div className="card">
            {
                props.winner === '' ? (
                    <h4 className='card-title' style={{textAlign:'center'}}>Player {props.currentPlayer} Turn</h4>
                ) : (
                    <h4 className='card-title' style={{textAlign:'center'}}>Player {props.winner} Wins!</h4>
                )
            }
            </div>
            <div className='card-body'>
                <h4 className='card-title' style={{textAlign:'center'}}><span style={{whiteSpace:'pre'}}>{props.puzzle}</span></h4>
                <div className="row pt-4 pb-2">
                    <div className='card col-12' style={{textAlign:'center'}}>
                        <h6>{spinLabel}</h6>
                        <button disabled={props.currentPlayer !== playerNum} className='btn btn-outline-success pb-1' onClick={spinWheel}>Spin Wheel</button>
                    </div>
                </div>
                <div className='row'>
                    <div className='card col-4'>
                        <h5 className='card-title' style={{textAlign:'center'}}>Guess a Letter</h5>
                        <div className='form-group pb-1' style={{textAlign:'center'}}>
                            <input
                                type="text"
                                className="form-control pb-1"
                                id="letter"
                                required
                                value={letter}
                                onChange={handleLetterChange}
                                name="letter"
                                placeholder="Letter"
                                maxLength='1'
                                />
                            <button disabled={props.currentPlayer !== playerNum || spinValue === ''} className='btn btn-outline-primary pt-1' onClick={guessLetter}>Guess!</button>
                        </div>
                    </div>
                    <div className='card col-4'>
                        <h5 className='card-title' style={{textAlign:'center'}}>Buy a vowel</h5>
                        <div className='form-group pb-1' style={{textAlign:'center'}}>
                            <input
                                type="text"
                                className="form-control pb-1"
                                id="vowel"
                                required
                                value={vowel}
                                onChange={handleVowelChange}
                                name="vowel"
                                placeholder="Vowel"
                                maxLength='1'
                                />
                            <button disabled={props.currentPlayer !== playerNum} className='btn btn-outline-primary pt-1' onClick={buyVowel}>Buy!</button>
                        </div>
                    </div>
                    <div className='card col-4'>
                        <h5 className='card-title' style={{textAlign:'center'}}>Solve the puzzle</h5>
                        <div className='form-group pb-1' style={{textAlign:'center'}}>
                            <input
                                type="text"
                                className="form-control pb-1"
                                id="phrase"
                                required
                                value={phraseGuess}
                                onChange={handlePhraseChange}
                                name="phrase"
                                placeholder="Phrase"
                                />
                            <button disabled={props.currentPlayer !== playerNum} className='btn btn-outline-primary pt-1' onClick={guessPhrase}>Solve!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player;