const readline = require('readline');
const colors = require("colors");

/********************************* CONSTANTS *********************************/
const VALID_MOVES = {
  r: {
    name: 'Rock',
    winsAgainst: 's'
  },
  p: {
    name: 'Paper',
    winsAgainst: 'r'
  },
  s: {
    name: 'Scissors',
    winsAgainst: 'p'
  }
};

/********************************* GAME DATA *********************************/
let wins = 0;
let losses = 0;
let ties = 0;
let limit = 0;
let highScore = 0;
let endGame = false;
let matchesWon = 0;
let matchesLost = 0;
let totalMatches = 0;
let overallSuccess = 0;

/* DO NOT CHANGE THE CODE ABOVE */

/***************************** HELPER FUNCTIONS ******************************/
function printHelp() {
  // Your code here
  console.log("  Type 'r' for Rock 💎");
  console.log("  Type 'p' for Paper 📜");
  console.log("  Type 's' for Scissors ✂");
  console.log("  Type 'q' to quit");
  console.log("  Type 'h' for a list of valid commands\n");


}

function getWinner(move1, move2) {
  // Your code here
  switch (true) {
    case (move1 === move2) :
      return 0;
    case (VALID_MOVES[move1].winsAgainst === move2) :
      return 1;
    default:
      return -1;
  }
}

function displayChoice(cmd, cpu) {
  let letterArr = ["r", "p", "s"];
  let arr = ['"rock" 💎', '"paper" 📜', '"scissors" ✂'];
  let cmdMove;
  let cpuMove;
  let index;

  if (letterArr.includes(cmd)) {
    index = letterArr.indexOf(cmd);
    cmdMove = arr[index];
  }
  if (letterArr.includes(cpu)) {
    index = letterArr.indexOf(cpu);
    cpuMove = arr[index];
  }

  console.log(`You pick ${cmdMove}, computer picks ${cpuMove}.`);
}

function getCPUMove() {
  // Your code here
    const validMoveKeys = Object.keys(VALID_MOVES);
    const randomIndex = Math.floor(Math.random() * validMoveKeys.length);
    cpu = validMoveKeys[randomIndex];

    return cpu;
}

function processMove(cmd, cpu) {
  // Your code here
  console.clear();
  displayChoice(cmd, cpu);
  //console.log(`You pick ${cmd}, computer picks ${cpu}.`);
//using colors in the strings fails the tests 😥
//  console.log(`${colors.blue("You")} pick ${colors.green(cmd)}, ${colors.blue("computer")} picks ${colors.green(cpu)}.`);
  switch (true) {
    case (getWinner(cmd, cpu) === 0) :
      console.log(`You ${colors.yellow("tie")}.
        `);
      ties++;
      break;

    case (getWinner(cmd, cpu) === 1) :
      console.log(`You ${colors.green("win")}.
        `);
      wins++;
      break;

    default:
      console.log(`You ${colors.red("lose")}.
        `);
      losses++;
  }

   return;
}

function getHighScore(wins, losses) {
  if (wins > losses) {
    highScore = wins;
  } else if (losses > wins) {
    highScore = losses;
  }

  return highScore;
}

function endMatch(highScore) {
  endOfGame = false;

  switch (true) {
    case (highScore === wins && highScore === limit) :
      endOfGame = true;
      matchesWon++;
      console.log("Game Over!");
      console.log("You Win!" . green);
      return endOfGame;

    case (highScore === losses && highScore === limit) :
      endOfGame = true;
      matchesLost++;
      console.log("Game Over!");
      console.log("You Lose!" . red);
      return endOfGame;

    default:
      return;
  }
}

function resetScore() {
  wins = 0;
  losses = 0;
  ties = 0;
  limit = 0;
  highScore = 0;
  endGame = false;
}

function askLimit(rl) {
  rl.question("This game will end when one competitor reaches how many wins? : ", (answer) => {
    limit = Number(answer);
    if (limit > 0) {
      console.clear();
      console.log(`This match will be played to ${answer} wins!`);
      promptInput(rl);

    } else {
      askLimit(rl);
    }
  });

}

function scoreBoard(wins, losses, ties) {
  console.log(`
    ${colors.green(wins)} wins - ${colors.red(losses)} losses - ${colors.yellow(ties)} ties
        `);
}

/******************************* MAIN FUNCTION *******************************/
function promptInput(rl, answer) {
  let cpu;

  scoreBoard(wins, losses, ties);
  rl.question('> ', (cmd) => {
    cmd = cmd.toLowerCase();

    switch (true) {
      case (endGame) :
        rl.close();
        return;

      case (cmd === 'h') :
        console.log("\nHelp:\n");
        printHelp();
        break;

      case (cmd === 'q') :
        rl.close();
        return;

      case (VALID_MOVES.hasOwnProperty(cmd)) :
        cpu = getCPUMove();
        processMove(cmd, cpu);
        if (endMatch(getHighScore(wins, losses))) {
          endGame = true;
        }
        break;

      default:
        console.log("\nInvalid command.\n");
        printHelp();
    }

    if (endGame) {
      totalMatches++;
      overallSuccess = (matchesWon / totalMatches) * 100;

      scoreBoard(wins, losses, ties);

      console.log(`
      Total matches won: ${colors.green(matchesWon)}
      Total matches lost: ${colors.red(matchesLost)}
      Total matches played: ${colors.yellow(totalMatches)}
        `);
      /* giving the player the option to play another round so they don't have to
        launch the game again to do that
        */
        rl.question("Would you like to play again? y/n :", (answer) => {
        if (answer === "y") {
          console.clear();
          rl.close();
          initializeGame();
        } else {
          rl.close();
          console.log(`Your ${colors.blue("overall success")} rate was ${colors.blue(overallSuccess.toFixed(2))}${colors.blue("%")}
            `);
          console.log("Thanks for playing!");
        }

      });
      return;
    }

    promptInput(rl);
  });
}

/****************************** INITIALIZE GAME ******************************/
function initializeGame() {
  resetScore();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Welcome to Rock/Paper/Scissors\n");
  printHelp();

  //to improve the experience for the player, I'm asking how long they want the game to be.
  askLimit(rl);
}

// start the game if running this file directly, `node game.js`
// do not start the game if running test specs
if (typeof require !== 'undefined' && require.main === module) {
  initializeGame();
}


/**************************************************************************/
/* DO NOT CHANGE THE CODE BELOW */
module.exports = {
  printHelp,
  getWinner,
  getCPUMove,
  processMove,
  promptInput
};
