import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

let category = "";
let phrase = "";
let numPlayers = 0;
let playerScores = {};
let correctLetters = []
let incorrectLetters = []
let allLetters = []
let gameStarted = false;
let currentPlayer = ''
let puzzle = ''
let winner = ''
let totalPlayerScores = {};
let wentFirstLastRound = '';


mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const puzzleSchema = new mongoose.Schema({
    category: String,
    puzzle: String,
  });
  const WheelPuzzle = new mongoose.model("WheelPuzzle", puzzleSchema);

export default class WheelController {


    static async apiGetPuzzle(req, res, next){
        // console.log('get puzzle')
        // puzzle = createPuzzle(correctLetters) 
        WheelPuzzle.countDocuments((err, count) => {
            var random = Math.floor(Math.random() * count)
            WheelPuzzle.findOne().skip(random).exec((err, obj) => {
                console.log(obj)
                let response= {
                    category: obj.category,
                    puzzle: obj.puzzle
                };
                res.json(response);
            })
        })   
    }

    static async apiGetStatus(req, res, next){
        console.log('get status')
        // puzzle = createPuzzle(correctLetters) 
        let response= {
            category: category,
            phrase: phrase,
            numPlayers: numPlayers,
            playerScores: playerScores,
            correctLetters: correctLetters,
            incorrectLetters: incorrectLetters,
            gameStarted: gameStarted,
            allLetters: allLetters,
            currentPlayer: currentPlayer,
            puzzle: puzzle,
            winner: winner,
            totalPlayerScores: totalPlayerScores
        };
        console.log(response)
        res.json(response);
    }

    static async apiPostNewPuzzle(req, res, next){
        console.log(req.body)
        category = req.body.category
        phrase = req.body.phrase;
        numPlayers = req.body.numPlayers;
        playerScores = req.body.players;
        totalPlayerScores = req.body.totalPlayers
        gameStarted = true;
        incorrectLetters = []
        correctLetters = []
        allLetters = []
        currentPlayer = "1"
        wentFirstLastRound = "1"
        winner = '';
        puzzle = createPuzzle(correctLetters);
        console.log(`category: ${category}   phrase: ${phrase}   numPlayers: ${req.body.numPlayers}`)
        console.log('Players: ', playerScores)
        res.json({ status: "success" });
    }

    static async apiPostNextRoundPuzzle(req, res, next){
        console.log(req.body)
        category = req.body.category
        phrase = req.body.phrase;
        playerScores = req.body.players;
        incorrectLetters = []
        correctLetters = []
        allLetters = []
        winner = '';
        puzzle = createPuzzle(correctLetters);
        console.log(`category: ${category}   phrase: ${phrase}   numPlayers: ${req.body.numPlayers}`)
        console.log('Players: ', playerScores)
        res.json({ status: "success" });
    }

    static async apiPostPrepareNextRound(req, res, next){
        console.log("next round!")
        totalPlayerScores[winner] += playerScores[winner]
        incorrectLetters = []
        correctLetters = []
        allLetters = []
        let nextPlayer = parseInt(wentFirstLastRound) +1;
        if(nextPlayer > numPlayers){
            nextPlayer = 1;
        }
        currentPlayer = '' + nextPlayer
        wentFirstLastRound = currentPlayer
        let response= {
            totalPlayerScores: totalPlayerScores
        }
        // console.log(`category: ${category}   phrase: ${phrase}   numPlayers: ${req.body.numPlayers}`)
        // console.log('Players: ', playerScores)
        res.json({ status: "success" });
    }

    static async apiPostResetGame(req, res, next){
        category = ""
        phrase = ""
        numPlayers = 0;
        playerScores = {}
        totalPlayerScores = {}
        gameStarted = false;
        incorrectLetters = []
        correctLetters = []
        allLetters = []
        currentPlayer = ""
        puzzle = ''
        winner = ''
        console.log(`category: ${category}   phrase: ${phrase}   numPlayers: ${req.body.numPlayers}`)
        console.log('Players: ', playerScores)
        res.json({ status: "success" });
    }

    static async apiPostUpdateScore(req, res, next){
        console.log('update score')
        const playerNum = req.body.playerNum
        const amount = req.body.amount;
        playerScores[playerNum] = amount
        let nextPlayer = parseInt(playerNum) +1;
        if(nextPlayer > numPlayers){
            nextPlayer = 1;
        }
        let response= {
            category: category,
            phrase: phrase,
            numPlayers: numPlayers,
            playerScores: playerScores,
            correctLetters: correctLetters,
            incorrectLetters: incorrectLetters,
            allLetters: allLetters,
            gameStarted: gameStarted,
            currentPlayer: ''+ nextPlayer,
            puzzle: puzzle,
            winner: winner
        };
        currentPlayer = ''+nextPlayer;
        res.json(response);
    }

    static async apiPostGuessLetter(req, res, next){
        const guess = req.body.guess
        const spinVal = req.body.amount
        const playerNum = req.body.playerNum
        let correct = false;
        let alreadyGuessed = false;
        let nextPlayer = playerNum;

        if(phrase.toLowerCase().includes(guess)){
            // console.log(`guess: ${guess}   correctLetters: `, correctLetters);
            if(!correctLetters.includes(guess)){
                let count = 0;
                for(const c of phrase){
                    if(c === guess){
                        count++;
                    }
                }
                correctLetters.push(guess);
                allLetters.push(guess);
                correct = true;
                let scoreThisGuess = 0;
                if(spinVal !== 'Free Play'){
                    console.log(`spin val: ${spinVal}    count: ${count}`)
                    scoreThisGuess = parseInt(spinVal) * count;
                }
                puzzle = createPuzzle(correctLetters)
                console.log(`score this guess: ${scoreThisGuess}`)
                playerScores[playerNum] += scoreThisGuess 
                console.log(`total score: ${playerScores[playerNum]}`)
             } else {
                alreadyGuessed = true;
                if(spinVal !== 'Free Play'){
                    nextPlayer++;
                    if(nextPlayer > numPlayers){
                        nextPlayer = 1;
                    }
                }
             }
        } else {
            if(!incorrectLetters.includes(guess)){
                incorrectLetters.push(guess);
                allLetters.push(guess);
            } else {
                alreadyGuessed = true;
            } 
            if(spinVal !== 'Free Play'){
                nextPlayer++;
                if(nextPlayer > numPlayers){
                    nextPlayer = 1;
                } 
            }
        }
        let response= {
            correctGuess: correct,
            alreadyGuessed: alreadyGuessed,
            correctLetters: correctLetters,
            incorrectLetters: incorrectLetters,
            playerScores: playerScores,
            currentPlayer: ''+nextPlayer,
            puzzle: puzzle,
            winner: winner
            
        };
        currentPlayer = ''+nextPlayer;
        console.log(response)
        console.log('nextPlayer: ' +nextPlayer)
        res.json(response);
    }


    static async apiPostBuyVowel(req, res, next){
        const vowel = req.body.vowel
        const playerNum = req.body.playerNum
        let correct = false;
        const alreadyGuessed = false;
        let nextPlayer = playerNum;

        if(phrase.toLowerCase().includes(vowel)){
            if(!correctLetters.includes(vowel)){
                correctLetters.push(vowel);
                allLetters.push(vowel);
                correct = true;
                playerScores[playerNum] -= 250 
                console.log(`total score: ${playerScores[playerNum]}`)
                puzzle = createPuzzle(correctLetters)
             } else {
                alreadyGuessed = true;
                nextPlayer++;
                if(nextPlayer > numPlayers){
                    nextPlayer = 1;
                }
             }
        } else {
            if(!incorrectLetters.includes(vowel)){
                incorrectLetters.push(vowel);
                allLetters.push(vowel);
            } else {
                alreadyGuessed = true;
            } 
            nextPlayer++;
            if(nextPlayer > numPlayers){
                nextPlayer = 1;
            } 
        }
        let response= {
            correctGuess: correct,
            alreadyGuessed: alreadyGuessed,
            correctLetters: correctLetters,
            incorrectLetters: incorrectLetters,
            playerScores: playerScores,
            currentPlayer: ''+nextPlayer,
            puzzle: puzzle,
            winner: winner
        };
        currentPlayer = ''+nextPlayer;
        console.log(response)
        console.log('nextPlayer: ' +nextPlayer)
        res.json(response);
    }

    static async apiPostGuessPhrase(req, res, next){
        const guess = req.body.guess
        const playerNum = req.body.playerNum
        let correct = false;
        let nextPlayer = playerNum;
        if(guess.toLowerCase() === phrase.toLowerCase()){
            correct = true;
            puzzle = phrase;
            winner = playerNum;
        } else {
            nextPlayer++;
            if(nextPlayer > numPlayers){
                nextPlayer = 1;
            } 
        }
        console.log('winner: ' + winner)
        currentPlayer = ''+nextPlayer;
        let response= {
            correctGuess: correct,
            winner: winner,
            currentPlayer: currentPlayer
        };
        res.json(response);
    }

}

function createPuzzle(correctLetters) {
    let puzzle = '';
    for(const c of phrase){
        if(correctLetters.includes(c.toLowerCase()) || c === '-' || c === '&' || c === '\''){
            puzzle += c
        } else if(c === ' ') {
            console.log('space')
            puzzle += '   '
        } else {
            puzzle += '_ '
        }
    }
    return puzzle
}