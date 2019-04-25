var btn = document.querySelectorAll('.btn');
input = document.querySelector('#upload');
image = document.querySelector('#profileimg');
dialog = document.querySelector('dialog');

btn[2].addEventListener('click', (event) => {
    event.preventDefault();
    if(input.value){
        drawOnCanvas(input.files[0])
    }
});


btn[0].addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
        dialog.classList.add('dialog-scale');
})

function drawOnCanvas(filein) {
    let file = null;
    if(filein.type.match(/^image\//))
        file = filein;

    if(file){
        image.src = URL.createObjectURL(file);
    }
}

let close = document.querySelector('.close')

close.addEventListener('click',(event) => {
    dialog.close()
    dialog.classList.remove('dialog-scale');
})
