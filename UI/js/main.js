
let thisUser;
const userName = document.querySelector('.name');
const pictureDiv = document.querySelector('.username');
const profilepic = document.querySelector('.profilepic');
const accountli = document.querySelector('.accountsLiTag');
const transactionsDiv = document.querySelector('.transactions');
const transactHeader = document.querySelector('.transactheader');
const body = document.querySelector('main');
let email;

const getUserDetails = async () => {
    const response = await fetchCall(getUser, 'GET');
    if(!response) {
        body.innerHTML = bodyError;
        return false;
    }
    const { responseObj, statusCode } = response; 
    const {firstName, lastName, email, profilePic} = responseObj.data;
    formatHtml(userName, 'textContent', `${firstName} ${lastName}`)
    // formatHtml(profilepic, 'src', profilePic)
    
    var image = new Image;
    image.crossOrigin="anonymous"; /* THIS WILL MAKE THE IMAGE CROSS-ORIGIN */
    image.src = profilePic;
    pictureDiv.appendChild(image);

    return email;
};


window.addEventListener('load', async function() {
    email = await getUserDetails();
    if (!email) {
        return false;
    }
    const account = await loadAccountDetails(baseApiRoute + `user/${email}/accounts`);
    await loadTranactionDetails(account);
})

accountli.addEventListener('click', async (events) => {
    tag = events.path.find((event) =>
        event.tagName === 'LI')
    const accountNumber = tag.id;
    const status = tag.children[1].textContent;
    await loadTranactionDetails({accountNumber, status})
})