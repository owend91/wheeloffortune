import express from 'express';
import WheelCtrl from './wheel.controller.js';

const router = express.Router();

router.route("/getStatus").get(WheelCtrl.apiGetStatus);
router.route("/getnewpuzzle").get(WheelCtrl.apiGetPuzzle);
router.route("/newpuzzle").post(WheelCtrl.apiPostNewPuzzle);
router.route("/resetpuzzle").post(WheelCtrl.apiPostResetPuzzle);
router.route("/updateScore").post(WheelCtrl.apiPostUpdateScore);
router.route("/guessletter").post(WheelCtrl.apiPostGuessLetter);
router.route("/guessphrase").post(WheelCtrl.apiPostGuessPhrase);
router.route("/buyvowel").post(WheelCtrl.apiPostBuyVowel);





export default router;