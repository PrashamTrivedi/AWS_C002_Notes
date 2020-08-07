function copyId(id) {
    const el = document.createElement('textarea')
    el.value = `${window.location.href}#${id}`
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    /* Copy the text inside the text field */


    /* Alert the copied text */

}