adddialog = document.querySelector('#addaccount');

let close = document.querySelectorAll('.close')

close[1].addEventListener('click',(event) => {
    removeClass(accountdialog, 'dialog-scale');
    setTimeout(function(){ accountdialog.close(); }, 300);
});

close[0].addEventListener('click',(event) => {
    removeClass(adddialog, 'dialog-scale');
    setTimeout(function(){ adddialog.close(); }, 300);

    
    transactForm = document.querySelector('#transactForm');
    let inputs = transactForm.querySelectorAll('input');

    inputs[0].value = '';
    inputs[1].value = '';
})