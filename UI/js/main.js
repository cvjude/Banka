
let thisUser;
const userName = document.querySelector('.name');
const profilepic = document.querySelector('.profilepic');
const accountli = document.querySelector('.accountsLiTag');
const transactionsDiv = document.querySelector('.transactions');
const transactHeader = document.querySelector('.transactheader');
const body = document.querySelector('main');
let email;

const getUserDetails = async () => {
    const response = await fetchCall(getUser, 'GET');
    if(!response) {
        body.innerHTML = `
        <div class = wrong>
            <div>
                <p>Ops!</p>
                <p>Sorry something Went wrong, Try again</p>
            </div>
        </div>`
        return false;
    }
    const { responseObj, statusCode } = response; 
    const {firstName, lastName, email, profilePic} = responseObj.data;
    formatHtml(userName, 'textContent', `${firstName} ${lastName}`)
    formatHtml(profilepic, 'src', profilePic)
    return email;
};

const loadAccountDetails = async () => {
    const fetched = await fetchCall(baseApiRoute + `user/${email}/accounts`, 'GET');

    if(!fetched || fetched.statusCode === 500) {
        accountli.innerHTML = `
        <div class = noaccount>
            <p>Network Error</p>
            <p>We are having trouble connecting, please Try again</p>
        </div>`
        return false;
    }

    const { responseObj, statusCode } = fetched
    const { data } = responseObj;

    if(!data) {
        accountli.innerHTML = `
            <div class = noaccount>
                <p>No accounts yet</p>
                <p>Go to your profile page and create an account</p>
            </div>`
            ;
        return false;
    }



    if(statusCode !== 200) {
        accountli.innerHTML = `
            <div class = noaccount>
                <p>No accounts yet, Go to your profile page and create an account</p>
            </div>`
            ;
        return false;
    }

    let accounthtml = ''
    data.forEach(datas => {
        const { accountNumber, status, balance } = datas;
        accounthtml += `
        <li id = ${accountNumber}>
            <div id = ${status}>
                <dt>Account number:</dt>
                <dd>${accountNumber}</dd>
                <dt>Balance:</dt>
                <dd>${balance}</dd>
            </div>
            <div class = "before b${status}">${status}</div>
        </li>`;
    });
    accountli.innerHTML = accounthtml;
    return data[0];
};

const loadTranactionDetails = async (account) => {
    addClass(transactionsDiv, 'spinner1');
    if(!account) {
        transactionsDiv.innerHTML = `
        <section class = notransaction >
            <div>
            <p>Welcome to Banka</p>
            <p>Create accounts in the profile page</p>
            </div>
        </section>`;
        removeClass(transactionsDiv, 'spinner1');
        return false;
    }

    const {accountNumber, status} = account;
    const fetched = await fetchCall(baseApiRoute + `/accounts/${accountNumber}/transactions`, 'GET');
    
    if(!fetched || fetched.statusCode === 500) {
        transactionsDiv.innerHTML = `
        <section class = notransaction >
            <div>
            <p>Network Error</p>
            <p>We are having trouble connecting please try again</p>
            </div>
        </section>`
        removeClass(transactionsDiv, 'spinner1');
        return false;
    }

    const { responseObj, statusCode } = fetched
    const { data } = responseObj;

    if(!data) {
        transactionsDiv.innerHTML = `
        <section class = notransaction >
            <div>
            <p>Welcome to Banka</p>
            <p>There are no Transactions for this account</p>
            </div>
        </section>`;
        removeClass(transactionsDiv, 'spinner1');
        return false;
    }
    
    transactHeader.innerHTML = `
    <h4>Transactions</h4>
    <ul class = navbar-nav>
        <li>${accountNumber}</li>
        <li class = "before b${status}">${status}</li>
    </ul>
    `;

    let transacthtml = ''
    data.forEach(datas => {
        const { createdOn, type, amount, oldBalance, newBalance, description } = datas;
        const date = formatDate(createdOn);
        transacthtml += `
        <div>
            <p>${date.day}th ${date.month} ${date.year}</p>
            <div class = "spacebetween">
                <span>
                    <h4>${description}</h4>
                    <small class = "${type}">${amount}</small>
                </span>
                <span>
                    <p>Old balance: ${oldBalance}</p>
                    <p>Current Balance: ${newBalance}</p>
                </span>
            </div>
        </div>`;
    });
    removeClass(transactionsDiv, 'spinner1');
    transactionsDiv.innerHTML = transacthtml;
};

window.addEventListener('load', async function() {
    email = await getUserDetails();
    if (!email) {
        return false;
    }
    const account = await loadAccountDetails();
    await loadTranactionDetails(account);
})

accountli.addEventListener('click', async (events) => {
    tag = events.path.find((event) =>
        event.tagName === 'LI')
    const accountNumber = tag.id;
    const status = tag.children[1].textContent;
    await loadTranactionDetails({accountNumber, status})
})
// const response = await fetchCall('/user/:email/accounts', 'POST', {email, password})