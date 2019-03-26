accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');
adddialog = document.querySelector('#addaccount');

document.getElementById("accountul").addEventListener("click",function(e) {
    if (e.target.id==='detail') {
        accountdialog.showModal();
        accountdialog.classList.add('dialog-scale');
    }

    if (e.target.id==='trans') {
        adddialog.showModal();
        adddialog.classList.add('dialog-scale');
    }
});

let close = document.querySelectorAll('.close')

console.log(close)

close[1].addEventListener('click',(event) => {
    accountdialog.close()
    accountdialog.classList.remove('dialog-scale');
})

close[0].addEventListener('click',(event) => {
    adddialog.close()
    adddialog.classList.remove('dialog-scale');
})