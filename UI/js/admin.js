accounts = document.querySelector('.accounts');
dialog = document.querySelector('dialog');

document.getElementById("accountul").addEventListener("click",function(e) {
    if (e.target && e.target.matches("li") || e.target.parentElement.matches('li') || e.target.parentElement.parentElement.matches('li')) {
        dialog.showModal();
        dialog.classList.add('dialog-scale');
      }
  });

  let close = document.querySelector('.close')

close.addEventListener('click',(event) => {
    dialog.close()
    dialog.classList.remove('dialog-scale');
})