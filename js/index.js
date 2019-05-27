// A compilation of scripts to make UI components work

//get the modal, modal button close-modal buttona
const modal = document.querySelector('#ui-modal');
const modalBtn = document.querySelector('.ui-button');
const modalSpan = document.querySelector('.close');

window.onresize = function() {
    document.body.height = window.innerHeight;
}

modalBtn.onclick = () => {
    modal.style.display = "block";
}

modalSpan.onclick = () => {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if(event.target == modal){
        modal.style.display = "none";
    }
}

//resize the window immediately
window.onresize();