accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');
adddialog = document.querySelector('#addaccount');
deactivate = document.querySelector('.deactivate');


document.getElementById("accountul").addEventListener("click",function(e) {
    if (e.target.classList[0]==='btn') {
        const status = e.target.parentNode.parentNode.parentNode.children[1].children[0].classList[1];
        if(status === 'bactive')
            deactivate.textContent = 'Deactivate'
        else
            deactivate.textContent = 'Activate'
        accountdialog.showModal();
        accountdialog.classList.add('dialog-scale');
      }
  });

  document.getElementById("opendialog").addEventListener("click",function(e) {
            adddialog.showModal();
        adddialog.classList.add('dialog-scale');
  });

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