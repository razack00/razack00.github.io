const API_URL_PROJECTS = 'data/projects.json'
const API_URL_BLOGS = 'data/blogs.json'
const API_URL_CATEGORIES = 'data/categories.json'

function switchPage(page) {
    const newPage = `${page}-section`
    document.querySelector('.greet').innerHTML = page
    const pages = document.querySelectorAll('.page')

    pages.forEach(page => {
        page.style.display = "none"
    })
    // displaying current page
    const currentPage = document.querySelector(`.${newPage}`)
    currentPage.style.display = 'flex'

    activeLink(newPage)
}

function activeLink(activePage) {
    document.querySelectorAll(".main-links .link").forEach((a) => {
        a.classList.remove("active");
    });
    // //add the active class to the nav link that corresponds to the page
    if(activePage == 'blogDetails-section') {
        document.querySelector(`.link[data-page="${"blog"}"]`).classList.add("active")
    }else{document.querySelector(`.link[data-page="${activePage.split("-")[0]}"]`).classList.add("active");}
}

// reusable function for fetchning data
const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function displayCategories() {
    const categoriesContainer = document.querySelector('.categories')
    const categories = await fetchData(API_URL_CATEGORIES)
    categoriesContainer.innerHTML = categories.categories.map(category => {  
        // on first render, the element with category = All is rendered with active class and others are not
        if(category == "All") {
            return `<li class="category active link">${category}</li>`
        }
        return `<li class="category link">${category}</li>`        
    }).join('')
} 

async function setCategory() {
    const projects = await fetchData(API_URL_PROJECTS)    
    displayProjects(projects, "All") //first render
    const categories = document.querySelectorAll('.category') 
    let selectedCategory = ''
    categories.forEach(category => (
        category.onclick = (e) => {
            categories.forEach(cat => cat.classList.remove('active')) //remove active class from all categories
            category.classList.add('active') //add active class to clicked category
            selectedCategory = e.target.textContent
            if(selectedCategory === "All") {
                displayProjects(projects, selectedCategory) // display all cats when selected category == All
            }
            else {
                const filteredProjects = projects.filter(project => project.category == selectedCategory)
                displayProjects(filteredProjects, selectedCategory) //display only selected categories
            }
        }
    ))
}

// Display project
function displayProjects (projects, selectedCategory) {
    document.querySelector('.projects').innerHTML = projects.map(project => (
        `<li data-id=${project.id} class="project">
            <img src=${project.image} alt="project image">
            <div class="project-content" data-id=${project.id}>
                <h3 class="project-title">${project.name} <span class="spanCategory">${(selectedCategory == 'All'? `- (${project.category})` : "")}</span></h3>
                <p>${project.description}</p>
                <div>${(project.technologies.map(tech => (
                    `<span class="tech-preview">${tech}</span>`
                )).join(' '))}</div>
            </div>
        </li>`
    )).join("")
    projectHoverEffect()
    filterProject() // filters and attaches onclick event to all projects
}

// Display selected projects in the modal
function displayProjectDetails(selectedProject) {
    document.querySelector('.modal-container').innerHTML = (
        `<dialog class="modal">
            <div class="modal-header">
                <button class="modal-close-btn" type="button">x</button>
                <h1 class="modal-title">${selectedProject[0].name}</h1>
            </div>
            <img src=${selectedProject[0].image} alt="">
            <div class="technologies">
                <div class="project-skills">
                    ${selectedProject[0].technologies.map(tech => (
                        `<span>${tech}</span>`
                    )).join("")}
                </div>
                <div class="modal-links">
                    <a href=${selectedProject[0].site_link}>live</a>
                    <a href=${selectedProject[0].github_link}>Github</a>
                </div>
            </div>
            <div class="modal-content-container>
                <div class="modal-about">
                    <h3 class="modal-subtitle" >About</h3>
                    <p>${selectedProject[0].body}</p>
                </div>
                <div class="functionalities">
                    <h3 class="modal-subtitle">Functionalities</h3>
                    ${selectedProject[0].functionalities.map(func => (
                        `<p>${func}</p>`
                    )).join("")}
                </div>
                <div class="modal-links">
                    <a target="_blank" href=${selectedProject[0].site_link}>live</a>
                    <a target="_blank" href=${selectedProject[0].github_link}>Github</a>
                </div>
            </div>
        </dialog>`
    )
}

function filterProject() {
    const projects = document.querySelectorAll('.project')
    projects.forEach(project => (
        project.onclick = async (e) => {
            const projectList = await fetchData(API_URL_PROJECTS)
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
    modalCloseBtn.onclick = () => {
        document.querySelector('.modal').style.display = 'none'
    }
}

async function displayBlogs() {
    const blogs = await fetchData(API_URL_BLOGS)
    document.querySelector('.blogs').innerHTML = blogs.map(blog => (
        `<li class="blog-post">
            <img src=${blog.image} alt="blog post">
            <div class="blog-post-content">
                <h2>${blog.title}</h2>
                <p>${blog.body.slice(0, 200)}... </p>
                <a data-id=${blog.id} href="#blogDetails" data-page="blogDetails" class="blog-link">Read More</a>
            </div> 
        </li>` )
    ).join("")
    filterBlog() // attaches an onclick event to each blog for filtering when clicked
}

async function displayRecentBlog() {
    const blogs = await fetchData(API_URL_BLOGS)
    const recentblog = blogs.sort((a, b) => new Date(a.date) - new Date(b.date))
    document.querySelector('.recent-blogs').innerHTML = 
        `<li class="blog-post">
            <img src=${recentblog[0].image} alt="blog post">
            <div class="blog-post-content">
                <h2>${recentblog[0].title}</h2>
                <p>${recentblog[0].body.slice(0, 100)}...</p>
                <a data-id=${recentblog[0].id} data-page="blogDetails" href="#blogDetails" class="blog-link">Read More</a>
            </div>
        </li>`
        filterBlog() // attaches an onclick event to each blog for filtering when clicked
}

function displayBlogDetails(blog) {
    document.querySelector('.blogDetails-section').innerHTML = (
        `<div class="blog-details">
            <h2>${blog[0].title}</h2>
            <img src=${blog[0].image} alt="">
            <p>${blog[0].body}</p>            
        </div>`
    )
}

// attach an onclick event to each blog for filtering when clicked
async function filterBlog() {
    const blogLinks = document.querySelectorAll('.blog-link')
    blogLinks.forEach(bloglink => (
        bloglink.onclick = async (e) => {
            const blogList = await fetchData(API_URL_BLOGS)
            console.log(blogList)
            const clickedBlogId = e.target.dataset.id
            const selectedBlog = blogList.filter(blog => blog.id == clickedBlogId)
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

document.addEventListener('DOMContentLoaded', () => {
    const API_URL_PROJECTS = 'data/projects.json'
    const API_URL_BLOGS = 'data/blogs.json'
    const API_URL_CATEGORIES = 'data/categories.json'
    displayBlogs()
    displayRecentBlog()
    displayCategories()
    setCategory()
    switchPage('home')

    function isValidPath(path) {
        const validPaths = ["#home", "#about", "#contact", "#blog", "#projects", "#blogDetails"]; 
        return validPaths.includes(path);
      }
    window.addEventListener('popstate', function handlePopState(event) {
        const currentPage = window.location.hash;
        menu.style.display = 'none'
        if (isValidPath(currentPage)) {
            switchPage(currentPage.slice(1))
        } else {
            switchPage('home');
        }
    });


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

    // navbar background visibility on scroll 
    window.addEventListener('scroll', function() {
        scrolled()
    })
})