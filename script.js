function switchPage(newPage) {
    const pages = document.querySelectorAll('.page')
    // const project_sec = document.querySelector('.project-section') 
    pages.forEach(page => {
        page.style.display = "none"
    })

    // displaying current page
    const currentPage = document.querySelector(`.${newPage}`)
    currentPage.style.display = 'flex'

    document.querySelectorAll(".main-links .link").forEach((a) => {
        a.classList.remove("active");
    });
    
    // //add the active class to the nav link that corresponds to the page
    document.querySelector(`.link[data-page="${newPage}"]`).classList.add("active");
}

// reusable function for fetchning data
const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function displayCategories() {
    const categoriesContainer = document.querySelector('.categories')
    const categoryList = await fetchData('http://localhost:8000/categoryList')
    categoriesContainer.innerHTML = categoryList.categories.map(category => {  
        // on first render, the element with category = All is rendered with active class and others are not
        if(category == "All") {
            return `<li class="category active link">${category}</li>`
        }
        return `<li class="category link">${category}</li>`        
    }).join('')
} 


async function setCategory() {
    const projects = await fetchData('http://localhost:8000/projects')    
    displayProjects(projects) //first render
    const categories = document.querySelectorAll('.category') 
    let selectedCategory = ''
    categories.forEach(category => (
        category.onclick = (e) => {
            categories.forEach(cat => cat.classList.remove('active')) //remove active class from all categories
            category.classList.add('active') //add active class to clicked category
            selectedCategory = e.target.textContent
            if(selectedCategory === "All") {
                displayProjects(projects) // display all cats when selected category == All
            }
            else {
                const filteredProjects = projects.filter(project => project.category == selectedCategory)
                displayProjects(filteredProjects) //display only selected categories
            }
        }
    ))
}

// Display project
function displayProjects (projects) {
    document.querySelector('.projects').innerHTML = projects.map(project => (
        `<li data-id=${project.id} class="project">
            <img src=${project.image} alt="project image">
            <div class="project-content" data-id=${project.id}>
                <h3 class="project-title">${project.name}</h3>
                <p>${project.about}</p>
            </div>
        </li>`
    )).join("")
    projectHoverEffect()
    filterProject() // attaches onclick event to all projects
}

// Display selected projects in the modal
function displayProjectDetails(selectedProject) {
    document.querySelector('.modal-container').innerHTML = (
        `<div class="modal">
        <div class="modal-header">
            <button class="modal-close-btn" type="button">x</button>
            <h1 class="modal-title">${selectedProject[0].name}</h1>
        </div>
        <img src=${selectedProject[0].image} alt="">
        <div class="technologies">
            <div>
                ${selectedProject[0].technologies.map(tech => (
                    `<span>${tech}</span>`
                )).join("")}
            </div>
            <div class="modal-links">
                <a href=${selectedProject[0].site_link}>live</a>
                <a href=${selectedProject[0].github_link}>Github</a>
            </div>
        </div>
        <div class="modal-about">
            <h3 class="modal-subtitle" >About</h3>
            <p>${selectedProject[0].about}</p>
        </div>
        <div class="challenges">
            <h3 class="modal-subtitle">Functionalities</h3>
            ${selectedProject[0].functionalities.map(func => (
                `<p>${func}</p>`
            )).join("")}
        </div>
        <div class="modal-links">
            <a href=${selectedProject[0].site_link}>live</a>
            <a href=${selectedProject[0].github_link}>Github</a>
        </div>
    </div>`
    )
}

function filterProject() {
    const projects = document.querySelectorAll('.project')
    projects.forEach(project => (
        project.onclick = async (e) => {
            const projectList = await fetchData('http://localhost:8000/projects')
            const clickedProjectId = e.target.parentElement.dataset.id
            const selectedProject = projectList.filter(project => project.id == clickedProjectId)
            displayProjectDetails(selectedProject)
            handleModalClose() // this attaches an onclick event to the modal-close-btn

            // show modal with project details when project is clicked
            document.querySelector('.modal').classList.add('modal-show')
        }
    ))
}

function handleModalClose() {
    const modalCloseBtn = document.querySelector('.modal-close-btn')
    const modal = document.querySelector('.modal')
    modalCloseBtn.onclick = () => {
        modal.style.display = 'none'
    }

    modal.onblur = () => {
        modal.style.display = 'none'
    }
}

async function displayBlogs () {
    const blogs = await fetchData('http://localhost:8000/blogs')
    document.querySelector('.blogs').innerHTML = blogs.map(blog => (
        `<li data-id=${blog.id}>
            <a data-id=${blog.id} data-page="blogDetails-section" href="#blogDetails" class="blog-post link">
                <img src=${blog.image} alt="blog post">
                <div data-id=${blog.id} class="blog-post-content">
                    <h2>${blog.title}</h2>
                    <p>${blog.body}... </p>
                </div>
            </a>
        </li>` )
    ).join("")
    filterBlog() // attaches an onclick event to each blog for filtering when clicked
    pageSwitching() // attaches pageswitch functionality to each blog to this in blog details section
}

function displayBlogDetails(blog) {
    console.log("blog, ", blog)
    document.querySelector('.blogDetails-section').innerHTML = (
        `<div>
            <div>
                <h1 class="modal-title">${blog[0].title}</h1>
            </div>
            <img src=${blog[0].image} alt="">
            <p>${blog[0].body}</p>
            <p>dfsdffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            <p>dfsdffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            <p>dfsdffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</p>
            
        </div>`
    )
}

// attach an onclick event to each blog for filtering when clicked
async function filterBlog() {
    const blogs = document.querySelectorAll('.blog-post')
    blogs.forEach(blog => (
        blog.onclick = async (e) => {
            const blogList = await fetchData('http://localhost:8000/blogs')
            const clickedBlogId = e.target.parentElement.dataset.id
            const selectedBlog = blogList.filter(blog => blog.id == clickedBlogId)
            console.log(clickedBlogId, selectedBlog)
            displayBlogDetails(selectedBlog)
        }
    ))
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

// Project hover functionality
function projectHoverEffect() {
    const projects = document.querySelectorAll('.project')
    projects.forEach(project => {
        project.onmouseover = () => {
            project.lastElementChild.style.display = 'flex'
        }
        project.onmouseout = () => {
            project.lastElementChild.style.display = 'none'
        }
    })
}


function pageSwitching() {
    switchPage('hero-section')
    const menu = document.querySelector(".mobile-nav");
    const links = document.querySelectorAll('.link, .mobile-nav li, .logo')
    links.forEach(link => {  
        link.onclick = (e) => {
            menu.style.display = 'none'
            page = e.target.dataset.page
            console.log("page " ,page)
            switchPage(page)
        }
    })

}


document.addEventListener('DOMContentLoaded', () => {
    displayBlogs()
    displayCategories()
    setCategory()
    
    //add logic for toggling the menu
    const menu = document.querySelector(".mobile-nav");
    const menuToggle = document.querySelector(".menu-btn");
    menuToggle.onclick = () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    };

    // page switching
    pageSwitching()

    //hide the menu on bigger screens
    window.onresize = () => {
        if (window.innerWidth > 768) {
            menu.style.display = "none"
        }
    }

    // creating spans for hover effect on hero title
    const title = document.querySelector('.intro')
    const text = "FrontendDeveloper &LogisticsAnalyst".split(" ")
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

    // navbar background visibility on scroll 
    window.addEventListener('scroll', function() {
        scrolled()
    })
})