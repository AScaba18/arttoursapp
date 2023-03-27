if (pageData.msg)
{
    msg(pageData.msg)
}

function msg( msgText = null ) {
    let options = {
        position: 'top-end',
        icon: 'success',
        title: msgText ? msgText : 'Your work has been saved',
        showConfirmButton: false,
        timer: 3500
    }
    if ( isJson(msgText) && JSON.parse(msgText).errors) {
        let errors = JSON.parse(msgText).errors,
            errorsHtml = ''
        Object.values(errors).forEach(e=>{errorsHtml += `${e}`})
        options.icon = 'error'
        options.title = "Errors:"
        options.html = errorsHtml
        options.timer = null
        options.showCloseButton = true
        console.log(errors)
    }
    Swal.fire(options);
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}