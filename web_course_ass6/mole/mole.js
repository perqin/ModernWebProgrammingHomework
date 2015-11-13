/**
 *  1. JSLint makes me ill again...
 *  2. The holes are created and positioned on the page dynamically, so I can
 *     only change it's 'top' and 'left' style in JavaScript.
**/

var GameStateEnum = {
    STATE_STOP:     "STATE_STOP",
    STATE_PLAY:     "STATE_PLAY",
    STATE_PAUSE:    "STATE_PAUSE"
},
    // HTML elements
    GameContainer, Holes, StartStopButton, StartStopLabel, TimeIndicator, ScoreIndicator, ColumnIndicator, RowIndicator, PauseScreen,
    // Game runtime
    ColumnCount, RowCount, GameState, Timer, TimeLeft, Score = 0, CurrentMoleIndex, Played = false;

function changeScore(score) {
    "use strict";
    Score = score;
    ScoreIndicator.textContent = Score;
}

function onGameStop() {
    "use strict";
    // Remove old holes
    while (GameContainer.lastChild) {
        GameContainer.removeChild(GameContainer.lastChild);
    }
    ColumnIndicator.disabled = false;
    RowIndicator.disabled = false;
    StartStopLabel.textContent = "START";
    TimeLeft = 0;
    TimeIndicator.textContent = TimeLeft;
    clearInterval(Timer);
    if (Played) {
        window.alert("Congratulation! You got " + Score.toString() + " point(s)!");
    }
}

function changeTimeLeft(timeLeft) {
    "use strict";
    TimeLeft = timeLeft;
    TimeIndicator.textContent = TimeLeft;
    if (TimeLeft === 0) {
        onGameStop();
    }
}

function initTimers() {
    "use strict";
    Timer = setInterval(function () {
        changeTimeLeft(TimeLeft - 1);
    }, 1000);
}

function onGamePlay() {
    "use strict";
    Played = true;
    PauseScreen.className = "pause-screen-hide";
    ColumnIndicator.disabled = true;
    RowIndicator.disabled = true;
    StartStopLabel.textContent = "STOP";
    initTimers();
}

function onGamePause() {
    "use strict";
    PauseScreen.className = "pause-screen-show";
    clearInterval(Timer);
}

function changeState(state) {
    "use strict";
    GameState = state;
    switch (GameState) {
    case GameStateEnum.STATE_STOP:
        onGameStop();
        break;
    case GameStateEnum.STATE_PLAY:
        onGamePlay();
        break;
    case GameStateEnum.STATE_PAUSE:
        onGamePause();
        break;
    default:
        break;
    }
}

function restrictColumnRow() {
    "use strict";
    ColumnCount = parseInt(ColumnIndicator.value, 10);
    RowCount = parseInt(RowIndicator.value, 10);
    if (!ColumnCount) {
        ColumnCount = 5;
    } else if (ColumnCount < 3) {
        ColumnCount = 3;
    } else if (ColumnCount > 14) {
        ColumnCount = 14;
    }
    if (!RowCount) {
        RowCount = 4;
    } else if (RowCount < 3) {
        RowCount = 3;
    } else if (RowCount > 9) {
        RowCount = 9;
    }
    ColumnIndicator.value = ColumnCount;
    RowIndicator.value = RowCount;
}

function generateNewMole() {
    "use strict";
    var newMole;
    CurrentMoleIndex = Math.floor(RowCount * ColumnCount * Math.random());
    newMole = Holes[CurrentMoleIndex];
    newMole.classList.add("hole-mole");
}

function onHoleClicked(event) {
    "use strict";
    var theHole = event.target, index = theHole.holeIndex;
    if (index === CurrentMoleIndex) {
        theHole.classList.remove("hole-mole");
        changeScore(Score + 1);
        generateNewMole();
    } else {
        changeScore(Score - 1);
        event.target.style.animationName = "hole-red";
    }
}

function resetAnimationName(event) {
    "use strict";
    event.target.style.animationName = "";
}

function generateHoles() {
    "use strict";
    var w, h, r, c, newHole, t, l;
    restrictColumnRow();
    // Resize Container
    w = ColumnCount * 40;
    h = RowCount * 40;
    GameContainer.style.width = w.toString() + "px";
    GameContainer.style.height = h.toString() + "px";
    // Add new holes
    // Old holes have been removed when game stop
    for (r = 0; r < RowCount; r += 1) {
        for (c = 0; c < ColumnCount; c += 1) {
            newHole = document.createElement("div");
            newHole.className = "hole";
            t = 40 * r + 6;
            l = 40 * c + 6;
            newHole.style.top = t.toString() + "px";
            newHole.style.left = l.toString() + "px";
            // Add new property
            newHole.holeIndex = r * ColumnCount + c;
            newHole.addEventListener("click", onHoleClicked);
            newHole.addEventListener("animationEnd", resetAnimationName);
            GameContainer.appendChild(newHole);
        }
    }
    Holes = GameContainer.children;
}

function startNewGame() {
    "use strict";
    generateHoles();
    changeTimeLeft(30);
    changeScore(0);
    changeState(GameStateEnum.STATE_PLAY);
    generateNewMole();
}

function onStartStopClicked() {
    "use strict";
    if (GameState === GameStateEnum.STATE_PLAY) {
        changeState(GameStateEnum.STATE_STOP);
    } else {
        startNewGame();
    }
}

function initElements() {
    "use strict";
    GameContainer = document.getElementById("mole-holes-container");
    StartStopButton = document.getElementById("start-stop");
    StartStopLabel = document.getElementById("start-stop-p");
    TimeIndicator = document.getElementById("time-indicator");
    ScoreIndicator = document.getElementById("score-indicator");
    ColumnIndicator = document.getElementById("column-indicator");
    RowIndicator = document.getElementById("row-indicator");
    PauseScreen = document.getElementById("pause-screen");
}

function initRuntime() {
    "use strict";
    changeState(GameStateEnum.STATE_STOP);
    changeTimeLeft(0);
    changeScore(0);
    CurrentMoleIndex = -1;
}

function dispatchinitialEvents() {
    "use strict";
    StartStopButton.addEventListener("click", onStartStopClicked);
}

function init() {
    "use strict";
    initElements();
    initRuntime();
    dispatchinitialEvents();
}

window.onload = init;
window.onfocus = function () {
    "use strict";
    if (GameState === GameStateEnum.STATE_PAUSE) {
        changeState(GameStateEnum.STATE_PLAY);
    }
};
window.onblur = function () {
    "use strict";
    if (GameState === GameStateEnum.STATE_PLAY) {
        changeState(GameStateEnum.STATE_PAUSE);
    }
};
