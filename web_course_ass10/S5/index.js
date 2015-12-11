function resetAll() {
    var buttons = $('.button'),
        bubbles = $('.bubble'),
        resultBall = $('#info-bar'),
        resultLabel = $('#result-label');
    buttons.toggleClass('button-disabled', false);
    bubbles.hide();
    bubbles.text('');
    resultBall.toggleClass('button-disabled', true);
    resultLabel.text('');
    $('#msg').text('');
}

function buttonHandler(resultBefore, callList, index, onFail) {
    var buttons = $('.button'), button = buttons.eq(callList[index].i), bubble = $('.bubble', button);
    if (button.hasClass('button-disabled') || bubble.text() === '…') {
        return;
    }
    bubble.show();
    bubble.text('…');
    $.get('/', function (data) {
        if (!bubble.is(':visible')) {
            return;
        }
        bubble.text(data);
        button.toggleClass('button-disabled', true);
        if (Math.random() < 0.8) {
            $('#msg').text(callList[index].m);
        } else {
            onFail(index);
        }
        callList[index + 1].f(resultBefore + parseInt(data), callList, index + 1, function (k) {
            $('#msg').text(callList[k].rm);
        });
    });
}

function aHandler(resultBefore, callList, index, onFail) {
    buttonHandler(resultBefore, callList, index, onFail);
}

function bHandler(resultBefore, callList, index, onFail) {
    buttonHandler(resultBefore, callList, index, onFail);
}

function cHandler(resultBefore, callList, index, onFail) {
    buttonHandler(resultBefore, callList, index, onFail);
}

function dHandler(resultBefore, callList, index, onFail) {
    buttonHandler(resultBefore, callList, index, onFail);
}

function eHandler(resultBefore, callList, index, onFail) {
    buttonHandler(resultBefore, callList, index, onFail);
}

function resultHandler(resultBefore) {
    var resultBall = $('#info-bar');
    $('#msg').text('楼主异步调用战斗力感人，目测不超过' + resultBefore.toString());
    $('#result-label').text(resultBefore.toString());
    resultBall.toggleClass('button-disabled', true);
}

$(window).load(function () {
    $('#button').mouseleave(resetAll);
    $('.apb').click(function () {
        var rnd = [
            { i: 0, a: 'A', f: aHandler, m: '这是个天大的秘密', rm: '这不是天大的秘密' },
            { i: 1, a: 'B', f: bHandler, m: '我不知道', rm: '我知道' },
            { i: 2, a: 'C', f: cHandler, m: '你不知道', rm: '你知道' },
            { i: 3, a: 'D', f: dHandler, m: '他不知道', rm: '他知道' },
            { i: 4, a: 'E', f: eHandler, m: '才怪', rm: '才不怪' },
            { f: resultHandler, rm: '' }
        ], i, tmp, r;
        for (i = 4; i > 0; --i) {
            r = Math.floor(Math.random() * (i + 1));
            tmp = rnd[r];
            rnd[r] = rnd[i];
            rnd[i] = tmp;
        }
        $('#result-label').text(rnd[0].a + rnd[1].a + rnd[2].a + rnd[3].a + rnd[4].a);
        rnd[0].f(0, rnd, 0, function () {
            $('#msg').text(rnd[0].rm);
        });
    });
    resetAll();
});