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
}

function numberButtonClick(index) {
    var buttons = $('.button'),
        button = buttons.eq(index),
        bubble = $('.bubble', button);
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
        if ($('.button.button-disabled').length === 5) {
            $('#info-bar').toggleClass('button-disabled', false);
            resultBallClick();
        }
    });
}

function resultBallClick() {
    var resultBall = $('#info-bar');
    if (resultBall.hasClass('button-disabled')) {
        return;
    }
    var sum = 0;
    for (var i = 0; i < 5; ++i) {
        sum += parseInt($('.bubble').eq(i).text());
    }
    $('#result-label').text(sum.toString());
    resultBall.toggleClass('button-disabled', true);
}

$(window).load(function () {
    $('#button').mouseleave(resetAll);
    $('.apb').click(function () {
        var rnd = [0, 1, 2, 3, 4], i, tmp, r, apb = ['A', 'B', 'C', 'D', 'E'];
        for (i = 4; i > 0; --i) {
            r = Math.floor(Math.random() * (i));
            tmp = rnd[r];
            rnd[r] = rnd[i];
            rnd[i] = tmp;
        }
        $('#result-label').text(apb[rnd[0]] + apb[rnd[1]] + apb[rnd[2]] + apb[rnd[3]] + apb[rnd[4]]);
        for (i = 0; i < 5; ++i) {
            numberButtonClick(rnd[i]);
        }
    });
    resetAll();
});