// navbar toggle
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");

        menuBtn.addEventListener("click", ()=>{
            menuBtn.classList.toggle("active");
            navigation.classList.toggle("active");
        });

// Function to close menu when a navigation link is clicked
function closeMenuOnClick() {
    menuBtn.classList.remove("active");
    navigation.classList.remove("active");
}

// Get all navigation links
const navigationLinks = document.querySelectorAll(".navigation a");

// Add click event listener to each navigation link
navigationLinks.forEach(link => {
    link.addEventListener("click", closeMenuOnClick);
});

// about section skills
var tablinks=document.getElementsByClassName("tab-links");
var tabcontents=document.getElementsByClassName("tab-contents");

function opentab(tabname){
for(tablink of tablinks){
    tablink.classList.remove("active-link");
    }
    for(tabcontent of tabcontents){
    tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
    }
    