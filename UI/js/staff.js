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

accountli.addEventListener('click', async (events) => {
    tag = events.path.find((event) =>
        event.tagName === 'LI')
    const accountNumber = tag.id;
    const status = tag.children[1].textContent;
    if (events.target.id === `dl${accountNumber}`) {
        accountdialog.showModal();
        accountdialog.classList.add('dialog-scale');
    }
    else if (events.target.id===`tl${accountNumber}`) {
        dialog.showModal();
        dialog.classList.add('dialog-scale');
    }
    else await loadTranactionDetails({accountNumber, status});
})

accountdialog.addEventListener('click', (event) => {
    console.log(event.target.id)
})

