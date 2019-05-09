accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');
adddialog = document.querySelector('#addaccount');
deactivate = document.querySelector('.deactivate');

accounts = document.querySelector('.accounts');
accountdialog = document.querySelector('#showaccount');

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
        <h4>Admin</h4>
        <div class = "username applyshadow">
            <div class = "initals">
                <div>A</div>
            </div>
        </div>
        <p class = "black">Admin ${firstName}</p>
        <small>${email}</small>
    `;
    return email;
};

window.addEventListener('load', async function() {
    email = await getUserDetails();
    if (!email) {
        return false;
    }
    const account = await loadAccountDetails(baseApiRoute + '/accounts', undefined,'admin');
    await loadTranactionDetails(account);
})

accountform = document.querySelector('#accountDetails');
let the_status;
accountli.addEventListener('click', async (events) => {
    tag = events.path.find((event) =>
        event.tagName === 'LI')
    const accountNumber = tag.id;
    let status = tag.children[1].textContent;
    if(status.includes('active'))
        status = 'active';
    else status = 'dormant';

    the_status = status;
    
    if (events.target.id === `dl${accountNumber}`) {
        accountdialog.showModal();
        addClass(accountform, 'spinner')
        await loadAccountDetail(baseApiRoute + `/accounts/${accountNumber}`, 'admin', accountform, status)

        accountdialog.classList.add('dialog-scale');
    }
    else await loadTranactionDetails({accountNumber, status});
})

document.getElementById("opendialog").addEventListener("click",function(e) {
    adddialog.showModal();
    adddialog.classList.add('dialog-scale');
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
        
        const account = await loadAccountDetails(baseApiRoute + '/accounts', undefined,'admin');
        await loadTranactionDetails(account);
        
        setTimeout(function(){ removeClass(accountdialog, 'dialog-scale'); }, 1500);
        setTimeout(function(){ accountdialog.close(); }, 2000);
        deleteBtn.disabled = false;
    }
});

accountdialog.addEventListener('click', async (event) => {
    if(event.target.textContent === 'Deactivate' || event.target.textContent === 'Activate'){
        event.target.textContent = 'Confirm';
    }else if(event.target.textContent === 'Confirm'){
        const accountNumber = event.target.id;

        deleteBtn = document.querySelector('.deactiveBtn');
        deleteLink = document.querySelector('.deactiveLink')
        addClass(deleteBtn, 'spinner');
        formatCss(deleteLink,'color','#F24259');
    
        deleteBtn.disabled = true;
        const response = await fetchCall(baseApiRoute + `account/${accountNumber}`, 'PATCH', {status: the_status})
        
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
        formatHtml(deleteLink,'textContent','Done');
        
        const account = await loadAccountDetails(baseApiRoute + '/accounts', undefined,'admin');
        await loadTranactionDetails(account);
        
        
        setTimeout(function(){ removeClass(accountdialog, 'dialog-scale'); }, 1500);
        setTimeout(function(){ accountdialog.close(); }, 2000);
        deleteBtn.disabled = false;
    }
});

const signupForm = document.querySelector('.accountform');


signupForm.addEventListener('submit',async (event) => {
    event.preventDefault();
    const { valid, inputs } = formatForm(signupForm);
  
    signupFormbutton = document.querySelector('#staffBtn');
    signupFormlink = document.querySelector('#staffLink');
    signupErrorDiv = document.querySelector('.emessage');

    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const email = inputs[2].value;
    const password = inputs[3].value;
  
    const option = signupForm.querySelector('select') 
    const type = option.value;

    if(type === 'Admin')
        isadmin = true;
    else isadmin = false;
        
    if(valid){return false;}
    addClass(signupFormbutton, 'spinner');
    formatCss(signupFormlink,'color','#F24259');
    signupFormbutton.disabled = true;
  
    const response = await fetchCall(baseApiRoute + `user/signup/${isadmin}`, 'POST', {firstName, lastName, email, password})
    
    if(!response) {
      removeClass(signupFormbutton, 'spinner');
      formatCss(signupFormlink,'color','#fff');
      showError(signupErrorDiv, 'error', 'Network Error', 'Connection to the server was lost');
      signupFormbutton.disabled = false;
      return false;
    }
  
    const { responseObj, statusCode } = response;
  
    if(statusCode !== 201){
      removeClass(signupFormbutton, 'spinner');
      formatCss(signupFormlink,'color','#fff');
      signupFormbutton.disabled = false;
      if(statusCode === 409) {    
        return showError(signupErrorDiv, 'error', 'Signup Error', 'The email is already taken');
      }
      showError(signupErrorDiv, 'error', 'Network Error', 'The connection to server was lost');
      return false;
    }
    
    showError(signupErrorDiv, 'success','Registered Successful', 'Done');
    
    setTimeout(function(){ removeClass(adddialog, 'dialog-scale'); }, 1500);
    setTimeout(function(){ adddialog.close(); }, 2000);
  });