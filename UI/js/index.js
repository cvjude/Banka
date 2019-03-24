let holdFlag = true;

function colornav(){
    if(Math.round(home.getBoundingClientRect().top) > -90)
    {
        nav.style.backgroundColor = 'transparent';

        nav.style.top = '0';
        
        logo.classList.remove("addcolor");
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
        logo.classList.add("addcolor");
        nav.classList.add("applyshadow");
    }
    if(Math.round(home.getBoundingClientRect().top) === 0)
        holdFlag = true;
}

var home = document.getElementById('home')
var signup = document.getElementById('signup')
var signin = document.getElementById('signin')
var footer = document.getElementById('footer')
var links = document.querySelectorAll('.nav-link')
let nav = document.querySelector('.custom-nav')
let logo = document.querySelector('.logo')
let navbar = document.querySelector('nav');


function Get_Offset_From_Start (object, offset) { 
  offset = offset || {x : 0, y : 0};
  offset.x += object.offsetLeft;       offset.y += object.offsetTop;
  if(object.offsetParent) {
      offset = Get_Offset_From_Start (object.offsetParent, offset);
  }
  return offset;
}

function Get_Offset_From_CurrentView (myElement) {
  if (!myElement) return;
  var offset = Get_Offset_From_Start (myElement);
  var scrolled = GetScrolled (myElement.parentNode);
  var posX = offset.x - scrolled.x;   var posY = offset.y - scrolled.y;
  return posY;
}
//helper
function GetScrolled (object, scrolled) {
  scrolled = scrolled || {x : 0, y : 0};
  scrolled.x += object.scrollLeft;    scrolled.y += object.scrollTop;
  if (object.tagName.toLowerCase () != "html" && object.parentNode) { scrolled=GetScrolled (object.parentNode, scrolled); }
  return scrolled;
}

let a = [home, signin, signup, footer];

// live monitoring
window.addEventListener('scroll', function (evt) {
    var count = 0;

    a.forEach((member) => {
      var position = Get_Offset_From_CurrentView(member);
      if(position <= 0.77 && position >= -100){
        links[count].className = 'nav-link active';
      }
      else links[count].className = 'nav-link';
      if(member == footer){
        if(position < 593)
        {
          links[count].className = 'nav-link active';
        }
        else links[count].className = 'nav-link';
      }
      count++;
    })
    colornav();
});

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