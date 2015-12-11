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
    buttons.toggleClass('button-disabled', true);
    button.toggleClass('button-disabled', false);
    bubble.show();
    bubble.text('…');
    $.get('/', function (data) {
        if (!bubble.is(':visible')) {
            return;
        }
        bubble.text(data);
        buttons.each(function (i) {
            buttons.eq(i).toggleClass('button-disabled', $('.bubble', buttons.eq(i)).is(':visible'));
        });
        if ($('.bubble:visible').length === 5) {
            $('#info-bar').toggleClass('button-disabled', false);
        }
        if (index < 4) {
            numberButtonClick(index + 1);
        } else {
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
        numberButtonClick(0);
    });
    resetAll();
});