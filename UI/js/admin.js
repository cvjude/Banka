accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');
adddialog = document.querySelector('#addaccount');

document.getElementById("accountul").addEventListener("click",function(e) {
    if (e.target.classList[0]==='btn') {
        accountdialog.showModal();
        accountdialog.classList.add('dialog-scale');
      }
  });

  document.getElementById("opendialog").addEventListener("click",function(e) {
            adddialog.showModal();
        adddialog.classList.add('dialog-scale');
  });

  let close = document.querySelectorAll('.close')

close[1].addEventListener('click',(event) => {
    accountdialog.close()
    accountdialog.classList.remove('dialog-scale');
})

close[0].addEventListener('click',(event) => {
    adddialog.close()
    adddialog.classList.remove('dialog-scale');
})

accountForm = document.querySelector('.accountform');
accountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let inputs = accountForm.querySelectorAll('input');
    const elements = Array.from(inputs)
    const valid = elements.find(element => {
        return element.className === 'invalid';
    });
    if(!valid){
        adddialog.close();
    }
});