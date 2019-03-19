function addtoclass(activelink, uppperLimit, lowerLimit) {
    var winY = window.innerHeight || document.documentElement.clientHeight,
    distTop = home.getBoundingClientRect().top;
    distPercent = Math.round((distTop / winY) * 100);
    if (distPercent <= uppperLimit && distPercent >= lowerLimit) {
        activelink.className = 'nav-link active';
    }
    else activelink.className = 'nav-link';
}


let holdFlag = true;

function colornav(){
    if(Math.round(home.getBoundingClientRect().top) > -90)
    {
        nav.style.backgroundColor = 'transparent';

        nav.style.top = '0';
        
        logo.classList.remove("black");
        links.forEach((member) => {
            return member.classList.remove("black");
        });
        nav.classList.remove("applyshadow");
    }
    else {
        nav.style.backgroundColor = 'white';

        if(holdFlag === true){
            holdFlag = false;
            nav.style.top = '-500px';
            setTimeout(()=> {nav.style.top = '0px'}, 600);
        }

        links.forEach((member) => {
            return member.classList.add("black");
        });
        logo.classList.add("black");
        nav.classList.add("applyshadow");
    }
    if(Math.round(home.getBoundingClientRect().top) === 0)
        holdFlag = true;
}

var home = document.getElementById('home')
// var signup = document.getElementById('signup')
// var signin = document.getElementById('signin')
// var footer = document.getElementById('footer')
var links = document.querySelectorAll('.nav-link')
homelink = links[0];
signuplink = links[1];
signinlink = links[2];
footerlink = links[3];
let nav = document.querySelector('.custom-nav')
let logo = document.querySelector('.logo')
let navbar = document.querySelector('nav');

nav.addEventListener('click' ,function() {
    addtoclass(homelink, 0, -90) // as top of element hits top of viewport
    addtoclass(signuplink, -225, -326);
    addtoclass(signinlink, -326, -350);
    addtoclass(footerlink, -350, -400);
    colornav();
}, false);

window.addEventListener('scroll', function() {
    addtoclass(homelink, 0, -90) // as top of element hits top of viewport
    addtoclass(signuplink, -225, -326);
    addtoclass(signinlink, -326, -350);
    addtoclass(footerlink, -350, -400);
    colornav();
}, false);

$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});