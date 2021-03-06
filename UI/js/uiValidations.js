const inputs = document.querySelectorAll('input');

const patterns = {
    email: /^(\s*[\w.-]+)@([a-zA-Z\d]{3,8})\.([a-z]{3,8}\s*)$/,
    password: /^\w{6,}$/,
    description:/^[a-zA-Z\d\s]{0,30}$/,
    firstName: /^[a-zA-Z]{3,}$/,
    lastName: /^[a-zA-Z]{3,}$/,
    signupEmail: /^([\w.-]+)@([a-zA-Z\d]{3,8})\.([a-z]{3,8})$/,
    signupPassword: /^\w{6,}$/,
    openingbalance: /^\d{3,}$/,
    amount: /^\d{1,}$/,
};

function validate(field, Regex){
    if(Regex.test(field.value)){
        field.className = 'valid';
    } else {
        field.className = 'invalid';
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', (event) => {
        validate(event.target, patterns[event.target.attributes.name.value])
    });
});


