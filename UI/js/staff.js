accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');
dialog = document.querySelector('#addaccount');

const accountli = document.querySelector('.accountsLiTag');
const transactionsDiv = document.querySelector('.transactions');
const transactHeader = document.querySelector('.transactheader');
const body = document.querySelector('main');
const profile = document.querySelector('.userprofile');

let presentAccount;

if(!token) {
    goToPage('index.html');
}

const logout = document.querySelector('.logout');
logout.addEventListener('click', () => {
    signout();
});

const getUserDetails = async () => {
    const response = await fetchCall(getUser, 'GET');
    if(!response) {
        body.innerHTML = bodyError;
        return false;
    }
    const { responseObj, statusCode } = response; 
    const {firstName, email} = responseObj.data;
    
    profile.innerHTML = `
        <h4>Staff</h4>
        <div class = "username applyshadow">
            <div class = "initals">
                <div>S</div>
            </div>
        </div>
        <p class = "black">staff ${firstName}</p>
        <small>${email}</small>
    `;
    return email;
};


window.addEventListener('load', async function() {
    email = await getUserDetails();
    if (!email) {
        return false;
    }
    const account = await loadAccountDetails(baseApiRoute + '/accounts', undefined,'staff');
    await loadTranactionDetails(account);
})

accountform = document.querySelector('#accountDetails');

accountli.addEventListener('click', async (events) => {
    tag = events.path.find((event) =>
        event.tagName === 'LI')
    const accountNumber = tag.id;
    const status = tag.children[1].textContent;
    if (events.target.id === `dl${accountNumber}`) {
        
        accountdialog.showModal();
        addClass(accountform, 'spinner')
        await loadAccountDetail(baseApiRoute + `/accounts/${accountNumber}`, 'staff', accountform)

        accountdialog.classList.add('dialog-scale');
    }
    else if (events.target.id===`tl${accountNumber}`) {
        dialog.showModal();
        dialog.classList.add('dialog-scale');
        accountHeader = document.querySelector('.accountHeader');
        accountHeader.textContent = `Transactions for ${accountNumber}`;
        accountHeader.id = accountNumber;
        error.style.display = 'none';
    }
    else await loadTranactionDetails({accountNumber, status});
})

transactForm = document.querySelector('#transactForm');
error = document.querySelector('.emessage');
error.style.display = 'none';

transactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    accountNumber = document.querySelector('.accountHeader').id;
    accountNumber = Number(accountNumber);
    
    transactBtn = document.querySelector('.transactBtn');
    transactLink = document.querySelector('.transactLink')

    const { valid, inputs } = formatForm(transactForm);

    const description = inputs[0].value;
    const amount = Number(inputs[1].value);
    
    if(valid){return false;}
    addClass(transactBtn, 'spinner');
    formatCss(transactLink,'color','#F24259');
    transactBtn.disabled = true;
    
    const option = transactForm.querySelector('select') 
    const type = option.value;

    let transactApi;
    if (type === 'debit'){
        transactApi = baseApiRoute + `transactions/${accountNumber}/debit`
    } else transactApi = baseApiRoute + `transactions/${accountNumber}/credit`
    
    const response = await fetchCall(transactApi, 'POST', { description, amount })
    if(!response) {
      error.style.display = 'block';
      removeClass(transactBtn, 'spinner');
      formatCss(transactLink,'color','#fff');
      showError(error, 'error', 'Network Error', 'Connection to the server was lost');
      transactBtn.disabled = false;
      return false;
    }

    if(response.statusCode !== 200){
      error.style.display = 'block';  
      removeClass(transactBtn, 'spinner');
      formatCss(transactLink,'color','#fff');
      transactBtn.disabled = false;
      showError(error, 'error', 'Invalid Transaction', 'Insufficient Funds');
      return false;
    }
    
    error.style.display = 'block'; 
    showError(error, 'success','Done', 'Transaction successful');
    const account = await loadAccountDetails(baseApiRoute + '/accounts', undefined,'staff');
    await loadTranactionDetails(account);

    removeClass(transactBtn, 'spinner');
    formatCss(transactLink,'color','#fff');
    setTimeout(function(){ removeClass(dialog, 'dialog-scale'); }, 1500);
    setTimeout(function(){ dialog.close(); }, 2000);

    inputs[0].value = '';
    inputs[1].value = '';
});

accountdialog.addEventListener('click', async (event) => {
    if(event.target.textContent === 'Delete'){
        event.target.textContent = 'Confirm Delete';
    }else if(event.target.textContent === 'Confirm Delete'){
        const accountNumber = event.target.id;

        deleteBtn = document.querySelector('.deleteBtn');
        deleteLink = document.querySelector('.deleteLink')
        addClass(deleteBtn, 'spinner');
        formatCss(deleteLink,'color','#F24259');
    
        deleteBtn.disabled = true;
        const response = await fetchCall(baseApiRoute + `accounts/${accountNumber}`, 'DELETE')
        
        if(!response) {
            removeClass(deleteBtn, 'spinner');
            formatCss(deleteLink,'color','#fff');
            deleteBtn.disabled = false;
            return false;
        }
    
        if(response.statusCode !== 200){
            removeClass(deleteBtn, 'spinner');
            formatCss(deleteLink,'color','#fff');
            deleteBtn.disabled = false;
            return false;
          }
        removeClass(deleteBtn, 'spinner');
        formatCss(deleteLink,'color','#fff');
        formatHtml(deleteLink,'textContent','Deleted');
        setTimeout(function(){ }, 5000);
        
        const account = await loadAccountDetails(baseApiRoute + '/accounts', undefined,'staff');
        await loadTranactionDetails(account);
        
        removeClass(accountdialog, 'dialog-scale');
        setTimeout(function(){ accountdialog.close(); }, 300);
        deleteBtn.disabled = false;
    }
})

