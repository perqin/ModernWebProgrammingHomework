function validate() {
    // rebuild post data in advanced
    var params = {
        username: $('input[name="username"]').eq(0).val(),
        id: $('input[name="id"]').eq(0).val(),
        tel: $('input[name="tel"]').eq(0).val(),
        email: $('input[name="email"]').eq(0).val()
    };
    var err = check(params), p;
    for (var key in err) {
        if (err.hasOwnProperty(key) && key != 'code') {
            p = $('#' + key.substr(0, key.length - 3) + '-err-label');
            if (p.text().indexOf('已存在') == -1) {
                p.text(err[key] ? ERR_STRs[key] : '');
            }

        }
    }
    $('input[type="submit"]').prop('disabled', err.code != 0);
}

function resetInputs() {
    $('input[type="text"]').val('');
    validate();
}

$(window).load(function () {
    var inputs = $('input[type="text"]');
    inputs.on('input', validate);
    inputs.each(function (index) {
        if (inputs.eq(index).val().match(/^\{.+}$/)) {
            inputs.eq(index).val('');
        }
    });
    $('.reset-box input').click(resetInputs);
    validate();
});