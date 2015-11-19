var GameStateEnum = {
    GS_LOADING: "GS_LOADING",
    GS_PLAYING: "GS_PLAYING",
    GS_STOP: "GS_STOP"
}, Boards = {
    SETTINGS: "SETTINGS",
    PUZZLE: "PUZZLE",
    RANKINGS: "RANKINGS",
    LOADING: "LOADING"
}, Lang = ["CN", "EN"], LngSrc = [
    {
        settings: "设置",
        back: "返回",
        language: "简体中文"
    },
    {
        settings: "SETTINGS",
        back: "BACK",
        language: "English"
    }
],
    UNMOVEABLE = -1, ANIMATION_DURATION = 500, RANDOM_TIMES = 1000,
    GameState, CurrentBoard, TimeUsed, Timer, FullPuzzleImage, EmptyTilePosition, MatchedCount, LanguageIndex, PuzzleIndex,
    PuzzleBoard, SettingsBoard, LoadingScreen, Tiles, RankingsButton, GameControlButton, SettingsButton, PrevLanguageButton, NextLanguageButton, prevPuzzleButton, NextPuzzleButton,
    RankingsLabel, GameControlLabel, SettingsLabel, DisplayLanguageLabel, LanguageLabel;

// Utils function - get translation
function tr(key) {
    "use strict";
    return LngSrc[LanguageIndex][key];
}

// Utils function - send http request and parse returned JSON into object
function sendHttpRequest(method, url, data, onSucceed, onFail) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        switch (xhr.readyState) {
        case xhr.OPENED:
            break;
        case xhr.HEADERS_RECEIVED:
            if (xhr.status !== 200) {
                window.console.log("Connection Error with code " + xhr.status + " : " + xhr.statusText);
                onFail();
            }
            break;
        case xhr.DONE:
            if (xhr.status === 200) {
                try {
                    onSucceed(JSON.parse(xhr.responseText));
                } catch (err) {
                    window.console.log("Loading error.");
                    onFail();
                }
            } else {
                window.console.log("Error.");
                onFail();
            }
            break;
        }

    };
    if (method === "GET") {
        xhr.open("GET", url);
        xhr.send();
    }
    if (method === "POST") {
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-Length", data.length);
        xhr.send(data);
    }
}

// DEBUG FUNC
function dAllPosition() {
    "use strict";
    var i, d = "";
    for (i = 0; i < 15; i += 1) {
        d = d + " " + Tiles[i].position;
    }
    window.console.log(d);
}

function showLoadingScreen() {
    "use strict";
    LoadingScreen.className = "board-visible board";
}

function hideLoadingScreen() {
    "use strict";
    LoadingScreen.className = "board-hidden board";
}

function randomizePosition() {
    "use strict";
    var i, r, tmp, posArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], empty = 15, dir;
    // Improved randomize
    for (i = 0; i < RANDOM_TIMES; i += 1) {
        // Move direction of empty tile, 0 to 3 correspond to up, right, down, left
        dir = Math.floor(Math.random() * 4);
        if (dir === 0 && empty > 3) {
            posArr[empty] = posArr[empty - 4];
            empty -= 4;
        }
        if (dir === 1 && empty % 4 < 3) {
            posArr[empty] = posArr[empty + 1];
            empty += 1;
        }
        if (dir === 2 && empty < 12) {
            posArr[empty] = posArr[empty + 4];
            empty += 4;
        }
        if (dir === 3 && empty % 4 > 0) {
            posArr[empty] = posArr[empty - 1];
            empty -= 1;
        }
    }
    // Move the empty to the right-bottom corner
    while (empty < 12) {
        posArr[empty] = posArr[empty + 4];
        empty += 4;
    }
    while (empty % 4 < 3) {
        posArr[empty] = posArr[empty + 1];
        empty += 1;
    }
    for (i = 0; i < 15; i += 1) {
        Tiles[i].position = posArr[i];
        if (i === Tiles[i].position) {
            MatchedCount += 1;
        }
    }
}

function repositionTile(tile) {
    "use strict";
    var t, l, p;
    p = tile.position;
    t = Math.floor(p / 4) * 88;
    l = p % 4 * 88;
    tile.style.top = t.toString() + "px";
    tile.style.left = l.toString() + "px";
}

function setTilesBack() {
    "use strict";
    var i;
    for (i = 0; i < 15; i += 1) {
        Tiles[i].position = i;
        repositionTile(Tiles[i]);
    }
}

function repositionTiles() {
    "use strict";
    var i;
    for (i = 0; i < 15; i += 1) {
        repositionTile(Tiles[i]);
    }
}

function startGame() {
    "use strict";
    MatchedCount = 0;
    EmptyTilePosition = 15;
    randomizePosition();
    repositionTiles();
    GameState = GameStateEnum.GS_PLAYING;
    GameControlLabel.textContent = "STOP";
    RankingsButton.className = "button button-main button-disable button-main-l";
    SettingsButton.className = "button button-main button-disable button-main-r";
}

function stopGame() {
    "use strict";
    setTilesBack();
    GameState = GameStateEnum.GS_STOP;
    GameControlLabel.textContent = "START";
    RankingsButton.className = "button button-main button-enable button-main-l";
    SettingsButton.className = "button button-main button-enable button-main-r";
}

function startNewGame() {
    "use strict";
    if (GameState === GameStateEnum.GS_STOP) {
        startGame();
    } else {
        stopGame();
    }
}

function updateLanguage() {
    "use strict";
    // TODO
}

function updatePrevNextButtons() {
    "use strict";
    PrevLanguageButton.className = "button button-prev button-" + (LanguageIndex === 0 ? "disable" : "enable");
    NextLanguageButton.className = "button button-next button-" + (LanguageIndex === Lang.length - 1 ? "disable" : "enable");
}

function prevLanguage() {
    "use strict";
    LanguageIndex -= 1;
    updatePrevNextButtons();
    updateLanguage();
}

function nextLanguage() {
    "use strict";
    LanguageIndex += 1;
    updatePrevNextButtons();
    updateLanguage();
}

function loadSettings() {
    "use strict";
    showLoadingScreen();
    updatePrevNextButtons();
    // TODO
    hideLoadingScreen();
}

function openSettings() {
    "use strict";
    if (GameState !== GameStateEnum.GS_STOP) {
        return;
    }
    if (CurrentBoard === Boards.SETTINGS) {
        CurrentBoard = Boards.PUZZLE;
        SettingsBoard.className = "board-hidden board";
        RankingsButton.className = "button button-main button-enable button-main-l";
        GameControlButton.className = "button button-main button-enable button-main-m";
        SettingsButton.className = "button button-main button-enable button-main-r";
        SettingsLabel.textContent = tr("settings");
    } else {
        CurrentBoard = Boards.SETTINGS;
        SettingsBoard.className = "board-visible board";
        RankingsButton.className = "button button-main button-disable button-main-hide";
        GameControlButton.className = "button button-main button-disable button-main-hide";
        SettingsButton.className = "button button-main button-enable button-main-long";
        SettingsLabel.textContent = tr("back");
        loadSettings();
    }
}

function getMovedTo(pos) {
    "use strict";
    if ((pos > 3 && pos - 4 === EmptyTilePosition) ||
            (pos < 12 && pos + 4 === EmptyTilePosition) ||
            (pos % 4 > 0 && pos - 1 === EmptyTilePosition) ||
            (pos % 4 < 3 && pos + 1 === EmptyTilePosition)) {
        return EmptyTilePosition;
    }
    return UNMOVEABLE;
}

function tileClicked(event) {
    "use strict";
    var movedTo, tmp;
    if (GameState !== GameStateEnum.GS_PLAYING) {
        return;
    }
    movedTo = getMovedTo(event.target.position);
    if (movedTo === UNMOVEABLE) {
        return;
    }
    if (Tiles.indexOf(event.target) === event.target.position) {
        MatchedCount -= 1;
    }
    tmp = event.target.position;
    event.target.position = EmptyTilePosition;
    EmptyTilePosition = tmp;
    repositionTile(event.target);
    if (Tiles.indexOf(event.target) === event.target.position) {
        MatchedCount += 1;
    }
    if (MatchedCount === 15) {
        window.console.log("WIN!!!");
    }
//    dAllPosition();
}

function loadFullPuzzle(url) {
    "use strict";
    FullPuzzleImage.src = url;
}

function fullPuzzleLoaded() {
    "use strict";
    var i, context;
    for (i = 0; i < 15; i += 1) {
        context = Tiles[i].getContext("2d");
        context.drawImage(FullPuzzleImage, i % 4 * 88, Math.floor(i / 4) * 88, 88, 88, 0, 0, 88, 88);
    }
}

function initElementsAndRt() {
    "use strict";
    var i, tile, t, l;
    Tiles = [];
    PuzzleBoard = document.getElementById("puzzle-board");
    SettingsBoard = document.getElementById("settings-board");
    LoadingScreen = document.getElementById("loading-overlay");
    for (i = 0; i < 15; i += 1) {
        tile = document.createElement("canvas");
        tile.className = "tile";
        // Set its attributes instead of style in order to avoid canvas draw bug
        tile.width = "88";
        tile.height = "88";
        t = Math.floor(i / 4) * 88;
        l = i % 4 * 88;
        // As tile's position is dynamic, using css is unreasonable, so use js to control it
        tile.style.top = t.toString() + "px";
        tile.style.left = l.toString() + "px";
        tile.position = i;
        tile.onclick = tileClicked;
        PuzzleBoard.appendChild(tile);
        Tiles.push(tile);
    }
    RankingsButton = document.getElementById("game-rankings");
    RankingsLabel = document.getElementById("game-rankings-label");
    GameControlButton = document.getElementById("game-control");
    GameControlLabel = document.getElementById("game-control-label");
    SettingsButton = document.getElementById("game-settings");
    SettingsLabel = document.getElementById("game-settings-label");
    LanguageLabel = document.getElementById("language-label");
    PrevLanguageButton = document.getElementById("prev-lang");
    NextLanguageButton = document.getElementById("next-lang");
    FullPuzzleImage = new Image();
    FullPuzzleImage.onload = fullPuzzleLoaded;
    EmptyTilePosition = 15;
    MatchedCount = 15;
    LanguageIndex = 0;
    GameState = GameStateEnum.GS_STOP;
    CurrentBoard = Boards.PUZZLE;
}

function onPMouseDown(event) {
    "use strict";
    event.preventDefault();
}

function dispatchEvents() {
    "use strict";
    var ps, i;
    GameControlButton.onclick = startNewGame;
    SettingsButton.onclick = openSettings;
    // Prevent double-click text selection
    ps = document.getElementsByTagName("p");
    for (i = 0; i < ps.length; i += 1) {
        ps[i].addEventListener("mousedown", onPMouseDown);
    }
}

window.onload = function () {
    "use strict";
    initElementsAndRt();
    dispatchEvents();
    loadFullPuzzle("puzzles/panda.jpg");
};