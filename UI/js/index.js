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

let home = document.getElementById('home')
let signup = document.getElementById('signup')
let signin = document.getElementById('signin')
let footer = document.getElementById('footer')
let links = document.querySelectorAll('.nav-link')
let nav = document.querySelector('.custom-nav')
let logo = document.querySelector('.logo')
let navbar = document.querySelector('nav');
let body = document.querySelector('body')

let signupForm = document.getElementById('signupForm');
let signinForm = document.getElementById('signinForm');

function formatForm(tag){
  event.preventDefault();
  let inputs = tag.querySelectorAll('input');
  const elements = Array.from(inputs)
  const valid = elements.find(element => {
    return element.className === 'invalid';
  });
  if(!valid){
    body.classList.add('spinner');
    window.location.href = "main.html";
  }
}

signupForm.addEventListener('submit', (event) => {
  formatForm(signupForm);
});

signinForm.addEventListener('submit', (event) => {
  formatForm(signinForm);
});

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


//https://perishablepress.com/vanilla-javascript-scroll-anchor/
(function() {
	scrollTo();
})();

function scrollTo() {
	var links = document.getElementsByTagName('a');
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		if ((link.href && link.href.indexOf('#') != -1) && ((link.pathname == location.pathname) || ('/' + link.pathname == location.pathname)) && (link.search == location.search)) {
			link.onclick = scrollAnchors;
		}
	}
}

function scrollAnchors(e, respond = null) {
	const distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
	e.preventDefault();
	var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
	const targetAnchor = document.querySelector(targetID);
	if (!targetAnchor) return;
	const originalTop = distanceToTop(targetAnchor);
	window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
	const checkIfDone = setInterval(function() {
		const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
		if (distanceToTop(targetAnchor) === 0 || atBottom) {
			targetAnchor.tabIndex = '-1';
			targetAnchor.focus();
			window.history.pushState('', '', targetID);
			clearInterval(checkIfDone);
		}
	}, 100);
}
