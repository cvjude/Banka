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

const formatCss = (tag, attribute, value) => {
    tag.style[attribute] = value;
}

const formatHtml = (tag, attribute, value) => {
    tag[attribute] = value;
}