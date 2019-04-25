const { token } = localStorage;

const fetchCall = async (url, method, data = undefined) => {
    const object = {
        method,
        headers: new Headers({
        'Content-Type': 'application/json',
        token,
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