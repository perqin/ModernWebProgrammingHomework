var GameStateEnum = {
    GS_LOADING: "GS_LOADING",
    GS_PLAYING: "GS_PLAYING",
    GS_STOP: "GS_STOP"
}, UNMOVEABLE = -1, ANIMATION_DURATION = 500, RANDOM_TIMES = 1000,
    GameState, TimeUsed, Timer, FullPuzzleImage, EmptyTilePosition, MatchedCount,
    PuzzleBorad, Tiles, RankingsButton, GameControlButton, SettingsButton, GameControlLabel;

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
        window.console.log(posArr[i]);
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
    randomizePosition();
    repositionTiles();
    GameState = GameStateEnum.GS_PLAYING;
    GameControlLabel.textContent = "STOP";
}

function stopGame() {
    "use strict";
    setTilesBack();
    GameState = GameStateEnum.GS_STOP;
    GameControlLabel.textContent = "START";
}

function startNewGame() {
    "use strict";
    if (GameState === GameStateEnum.GS_STOP) {
        startGame();
    } else {
        stopGame();
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
        PuzzleBorad.appendChild(tile);
        Tiles.push(tile);
    }
    RankingsButton = document.getElementById("game-rankings");
    GameControlButton = document.getElementById("game-control");
    GameControlLabel = document.getElementById("game-control-label");
    SettingsButton = document.getElementById("game-settings");
    FullPuzzleImage = new Image();
    FullPuzzleImage.onload = fullPuzzleLoaded;
    EmptyTilePosition = 15;
    MatchedCount = 15;
    GameState = GameStateEnum.GS_STOP;
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