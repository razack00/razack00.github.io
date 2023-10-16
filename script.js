function switchPage(newPage) {
    const pages = document.querySelectorAll('.page')
    // const project_sec = document.querySelector('.project-section') 
    pages.forEach(page => {
        page.style.display = "none"
    })

    // checking to see if newPage is equal to any categories, in which case project display flex in other for categories to display on it
    if(newPage == 'webdev' || newPage == 'design' || newPage == 'others') {
        document.querySelector('.project-section').style.display = 'flex'
    }else if(newPage == "project-section") {
        document.querySelector('.webdev').style.display = 'flex'
    }

    // displaying current page
    const currentPage = document.querySelector(`.${newPage}`)
    currentPage.style.display = 'flex'


    document.querySelectorAll(".link").forEach((a) => {
        a.classList.remove("active");
    });
    
    // //add the active class to the nav link that corresponds to the page
    document.querySelector(`.link[data-page="${newPage}"]`).classList.add("active");
    console.log(newPage)
}

// navbar background visibility on scroll functionality    
function scrolled() {
    const nav = document.querySelector('header')
    if (window.scrollY > 100) {
            nav.classList.add('scrolled')
    }else {
            nav.classList.remove('scrolled')
    }
}

document.addEventListener('DOMContentLoaded', () => {

      //add logic for toggling the menu
    const menu = document.querySelector(".mobile-nav");
    const menuToggle = document.querySelector(".menu-btn");
    menuToggle.onclick = () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    };

    //hide the menu on bigger screens
    window.onresize = () => {
        if (window.innerWidth > 768) {
            menu.style.display = "none"
        }
    }

    // page switching
    switchPage('hero-section')
    const links = document.querySelectorAll('.link, .mobile-nav li, .logo')
    links.forEach(link => {  
        link.onclick = (e) => {
            menu.style.display = 'none'
            page = e.target.dataset.page
                switchPage(page)
        }
    })

    // creating spans for hover effect on hero title
    const title = document.querySelector('.intro')
    const text = "FrontendDeveloper &ITSupport".split(" ")
    text.forEach(function(word) {
        let chars = word.split('')
        let div = document.createElement('div')
        chars.forEach(char => {
            let span = document.createElement('span')
            span.textContent = char
            div.appendChild(span)
        })
        title.appendChild(div)
    })

    // spans for cursor rotation
    const cursortext = document.querySelector('.cursor');
    cursortext.innerHTML = cursortext.textContent.replace(/\S/g, "<span>$&</span>")

    const element = document.querySelectorAll('.cursor span')
    for(let i = 0; i<element.length; i++){
        element[i].style.transform = "rotate("+i*12.2+"deg)"
    }

    // mouse follow functionality
    let cursor = document.querySelector('.cursor')
    document.addEventListener('mousemove', (e) => {
        cursor.style.cssText =  'left: ' + (e.clientX+30) + 'px; top: ' + (e.clientY+40) + 'px;';
    })

    // Project hover effect
    const projects = document.querySelectorAll('.project')
    const projectContent = document.querySelectorAll('.project-content')
    projects.forEach(project => {
        project.onmouseover = () => {
            project.lastElementChild.style.display = 'flex'
        }
        project.onmouseout = () => {
            project.lastElementChild.style.display = 'none'
        }
    })

    // navbar background visibility on scroll 
    window.addEventListener('scroll', function() {
        scrolled()
    })
})