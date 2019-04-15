adddialog = document.querySelector('#addaccount');

let close = document.querySelectorAll('.close')
close[1].addEventListener('click',(event) => {
    accountdialog.close()
    accountdialog.classList.remove('dialog-scale');
})
close[0].addEventListener('click',(event) => {
    adddialog.close()
    adddialog.classList.remove('dialog-scale');
})