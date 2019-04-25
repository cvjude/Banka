accountForm = document.querySelector('.accountform');
error = document.querySelector('.error');

accountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let input = accountForm.querySelector('input');
      if(input.className === 'valid' && input.value < 999.99){
        error.style.display = 'block';
      }
      else {
        dialog.close();
        input.value = '';
        error.style.display = 'none';
      }
});
  