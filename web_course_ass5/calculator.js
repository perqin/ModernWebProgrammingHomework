/* I don't know what it exactly mean, but the IDE forces me to add it. */

var Buttons = {},
    ExpressionText,
    ResultText,
    AboutScreen,
    BracketStack = [],
    expression = "",
    result = "",
    ErrorExpressionFlag = true,
    AfterEqualFlag = true,
    clearScreenDelay = 500,
    errorScreenDelay = 500,
    shiftAnswerDelay = 500;

function initButtons(buttons_array) {
    "use strict";
    Buttons.bracketL = buttons_array[0];
    Buttons.bracketR = buttons_array[1];
    Buttons.ce = buttons_array[2];
    Buttons.del = buttons_array[3];
    Buttons.digits = new Array(10);
    Buttons.digits[0] = buttons_array[14];
    Buttons.digits[1] = buttons_array[10];
    Buttons.digits[2] = buttons_array[11];
    Buttons.digits[3] = buttons_array[12];
    Buttons.digits[4] = buttons_array[7];
    Buttons.digits[5] = buttons_array[8];
    Buttons.digits[6] = buttons_array[9];
    Buttons.digits[7] = buttons_array[4];
    Buttons.digits[8] = buttons_array[5];
    Buttons.digits[9] = buttons_array[6];
    Buttons.dot = buttons_array[13];
    Buttons.equal = buttons_array[15];
    Buttons.add = buttons_array[19];
    Buttons.subtract = buttons_array[18];
    Buttons.multiply = buttons_array[17];
    Buttons.divide = buttons_array[16];
}

function animateClearScreen() {
    AboutScreen.style.animationName = "clear-screen";
    AboutScreen.style.webkitAnimationName = "clear-screen";
}

function animateGetAnswer() {
    ResultText.style.animationName = "shift-answer";
    ResultText.style.webkitAnimationName = "shift-answer";
    ExpressionText.style.animationName = "fade-expression";
    ExpressionText.style.webkitAnimationName = "fade-expression";
}

function animateErrorScreen() {
    AboutScreen.style.animationName = "error-screen";
    AboutScreen.style.webkitAnimationName = "error-screen";
}

function calculate() {
    "use strict";
    var expression_tmp = expression, result_tmp, i;
    for (i = 0; i < BracketStack.length; ++i) {
        expression_tmp = expression_tmp + ")";
    }
    var calculateStatement = "result_tmp = " + expression_tmp + ";";
    try {
        eval(calculateStatement);
        ErrorExpressionFlag = true;
        result = "" + result_tmp;
    } catch (err) {
        ErrorExpressionFlag = false;
        result = "";
    }
}

function updateView() {
    "use strict";
    ExpressionText.innerHTML = expression;
    ResultText.innerHTML = result;
    if (ErrorExpressionFlag) {
        ExpressionText.style.color = "#8A8A8A";
        ResultText.style.color = "#C4C4C4";
    }
}

function updateViewByEqual() {
    "use strict";
    updateView();
    if (ErrorExpressionFlag) {
        ExpressionText.style.color = "#8A8A8A";
        ResultText.style.color = "#C4C4C4";
    } else {
        ExpressionText.style.color = "#E91E63";
        ResultText.style.color = "#E91E63";
    }
}

function onBracketClicked(f) {
    "use strict";
    if (AfterEqualFlag) {
        expression = "";
        AfterEqualFlag = false;
    }
    if (expression.length == 0) {
        expression = "(";
        BracketStack.push(1);
        calculate();
        updateView();
        return;
    }
    var lastChar = expression.charAt(expression.length - 1);
    if (f == '(') {
        if (lastChar == ')' || (lastChar >= '0' && lastChar <= '9')) {
            expression = expression + "*(";
            BracketStack.push(1);
        } else if (lastChar != '.') {
            expression = expression + "(";
            BracketStack.push(1);
        }
    } else if (f == ')' && BracketStack.length > 0) {
        if (lastChar == '(') {
            expression = expression + "0)";
            BracketStack.pop();
        } else if (lastChar == ')') {
            expression = expression + ")";
            BracketStack.pop();
        } else if (lastChar != '/' && lastChar != '*' && lastChar != '-' && lastChar != '+' && lastChar != '.') {
            expression = expression + ")";
            BracketStack.pop();
        }
    }
    calculate();
    updateView();
}

function onCeClicked() {
    "use strict";
    expression = "";
    result = "";
    while (BracketStack.length > 0) {
        BracketStack.pop();
    }
    animateClearScreen();
    setTimeout(function () {
        calculate();
        updateView();
    }, clearScreenDelay);
}

function onDelClicked() {
    "use strict";
    if (AfterEqualFlag) {
        expression = "";
        AfterEqualFlag = false;
        animateClearScreen();
        setTimeout(function () {
            calculate();
            updateView();
        }, clearScreenDelay);
        return;
    }
    if (expression.length > 0) {
        var lastChar = expression.charAt(expression.length - 1);
        if (lastChar == '(') {
            BracketStack.pop();
        } else if (lastChar == ')') {
            BracketStack.push(1);
        }
        expression = expression.substr(0, expression.length - 1);
    }
    calculate();
    updateView();
}

function onDigitClicked(digit) {
    "use strict";
    if (AfterEqualFlag) {
        expression = "";
        AfterEqualFlag = false;
    }
    if (expression.length == 0) {
        expression = "" + digit;
        calculate();
        updateView();
        return;
    }
    var lastChar = expression.charAt(expression.length - 1);
    var l2Char = expression.charAt(expression.length - 2);
    if (lastChar == ')') {
        expression = expression + "*" + digit;
    } else if ((lastChar >= '1' && lastChar <= '9') || lastChar == '(' || lastChar == '+' || lastChar == '-' || lastChar == '*' || lastChar == '/' || lastChar == '.') {
        expression = expression + digit;
    } else if (lastChar == '0') {
        if (expression.length > 1 && !(l2Char >= '0' && l2Char <= '9')) {
            expression = expression.substr(0, expression.length - 1) + digit;
        } else {
            expression = expression + digit;
        }
    }
    calculate();
    updateView();
}

function onDotClicked() {
    "use strict";
    if (AfterEqualFlag) {
        expression = "";
        AfterEqualFlag = false;
    }
    if (expression.length == 0) {
        expression = "0.";
        calculate();
        updateView();
        return;
    }
    var lastChar = expression.charAt(expression.length - 1);
    if (lastChar == '.') {
        calculate();
        updateView();
        return;
    }
    if (lastChar >= '0' && lastChar <= '9') {
        expression = expression + ".";
    } else if (lastChar == '(' || lastChar == '/' || lastChar == '*' || lastChar == '-' || lastChar == '+') {
        expression = expression + "0.";
    } else if (lastChar == ')') {
        expression = expression + "*0.";
    }
    calculate();
    updateView();
}

function onEqualClicked() {
    "use strict";
    // TODO : animation
    calculate();
    if (ErrorExpressionFlag == true) {
        expression = "" + result;
        result = "";
        animateGetAnswer();
        setTimeout(function () {
            updateViewByEqual();
        }, shiftAnswerDelay);
    } else if (ErrorExpressionFlag == false) {
        result = "Error Expression!";
        animateErrorScreen();
        setTimeout(function () {
            updateViewByEqual();
        }, errorScreenDelay);
    }
    AfterEqualFlag = true;
}

function onOperatorClicked(o) {
    "use strict";
    if (AfterEqualFlag) {
        AfterEqualFlag = false;
    }
    if (expression.length == 0) {
        if (o == '-') {
            expression = "-";
            calculate();
            updateView();
        } else {
            return;
        }
    }
    var lastChar = expression.charAt(expression.length - 1);
    var l2Char = expression.charAt(expression.length - 2);
    if ((lastChar >= '0' && lastChar <= '9')
        || ((lastChar != '-' || lastChar == '(') && o == '-')
        || (lastChar == ')')) {
        expression = expression + o;
    } else if (lastChar == '.') {
        expression = expression + "0" + o;
    } else if (lastChar == '+'
               || lastChar == '*'
               || lastChar == '/'
               || (lastChar == '-' && expression.length > 1 && l2Char != '(' && l2Char != '/' && l2Char != '*' && l2Char != '-' && l2Char != '+')) {
        expression = expression.substr(0, expression.length - 1) + o;
    }
    calculate();
    updateView();
}

function dispatchOnClick() {
    "use strict";
    Buttons.bracketL.setAttribute("onclick", "onBracketClicked('(');");
    Buttons.bracketR.setAttribute("onclick", "onBracketClicked(')');");
    Buttons.ce.setAttribute("onclick", "onCeClicked();");
    Buttons.del.setAttribute("onclick", "onDelClicked();");
    for (var i = 0; i < 10; ++i) {
        Buttons.digits[i].setAttribute("onclick", "onDigitClicked(" + i + ");");
    }
    Buttons.dot.setAttribute("onclick", "onDotClicked();");
    Buttons.equal.setAttribute("onclick", "onEqualClicked();");
    Buttons.add.setAttribute("onclick", "onOperatorClicked('+');");
    Buttons.subtract.setAttribute("onclick", "onOperatorClicked('-');");
    Buttons.multiply.setAttribute("onclick", "onOperatorClicked('*');");
    Buttons.divide.setAttribute("onclick", "onOperatorClicked('/');");
}

window.onload = function () {
    "use strict";
    initButtons(document.getElementsByClassName("mouse-event-layer"));
    AboutScreen = document.getElementById("screen-about-positioner");
    AboutScreen.addEventListener('webkitAnimationEnd', function () {
        this.style.webkitAnimationName = '';
    }, false);
    AboutScreen.addEventListener('animationEnd', function () {
        this.style.animationName = '';
    }, false);
    ExpressionText = document.getElementById("expression-text");
    ExpressionText.addEventListener('webkitAnimationEnd', function () {
        this.style.webkitAnimationName = '';
    }, false);
    ExpressionText.addEventListener('animationEnd', function () {
        this.style.animationName = '';
    }, false);
    ResultText = document.getElementById("result-text");
    ResultText.addEventListener('webkitAnimationEnd', function () {
        this.style.webkitAnimationName = '';
    }, false);
    ResultText.addEventListener('animationEnd', function () {
        this.style.animationName = '';
    }, false);
    dispatchOnClick();
    updateView();
};