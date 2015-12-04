function validate() {
    // rebuild post data in advance
    var params = {
        username: $('input[name="username"]').eq(0).val(),
        id: $('input[name="id"]').eq(0).val(),
        tel: $('input[name="tel"]').eq(0).val(),
        email: $('input[name="email"]').eq(0).val()
    };
    var err = check(params);
    console.log(err);
    for (var key in err) {
        if (err.hasOwnProperty(key) && key != 'code') {
            $('#' + key.substr(0, key.length - 3) + '-err-label').text(err[key] ? ERR_STRs[key] : '');
        }
    }
    //$('input[type="submit"]')[0].disabled = (err.code != 0);
    $('input[type="submit"]').prop('disabled', err.code != 0);
    //console.log(err);
    //$('input[type="submit"]').val('fuck');
}

$(window).load(function () {
    $('input[type="text"]').on('input', validate);
    validate();
});