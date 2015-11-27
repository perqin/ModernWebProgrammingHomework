var GameStateEnum = {
    GS_LOADING: "GS_LOADING",
    GS_PLAYING: "GS_PLAYING",
    GS_STOP: "GS_STOP"
}, Boards = {
    SETTINGS: "SETTINGS",
    PUZZLE: "PUZZLE",
    RANKINGS: "RANKINGS",
    LOADING: "LOADING"
},
    UNMOVEABLE = -1, ANIMATION_DURATION = 500, RANDOM_TIMES = 1000,
    GameState, CurrentBoard, FullPuzzleImage, EmptyTilePosition, MatchedCount, PuzzleIndex, PuzzlesArray = [], Score, Tiles;

function changeScore(s) {
    "use strict";
    Score = s;
    $("#your-score").text("你的分数：" + Score.toString());
}

function showLoadingScreen() {
    "use strict";
    $("#loading-overlay").show();
}

function hideLoadingScreen() {
    "use strict";
    $("#loading-overlay").hide();
}

function loadFullPuzzle(url) {
    "use strict";
    showLoadingScreen();
    FullPuzzleImage.src = url;
}

function randomizePosition() {
    "use strict";
    var i, r, tmp, posArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], empty = 15, dir;
    // Improved randomize
    _.times(RANDOM_TIMES, function () {
        // Move direction of empty tile, 0 to 3 correspond to up, right, down, left
        dir = _.random(0, 3);
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
    });
    // Move the empty to the right-bottom corner
    while (empty < 12) {
        posArr[empty] = posArr[empty + 4];
        empty += 4;
    }
    while (empty % 4 < 3) {
        posArr[empty] = posArr[empty + 1];
        empty += 1;
    }
    _.times(15, function (i) {
        Tiles[i].position = posArr[i];
        if (i === Tiles[i].position) {
            MatchedCount += 1;
        }
    });
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
    _.times(15, function (i) {
        Tiles[i].position = i;
        repositionTile(Tiles[i]);
    });
}

function repositionTiles() {
    "use strict";
    _.times(15, function (i) {
        repositionTile(Tiles[i]);
    });
}

function startGame() {
    "use strict";
    MatchedCount = 0;
    EmptyTilePosition = 15;
    randomizePosition();
    repositionTiles();
    GameState = GameStateEnum.GS_PLAYING;
    $("#game-control-label").text("认输");
    $("#game-rankings").toggleClass("button-disable", true);
    $("#game-settings").toggleClass("button-disable", true);
}

function stopGame() {
    "use strict";
    setTilesBack();
    GameState = GameStateEnum.GS_STOP;
    $("#game-control-label").text("开始");
    $("#game-rankings").toggleClass("button-disable", false);
    $("#game-settings").toggleClass("button-disable", false);
}

function startNewGame() {
    "use strict";
    if (GameState === GameStateEnum.GS_STOP) {
        startGame();
    } else {
        stopGame();
    }
    changeScore(10000);
}

function winGame() {
    "use strict";
    stopGame();
    CurrentBoard = Boards.UPLOAD;
    $("#player-name").disabled = true;
    $("#win-board").show();
    $("#upload-score").toggleClass("button-disable", false);
    $("#upload-score-label").text("上传分数");
    $("#win-score").text("你的分数：" + Score.toString());
}

function validatePlayer() {
    "use strict";
    $("#player-name").val($("#player-name").val().replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]/g, ""));
}

function scoreUploaded() {
    "use strict";
    $("#win-board").hide();
    changeScore(10000);
}

function uploadScore() {
    "use strict";
    $("#player-name").disabled = true;
    $("#upload-score").toggleClass("button-disable", true);
    $("#upload-score-label").text("上传中");
    validatePlayer();
    $.post("http://perqin.com/mwp/puzzle/api.php", { method: "upload", player: $("#player-name").val(), score: Score.toString() }).done(function (json) {
        scoreUploaded();
    }).fail(function (jqxhr, textStatus, error) {
        window.console.log("Request Failed: " + textStatus + ", " + error);
        window.alert("上传分数失败了2333");
        $("#win-board").hide();
    });
}

function updateRankingsList(data) {
    "use strict";
    var listRankings, listPlayer, listScore, listItem;
    $("#rankings-list").empty();
    _.times(data.rankings.length, function (i) {
        listRankings = document.createElement("td");
        listRankings.textContent = (i + 1).toString();
        listRankings.classList.add("rankings-list-column-narrow");
        listPlayer = document.createElement("td");
        listPlayer.textContent = data.rankings[i].player;
        listPlayer.classList.add("rankings-list-column-wide");
        listScore = document.createElement("td");
        listScore.textContent = data.rankings[i].score;
        listScore.classList.add("rankings-list-column-narrow");
        listItem = document.createElement("tr");
        listItem.appendChild(listRankings);
        listItem.appendChild(listPlayer);
        listItem.appendChild(listScore);
        $("#rankings-list").append(listItem);
    });
    hideLoadingScreen();
}

function loadRankings() {
    "use strict";
    showLoadingScreen();
    $.getJSON("http://perqin.com/mwp/puzzle/api.php", { method: "rankings" }).done(function (json) {
        updateRankingsList(json);
    }).fail(function (jqxhr, textStatus, error) {
        window.console.log("Request Failed: " + textStatus + ", " + error);
        window.alert("加载排行榜失败Orz");
        hideLoadingScreen();
    });
}

function openRankings() {
    "use strict";
    if (GameState !== GameStateEnum.GS_STOP) {
        return;
    }
    var br = CurrentBoard === Boards.RANKINGS;
    CurrentBoard = br ? Boards.PUZZLE : Boards.RANKINGS;
    $("#rankings-board").toggle(!br);
    $("#game-rankings").toggleClass("button-main-long", !br);
    $("#game-control").toggleClass("button-disable button-main-hide-r", !br);
    $("#game-settings").toggleClass("button-disable button-main-hide-r", !br);
    $("#game-rankings-label").text(br ? "线上排行" : "返回");
    if (!br) {
        loadRankings();
    }
}

function updatePrevNextButtons() {
    "use strict";
    $("prev-puzzle").toggleClass("button-disable", PuzzleIndex === 0);
    $("next-puzzle").toggleClass("button-disable", (PuzzleIndex === PuzzlesArray.length - 1 || PuzzlesArray.length === 0));
}

function selectPuzzle(index) {
    "use strict";
    if (index >= 0 && index < PuzzlesArray.length) {
        $("#puzzle-thumb").attr("src", PuzzlesArray[index].thumb);
        $("#puzzle-label").text(PuzzlesArray[index].title);
        loadFullPuzzle(PuzzlesArray[index].full_image);
        PuzzleIndex = index;
    }
}

function prevPuzzle() {
    "use strict";
    selectPuzzle(PuzzleIndex - 1);
    updatePrevNextButtons();
}

function nextPuzzle() {
    "use strict";
    selectPuzzle(PuzzleIndex + 1);
    updatePrevNextButtons();
}

function updatePuzzlesArray(data) {
    "use strict";
    PuzzlesArray = data.puzzles;
    if (PuzzleIndex >= PuzzlesArray.length) {
        PuzzleIndex = 0;
    }
    selectPuzzle(PuzzleIndex);
    updatePrevNextButtons();
    hideLoadingScreen();
}

function loadSettings() {
    "use strict";
    showLoadingScreen();
    $.getJSON("http://perqin.com/mwp/puzzle/api.php", { method: "puzzles" }).done(function (json) {
        updatePuzzlesArray(json);
    }).fail(function (jqxhr, textStatus, error) {
        window.console.log("Request Failed: " + textStatus + ", " + error);
        window.alert("加载拼图列表失败QAQ");
        updatePrevNextButtons();
        hideLoadingScreen();
    });
}

function openSettings() {
    "use strict";
    if (GameState !== GameStateEnum.GS_STOP) {
        return;
    }
    var br = CurrentBoard === Boards.SETTINGS;
    $("#settings-board").toggle(!br);
    $("#game-rankings").toggleClass("button-disable button-main-hide-l", !br);
    $("#game-control").toggleClass("button-disable button-main-hide-l", !br);
    $("#game-settings").toggleClass("button-main-long", !br);
    $("#game-settings-label").text(br ? "设置" : "返回");
    CurrentBoard = br ? Boards.PUZZLE : Boards.SETTINGS;
    if (!br) {
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
    var tmp;
    if (GameState !== GameStateEnum.GS_PLAYING) {
        return;
    }
    if (getMovedTo(event.target.position) === UNMOVEABLE) {
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
    changeScore(Score - 1);
    if (MatchedCount === 15) {
        winGame();
    }
}

function fullPuzzleLoaded() {
    "use strict";
    _.times(15, function (i) {
        Tiles[i].getContext("2d").drawImage(FullPuzzleImage, i % 4 * 88, Math.floor(i / 4) * 88, 88, 88, 0, 0, 88, 88);
    });
    hideLoadingScreen();
}

function initElementsAndRt() {
    "use strict";
    var i, tile, t, l;
    Tiles = [];
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
        $("#puzzle-board").append(tile);
        Tiles.push(tile);
    }
    hideLoadingScreen();
    $("#win-board").hide();
    $("#rankings-board").hide();
    $("#settings-board").hide();
    FullPuzzleImage = new Image();
    FullPuzzleImage.onload = fullPuzzleLoaded;
    EmptyTilePosition = 15;
    MatchedCount = 15;
    PuzzleIndex = 0;
    changeScore(10000);
    GameState = GameStateEnum.GS_STOP;
    CurrentBoard = Boards.PUZZLE;
}

function dispatchEvents() {
    "use strict";
    $("#game-rankings").click(openRankings);
    $("#game-control").click(startNewGame);
    $("#game-settings").click(openSettings);
    $("#prev-puzzle").click(prevPuzzle);
    $("#next-puzzle").click(nextPuzzle);
    $("#upload-score").click(uploadScore);
    // Prevent double-click text selection
    $("p").mouseover(function (event) {
        event.preventDefault();
    });
}

window.onload = function () {
    "use strict";
    initElementsAndRt();
    dispatchEvents();
    loadFullPuzzle("puzzles/panda.jpg");
};
