const { token } = localStorage;

const fetchCall = async (url, method, data = undefined) => {
    const object = {
        method,
        headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token
        }),
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch(url, object);
        const statusCode = response.status;
        const responseObj = await response.json();
        return { responseObj, statusCode };
    } catch (err) {
        console.log(err);
    }
};

const loggedUser = () => {
    return ;
}

const removeClass = (tag, className) => {
    tag.classList.remove(className);
};

const addClass = (tag, className) => {
    tag.classList.add(className);
};

const goToPage = (url) => {
    window.location.href = url;
};

const createElement = (tag) => {
    return document.createElement(tag);
}

const formatCss = (tag, attribute, value) => {
    tag.style[attribute] = value;
}

const formatHtml = (tag, attribute, value) => {
    tag[attribute] = value;
}

const showError = (tag, messageType, errorType, errorMessage) => {
    while (tag.firstChild) {
        tag.firstChild.remove();
    }
    if (messageType === 'error') {
        formatCss(tag, 'color', '#F24259')
    }
    else formatCss(tag, 'color', 'green')
    const ErrorType = createElement('p');
    ErrorType.className = 'errorType';
    ErrorType.textContent = errorType;
    const ErrorMessage =  createElement('p');
    ErrorMessage.className = 'errorMessage';
    ErrorMessage.textContent = errorMessage;

    
    if (messageType === 'error') {
        formatCss(ErrorType, 'color', '#F24259')
    }
    else formatCss(ErrorType, 'color', 'green')

    tag.appendChild(ErrorType);
    tag.appendChild(ErrorMessage);
    addClass(tag, 'grow-error');
}


const formatError = () => {
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    'December'
];

const formatDate = (thedate) => {
    const date = new Date(thedate);
    const day = date.getDate()
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return { day, month, year };
}
// const fullAccountSchema =
// `
//     <div>
//         <dt>Account number:</dt>
//         <dd>${accountNumber}</dd>
//         <dt>Balance:</dt>
//         <dd>${balance}</dd>
//         <dt>Created:</dt> 
//         <dd>${date.day}th ${date.month} ${date.year}</dd>
//         <dt>Transactions conducted:</dt>
//         <dd>${count}</dd>
//     </div>
//     <div class = "before b${status}">${status}</div>
//     `;

const bodyError = `
<div class = wrong>
    <div>
        <p>Ops!</p>
        <p>Sorry something Went wrong, Try again</p>
    </div>
</div>`;

const noAccountErrorSchema = `
    <div class = noaccount>
      <div>
        <p>No account Yet</p>
        <p>Create an account in with the account button, on the profile page</p>
      </div>
    </div>
`;

const accountErrorNetwork = `
<div class = noaccount>
  <div>
    <p>Network Error</p>
    <p>We are having trouble connecting, please Try again</p>
  </div>
</div>`;

const notransactionError = `
<section class = notransaction >
    <div>
    <p>Welcome to Banka</p>
    <p>No transactions yet</p>
    </div>
</section>`;

const transactionError = `
<section class = notransaction >
    <div>
    <p>Network Error</p>
    <p>We are having trouble connecting please try again</p>
    </div>
</section>`;

const transactionHeaderSchema = (data) => {
    const {accountNumber, status} = data;
    return `
    <h4>Transactions</h4>
    <ul class = navbar-nav>
        <li>${accountNumber}</li>
        <li class = "before b${status}">${status}</li>
    </ul>
    `
}
const singleAccountSchema = (data) => {
    const { accountNumber, status, balance } = data;
    return `<li id = ${accountNumber}>
        <div id = ${status}>
            <dt>Account number:</dt>
            <dd>${accountNumber}</dd>
            <dt>Balance:</dt>
            <dd>${balance}</dd>
        </div>
        <div class = "before b${status}">${status}</div>
    </li>`
}

const detailedAccountSchema = (datas, transactions) => {
    const { accountNumber, status, createdOn } = datas;
    const date = formatDate(createdOn);
    return `
    <li id = ${accountNumber}>
        <div id = ${status}>
            <dt>Account number:</dt>
            <dd>${accountNumber}</dd>
            <dt>Balance:</dt>
            <dd>${status}</dd>
            <dt>Created:</dt> 
            <dd>${date.day}th ${date.month} ${date.year}</dd>
            <dt>Transactions conducted:</dt>
            <dd>${transactions}</dd>
        </div>
        <div class = "before b${status}">${status}</div>
    </li>`
}

const TransactionSchema = (data) => {
    const { createdOn, type, amount, oldBalance, newBalance, description } = data;
        const date = formatDate(createdOn);
    return ` <div>
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
            </div>`
}

const TransactionDetailsShema = (datas) => {
    let debits = datas.filter(data => {
        if(data.type === 'debit')
            return data;
    });
    let credits = datas.filter(data => {
        if(data.type === 'credit')
            return data;
    });

    debits = debits.reduce(function(a, debit){
        return a + debit.amount
      }, 0);

    credits = credits.reduce(function(a, credit){
    return a + credit.amount
    }, 0);
    return ` <div>
        <dt>Total Transactions:</dt>
        <dd>${datas.length}</dd>
        <dt>Total debits:</dt>
        <dd>${debits}</dd>
        <dt>Total Credits:</dt> 
        <dd>${credits}</dd>
    </div>`
}

const loadAccountDetails = async (url, detailType = 'nonDetailed') => {
    console.log(url);
    const fetched = await fetchCall(url, 'GET');

    if(!fetched || fetched.statusCode === 500) {
        accountli.innerHTML = accountErrorNetwork;
        return false;
    }

    const { responseObj, statusCode } = fetched
    const { data } = responseObj;

    if(!data) {
        accountli.innerHTML = noAccountErrorSchema;
        return false;
    }

    if(statusCode !== 200) {
        accountli.innerHTML = noAccountErrorSchema;
        return false;
    }

    
    let accounthtml = ''
    for (const datas of data) {
        if(detailType === 'nonDetailed')
            accounthtml +=  singleAccountSchema(datas);
        else {       
            const fetched = await fetchCall(baseApiRoute + `/accounts/${datas.accountNumber}/transactions`, 'GET');
            let transactions;
            if(fetched.responseObj.data) { transactions = fetched.responseObj.data.length}
            else transactions = 0;
            accounthtml += detailedAccountSchema(datas, transactions);
        }
    };
    accountli.innerHTML = accounthtml;
    return data[0];
};

const loadTranactionDetails = async (account, details = 'notFirst') => {
    addClass(transactionsDiv, 'spinner1');
    if(!account) {
        transactionsDiv.innerHTML = notransactionError;
        removeClass(transactionsDiv, 'spinner1');
        return false;
    }

    const {accountNumber, status} = account;
    const fetched = await fetchCall(baseApiRoute + `/accounts/${accountNumber}/transactions`, 'GET');
    
    if(!fetched || fetched.statusCode === 500) {
        transactionsDiv.innerHTML = transactionError;
        removeClass(transactionsDiv, 'spinner1');
        return false;
    }

    const { responseObj, statusCode } = fetched
    const { data } = responseObj;

    transactHeader.innerHTML = transactionHeaderSchema(account);

    if(!data) {
        transactionsDiv.innerHTML = notransactionError;
        removeClass(transactionsDiv, 'spinner1');
        return false;
    }

    let transacthtml = ''

    if (details === 'notFirst')
    {
        data.forEach(datas => {
            transacthtml += TransactionSchema(datas);
        });
    }
    else transacthtml = TransactionDetailsShema(data) + TransactionSchema(data[0]);
    removeClass(transactionsDiv, 'spinner1');
    transactionsDiv.innerHTML = transacthtml;
};