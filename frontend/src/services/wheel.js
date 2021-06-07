import http from "../http-common"


class WheelDataService {
    createGame(data){
        return http.post(`/newpuzzle`, data)
    }
    
    getPuzzle(data){
        return http.get(`/getnewpuzzle`)
    }

    prepareNextRound(){
        return http.post(`/preparenextround`)
    }

    nextRoundPuzzle(data){
        return http.post(`/nextroundpuzzle`, data)
    }

    resetGame(){
        return http.post(`/resetgame`)
    }

    updateScore(data) {
        return http.post(`/updatescore`, data)
    }

    guessLetter(data){
        return http.post(`/guessLetter`, data)
    }

    buyVowel(data){
        return http.post(`/buyVowel`, data)
    }

    getGameStatus(){
        return http.get(`/getStatus`)
    }

    guessPhrase(data){
        return http.post(`/guessphrase`, data)
    }
}

export default new WheelDataService();