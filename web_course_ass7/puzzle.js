var GameStateEnum = {
    GS_LOADING: "GS_LOADING",
    GS_PLAYING: "GS_PLAYING",
    GS_STOP: "GS_STOP"
}, UNMOVEABLE = -1, ANIMATION_DURATION = 500,
    GameState, TimeUsed, Timer, FullPuzzleImage, EmptyTilePosition, MatchedCount,
    PuzzleBorad, Tiles, RankingsButton, GameControlButton, SettingsButton, GameControlLabel;

function randomizePosition() {
    "use strict";
    var i, r, tmp, posArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    for (i = 14; i >= 0; i -= 1) {
        r = Math.floor(Math.random() * (i + 1));
        tmp = posArr[r];
        posArr[r] = posArr[i];
        posArr[i] = tmp;
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

function startNewGame() {
    "use strict";
    if (GameState === GameStateEnum.GS_STOP) {
        MatchedCount = 0;
        randomizePosition();
        repositionTiles();
        GameState = GameStateEnum.GS_PLAYING;
        GameControlLabel.textContent = "STOP";
    } else {
        setTilesBack();
        GameState = GameStateEnum.GS_STOP;
        GameControlLabel.textContent = "START";
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
function animateTileMovement(tile) {
    "use strict";
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
    PuzzleBorad = document.getElementById("puzzle-board");
    for (i = 0; i < 15; i += 1) {
        tile = document.createElement("canvas");
        tile.className = "tile";
        tile.width = "88";
        tile.height = "88";
        t = Math.floor(i / 4) * 88;
        l = i % 4 * 88;
        tile.style.top = t.toString() + "px";
        tile.style.left = l.toString() + "px";
        tile.position = i;
        tile.onclick = tileClicked;
        PuzzleBorad.appendChild(tile);
        Tiles.push(tile);
    }
//    Tiles = PuzzleBorad.children;
    RankingsButton = document.getElementById("game-rankings");
    GameControlButton = document.getElementById("game-control");
    GameControlLabel = document.getElementById("game-control-label");
    SettingsButton = document.getElementById("game-settings");
    FullPuzzleImage = new Image();
    FullPuzzleImage.onload = fullPuzzleLoaded;
    EmptyTilePosition = 15;
    MatchedCount = 15;
}

function dispatchEvents() {
    "use strict";
    GameControlButton.onclick = startNewGame;
}

window.onload = function () {
    "use strict";
    initElementsAndRt();
    dispatchEvents();
    loadFullPuzzle("puzzles/panda.jpg");
};