import { handleInput } from "../core/io.js";

const gameObjects = ["rock", "paper", "scissors"];

function getNpcChoice(gameObjects) {
  const randInd = Math.floor(Math.random() * gameObjects.length);
  const npcChoice = gameObjects[randInd];
  return npcChoice;
}

function gamePlayResult(playerChoice, npcChoice) {
  if (playerChoice === npcChoice) {
    return { result: 0, npcChoice };
  }

  if (playerChoice === "rock") {
    switch (npcChoice) {
      case "paper":
        return { result: -1, npcChoice, npcAction: "covers" };
      default:
        // we handled same choice at the top. default will be scissors
        return { result: 1, npcChoice };
    }
  }
  if (playerChoice === "paper") {
    switch (npcChoice) {
      case "rock":
        return { result: 1, npcChoice };
      default:
        // we handled same choice at the top. default will be scissors
        return { result: -1, npcChoice, npcAction: "cuts" };
    }
  }

  if (playerChoice === "scissors") {
    switch (npcChoice) {
      case "paper":
        return { result: 1, npcChoice };
      default:
        // we handled same choice at the top. default will be rock
        return { result: -1, npcChoice, npcAction: "crushes" };
    }
  }
}

const emojiMap = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

function renderResult(playerChoice, result) {
  switch (result.result) {
    case 1:
      return "You Win";
    case -1:
      return `${emojiMap[result.npcChoice]} ${result.npcAction} ${
        emojiMap[playerChoice]
      }\nYou Lose`;
    default:
      return "Draw";
  }
}

export function rockPaperScissors() {
  const gameObjectsKeyMap = {
    r: "rock",
    p: "paper",
    s: "scissors",
  };

  console.log("Rock, paper, scissors");

  handleInput((key) => {
    console.log(key);
    if (!Object.keys(gameObjectsKeyMap).includes(key.toLowerCase())) {
      console.log("Invalid Choices \nChoose 'r', 'p' or 's'");
      process.exit();
    }
    const playerChoice = gameObjectsKeyMap[key];

    const result = gamePlayResult(playerChoice, getNpcChoice(gameObjects));

    console.log(renderResult(playerChoice, result));
  });
}
