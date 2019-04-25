accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');
dialog = document.querySelector('#addaccount');

document.getElementById("accountul").addEventListener("click",function(e) {
    if (e.target.id==='detail') {
        accountdialog.showModal();
        accountdialog.classList.add('dialog-scale');
    }

    if (e.target.id==='trans') {
        dialog.showModal();
        dialog.classList.add('dialog-scale');
    }
});