var btn = document.querySelectorAll('.btn');
input = document.querySelector('#upload');
image = document.querySelector('#profileimg');
dialog = document.querySelector('dialog');
body = document.querySelector('main');
userName = document.querySelector('.nameplate');
const accountli = document.querySelector('.accountsLiTag');
const transactionsDiv = document.querySelector('.transactions');
const transactHeader = document.querySelector('.transactheader');

btn[2].addEventListener('click', async (event) => {
    event.preventDefault();
    if(input.value){
        await drawOnCanvas(input.files[0])
    }
});

console.log(btn)



btn[0].addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
        dialog.classList.add('dialog-scale');
})


let imageBtn = document.querySelector('.imageBtn');
let imageLink = document.querySelector('#imageLink');

async function drawOnCanvas(filein) {
    addClass(imageBtn, 'spinner');
    formatCss(imageLink,'color','#F24259');
    let file = null;

    if(filein.type.match(/^image\//))
        file = filein;

    const dataform = {
        method: 'POST',
        headers: new Headers({
        Authorization: 'Client-ID fa08416964142d4',
        }),
        body: filein,
    };
    const imgurApiUrl = 'https://api.imgur.com/3/image';
    
    const response = await fetch(imgurApiUrl, dataform);
    const result = await response.json();
    const imgUrl = result.data.link;


    const { statusCode } = await fetchCall(uploadURL, 'PATCH', { profilePic: imgUrl });

    removeClass(imageBtn, 'spinner');
    formatCss(imageLink,'color','#fff');

    if(file){
        image.src = URL.createObjectURL(file);
    }
}

let close = document.querySelector('.close')

close.addEventListener('click',async (event) => {
    removeClass(dialog, 'dialog-scale');
    setTimeout(function(){ dialog.close(); }, 300);
})

accountForm = document.querySelector('.accountform');
error = document.querySelector('.error');
let createAccountBtn = document.querySelector('.accountBtn');
let accountLink = document.querySelector('#accountlink');
let AccountDiv = document.querySelector('.accountMessage');
let accountFlag = false;

accountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let input = accountForm.querySelector('input');
    if(input.className === 'valid' && input.value < 999.99){
        return error.style.display = 'block';
    }
      
    const option = accountForm.querySelectorAll('option') 
    const type = option[1].textContent;
    let openingBalance = input.value;
    addClass(createAccountBtn, 'spinner');
    formatCss(accountLink,'color','#F24259');

    createAccountBtn.disabled = true;
    const response = await fetchCall(createAccount, 'POST', { type, openingBalance })
    
    if(!response) {
        removeClass(createAccountBtn, 'spinner');
        formatCss(accountLink,'color','#fff');
        showError(AccountDiv, 'error', 'Network Error', 'Connection to the server was lost');
        createAccountBtn.disabled = false;
        return false;
    }

    const { responseObj, statusCode} = response;
    const { data } = responseObj;
    if(statusCode !== 201){
        removeClass(createAccountBtn, 'spinner');
        formatCss(accountLink,'color','#fff');
        showError(AccountDiv, 'error', 'Network Error', 'The connection to server was lost');
        createAccountBtn.disabled = false;
        return false;
      }
    showError(AccountDiv, 'success', 'Press 0k to continue', `Account number: ${data.accountNumber}`);
    removeClass(createAccountBtn, 'spinner');
    formatCss(accountLink,'color','#fff');
    formatHtml(accountLink,'textContent','Ok');
    accountFlag = true;
    createAccountBtn.disabled = false;
    error.style.display = 'none';
});

createAccountBtn.addEventListener('click', async() => {
    if(accountFlag === true) {
        removeClass(dialog, 'dialog-scale');
        setTimeout(function(){ dialog.close(); }, 300);
        const account = await loadAccountDetails(baseApiRoute + `user/${email}/accounts`, 'detailed');
        await loadTranactionDetails(account, 'first');
        formatHtml(accountLink,'textContent','Create');
        input.value = '';
    }
    accountFlag = false;
})

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

    userName.innerHTML = `
    <div>
        <dt>First name:</dt>
        <dd>${firstName}</dd>
        <dt>Last name:</dt>
        <dd>${lastName}</dd>
        <dt>Email:</dt>
        <dd>${email}</dd>
    </div>`
    const imagePlace = document.querySelector('.profileimg');
    const imageTag = document.querySelector('#profileimg')
    // formatHtml(imagePlace, 'src', profilePic)
    
    var image = new Image;
    image.crossOrigin="anonymous"; /* THIS WILL MAKE THE IMAGE CROSS-ORIGIN */
    image.src = profilePic;
    // pictureDiv.appendChild(image);
    
    imagePlace.replaceChild(image, imageTag);
    

    return email;
};



window.addEventListener('load', async function() {
    email = await getUserDetails();
    if (!email) {
        return false;
    }
    const account = await loadAccountDetails(baseApiRoute + `user/${email}/accounts`, 'detailed');
    await loadTranactionDetails(account, 'first');
})

accountli.addEventListener('click', async (events) => {
    tag = events.path.find((event) =>
        event.tagName === 'LI')
    const accountNumber = tag.id;
    const status = tag.children[1].textContent;
    await loadTranactionDetails({accountNumber, status}, 'first')
})