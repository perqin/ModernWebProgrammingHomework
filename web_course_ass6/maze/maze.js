/**
 *  JSLint makes me ill...
**/

/*jslint plusplus: true */

var GameStateEnum = {
    STATE_STOP_INIT:    "STATE_STOP_INIT",
    STATE_PLAY:         "STATE_PLAY",
    STATE_STOP_WIN:      "STATE_STOP_WIN",
    STATE_STOP_LOSE:     "STATE_STOP_LOSE",
    STATE_STOP_CHEAT:    "STATE_STOP_CHEAT",
    STATE_STOP_UNFOCUSE: "STATE_STOP_UNFOCUSE"
},
    GameWarningStrings = {
        WIN:    "You Win",
        LOSE:   "You Lose",
        CHEAT:  "Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!"
    },
    GameState,
    // true for cheat, default is cheat
    NoNoNoPleaseDontCheatOkGuy = true,
    CheatCount = 0,
    LoseFocus = false,
    WarningText, StartTerminal, EndTerminal, Walls = [], FinishDetector, PauseScreen;

function egg() {
    "use strict";
    var eggPage = document.createElement("div"), body = document.getElementsByTagName("body");
    eggPage.className = "egg";
    body[0].appendChild(eggPage);
    setTimeout(function () {
        window.location.href = "http://www.baidu.com/more/";
    }, 6666);
}

function setPauseScreenVisibility(visible) {
    "use strict";
    if (visible && !PauseScreen.classList.contains("pause-visible")) {
        PauseScreen.classList.remove("pause-hidden");
        PauseScreen.classList.add("pause-visible");
    } else if (!visible && !PauseScreen.classList.contains("pause-hidden")) {
        PauseScreen.classList.remove("pause-visible");
        PauseScreen.classList.add("pause-hidden");
    }
}

function changeWarningText(message, visible) {
    "use strict";
    if (GameState !== GameStateEnum.STATE_PLAY) {
        WarningText.textContent = message;
    }
    if (visible) {
        WarningText.style.animationName = "warning-visible";
    } else {
        WarningText.style.animationName = "warning-hidden";
    }
}

function resetWarningAnimationName(event) {
    "use strict";
    event.target.style.animationName = "";
}

function animateWallHovered(event) {
    "use strict";
    event.target.style.animationName = "wall-hover";
}

function resetWallAnimationName(event) {
    "use strict";
    event.target.style.animationName = "";
}

// ONLY use this function to change state
function changeState(newState) {
    "use strict";
    GameState = newState;
    switch (newState) {
    case GameStateEnum.STATE_STOP_INIT:
        setPauseScreenVisibility(false);
        changeWarningText("", false);
        NoNoNoPleaseDontCheatOkGuy = true;
        break;
    case GameStateEnum.STATE_PLAY:
        setPauseScreenVisibility(false);
        changeWarningText("", false);
        NoNoNoPleaseDontCheatOkGuy = true;
        break;
    case GameStateEnum.STATE_STOP_WIN:
        changeWarningText(GameWarningStrings.WIN, true);
        NoNoNoPleaseDontCheatOkGuy = true;
        break;
    case GameStateEnum.STATE_STOP_LOSE:
        changeWarningText(GameWarningStrings.LOSE, true);
        NoNoNoPleaseDontCheatOkGuy = true;
        break;
    case GameStateEnum.STATE_STOP_CHEAT:
        changeWarningText(GameWarningStrings.CHEAT, true);
        NoNoNoPleaseDontCheatOkGuy = true;
        ++CheatCount;
        if (CheatCount >= 3) {
            egg();
        }
        break;
    case GameStateEnum.STATE_STOP_UNFOCUSE:
        setPauseScreenVisibility(true);
        break;
    default:
        break;
    }
}

function startGame() {
    "use strict";
    changeState(GameStateEnum.STATE_PLAY);
}

function stopGame(event) {
    "use strict";
    if (GameState !== GameStateEnum.STATE_PLAY) {
        return;
    }
    if (event.target.id === "terminal-end") {
        if (!NoNoNoPleaseDontCheatOkGuy) {
            changeState(GameStateEnum.STATE_STOP_WIN);
        } else {
            changeState(GameStateEnum.STATE_STOP_CHEAT);
        }
    } else if (event.target.classList.contains("wall")) {
        animateWallHovered(event);
        changeState(GameStateEnum.STATE_STOP_LOSE);
    }
}

function reachEnd() {
    "use strict";
    if (GameState === GameStateEnum.STATE_PLAY) {
        NoNoNoPleaseDontCheatOkGuy = false;
    }
}

function initElements() {
    "use strict";
    var i, walls;
    WarningText = document.getElementById("warning");
    FinishDetector = document.getElementById("finish-detector");
    StartTerminal = document.getElementById("terminal-start");
    EndTerminal = document.getElementById("terminal-end");
    PauseScreen = document.getElementById("pause-screen");
    walls = document.getElementsByClassName("wall");
    for (i = 0; i < walls.length; ++i) {
        if (walls[i].id !== "wall-tips") {
            Walls.push(walls[i]);
        }
    }
}

function dispatchEventListener() {
    "use strict";
    var i;
    WarningText.addEventListener("animationEnd", resetWarningAnimationName);
    StartTerminal.addEventListener("mouseover", startGame);
    EndTerminal.addEventListener("mouseover", stopGame);
    FinishDetector.addEventListener("mouseover", reachEnd);
    for (i = 0; i < Walls.length; ++i) {
        Walls[i].addEventListener("mouseover", stopGame);
        Walls[i].addEventListener("animationEnd", resetWallAnimationName);
    }
}

window.onload = function () {
    "use strict";
    initElements();
    dispatchEventListener();
    changeState(GameStateEnum.STATE_STOP_INIT);
};

window.onfocus = function () {
    "use strict";
    if (GameState === GameStateEnum.STATE_STOP_UNFOCUSE) {
        changeState(GameStateEnum.STATE_PLAY);
    }
    
};

window.onblur = function () {
    "use strict";
    if (GameState === GameStateEnum.STATE_PLAY) {
        changeState(GameStateEnum.STATE_STOP_UNFOCUSE);
    }
};