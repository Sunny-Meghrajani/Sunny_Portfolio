gsap.registerPlugin(ScrollTrigger);

// --- INITIALIZATION ---
const canvas = document.querySelector('#hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- NAVBAR SCROLLSPY ---
const sections = document.querySelectorAll("section[id]");
const allNavLinks = document.querySelectorAll("#navbar ul a li");

// Helper function to reset all and set one
function updateNav(targetId) {
    allNavLinks.forEach(link => {
        const isTarget = link.parentElement.getAttribute("href") === `#${targetId}`;
        gsap.to(link, {
            className: isTarget ? "nav-active" : "nav-active-reset",
            duration: 0.2,
            overwrite: true
        });
    });
}

sections.forEach((section) => {
    const sectionId = section.getAttribute("id");

    ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => updateNav(sectionId),
        onEnterBack: () => updateNav(sectionId),
        fastScrollEnd: true,
        preventOverlaps: true
    });
});

// --- SCATTERED 3D ELEMENTS ---
const particles = [];
const geometries = [
    new THREE.IcosahedronGeometry(1, 15),
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.TorusGeometry(0.7, 0.2, 16, 100)
];

for (let i = 0; i < 40; i++) {
    const randomGeo = geometries[Math.floor(Math.random() * geometries.length)];

    // Updated Logic: 1/3 White, 1/3 Cyan, 1/3 Blue
    let crystalColor;
    if (i % 3 === 0) crystalColor = 0xffffff; // White
    else if (i % 3 === 1) crystalColor = 0x00ffff; // Cyan
    else crystalColor = 0x3b82f6; // Blue

    const material = new THREE.MeshPhysicalMaterial({
        color: crystalColor,
        roughness: 0.1,
        metalness: 0.5,
        transmission: 0.5, // Lowered slightly so color shows better
        thickness: 0.5,
    });

    const mesh = new THREE.Mesh(randomGeo, material);

    // Spread them across the Hero area only
    mesh.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
    );

    const s = Math.random() * 0.8 + 0.2;
    mesh.scale.set(s, s, s);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    scene.add(mesh);
    particles.push({
        mesh: mesh,
        rotationSpeed: Math.random() * 0.005 + 0.002
    });
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(ambientLight, pointLight);

camera.position.z = 12;

// --- ANIMATION LOOP (No Mouse Logic) ---
function animate() {
    requestAnimationFrame(animate);

    particles.forEach((obj, i) => {
        // Only subtle self-rotation and floating
        obj.mesh.rotation.x += obj.rotationSpeed;
        obj.mesh.rotation.y += obj.rotationSpeed;
        obj.mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.003;
    });

    renderer.render(scene, camera);
}
animate();

// --- SCROLL CONTROL FOR 3D CANVAS ---
// This makes the 3D elements fade and move up as you scroll to About
gsap.to(canvas, {
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "top center",
        scrub: true
    },
    opacity: 0,
    y: -100,
    ease: "none"
});

// --- GSAP ENTRANCE ---
window.onload = () => {
    const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1 }
    });

    // 1. Reveal Navbar
    tl.to("#navbar", { opacity: 1, y: 0, duration: 1 })

        // 2. Animate the Badge (Hero Tag) with a slight scale pop
        .to("#hero-tag", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6
        }, "-=0.6")

        .to(".hero-line", {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: "expo.out"
        }, "-=0.5")

        .to("#hero-p", {
            opacity: 1,
            y: 0
        }, "-=0.7")

        .to("#hero-btns", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)" // Adds a slight "bounce" to make them feel premium
        }, "-=0.6")

        .to("#scroll-indicator", { opacity: 1 }, "-=0.5")
        .to("#scroll-line", { scaleY: 1, ease: "power2.inOut" }, "-=0.5");
};

// --- ABOUT SECTION ANIMATION ---
const aboutTL = gsap.timeline({
    scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        end: "top 20%",
        scrub: 1,
    }
});

aboutTL.to("#about-content", { opacity: 1, y: 0, duration: 1 });

gsap.fromTo("#about-image-card",
    { x: 500, opacity: 0, rotationY: -60, scale: 0.5, transformPerspective: 1000 },
    {
        x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 2, ease: "power3.out",
        scrollTrigger: {
            trigger: "#about",
            start: "top 60%",
            end: "top 20%",
            scrub: 1
        }
    }
);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- SKILLS MARQUEE LOGIC ---
function initMarquee() {
    gsap.to(".skills-group-1", {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: "none"
    });
    gsap.set(".skills-group-2", { xPercent: -100 });
    gsap.to(".skills-group-2", {
        xPercent: 0,
        repeat: -1,
        duration: 25,
        ease: "none"
    });
}
initMarquee();
// Magnetic effect for individual skill words
const skillWords = document.querySelectorAll('.skills-group-1 span');

skillWords.forEach(word => {
    word.addEventListener('mousemove', (e) => {
        const rect = word.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(word, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.3,
            ease: "power2.out",
            // We remove the 'color' change here and let the CSS :hover handle it
            // This prevents GSAP from fighting with your CSS styles
        });
    });

    word.addEventListener('mouseleave', () => {
        gsap.to(word, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
            // NO color: transparent here!
        });
    });
});

// --- PROJECTS ENTRANCE & TILT ---
// Reveal projects as we scroll
gsap.from(".project-card", {
    scrollTrigger: {
        trigger: "#projects",
        start: "top 80%",
        end: "bottom bottom",
        toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    stagger: 0.2,
    duration: 1.2,
    ease: "power4.out"
});

// 3D Hover Tilt Effect for Projects
const cards = document.querySelectorAll('.project-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});


// --- TIMELINE DRAWING ANIMATION ---
const timelineMain = gsap.timeline({
    scrollTrigger: {
        trigger: "#experience",
        start: "top 60%", // Start when section is in view
        end: "bottom 80%",
        scrub: 2, // Smooth follow
    }
});

// 1. Draw the line down
timelineMain.to("#timeline-line", {
    height: "100%",
    ease: "none",
    duration: 5
});

// 2. Animate each item as the scroll reaches it
const items = document.querySelectorAll('.timeline-item');

items.forEach((item) => {
    const dot = item.querySelector('.milestone-dot');
    const content = item.querySelector('.timeline-content');

    gsap.to(dot, {
        scale: 1,
        scrollTrigger: {
            trigger: item,
            start: "top 60%",
            end: "top 50%",
            scrub: true
        }
    });

    gsap.to(content, {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: item,
            start: "top 70%",
            end: "top 40%",
            scrub: 1
        }
    });
});

// Spline model
const splineViewer = document.querySelector('#contact-spline');
const splineLoader = document.querySelector('#spline-loader');

function hideSplineLoader() {
    if (splineLoader && splineLoader.style.display !== 'none') {
        gsap.to(splineLoader, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                splineLoader.style.display = 'none';
            }
        });

        gsap.from(splineViewer, {
            opacity: 0,
            scale: 0.9,
            duration: 1.5,
            ease: "expo.out"
        });
    }
}

if (splineViewer) {
    // 1. Listen for the custom Spline load event
    splineViewer.addEventListener('load', hideSplineLoader);
    const checkLoaded = setInterval(() => {
        if (splineViewer.shadowRoot && splineViewer.shadowRoot.querySelector('canvas')) {
            hideSplineLoader();
            clearInterval(checkLoaded);
        }
    }, 500);
}

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Visual feedback
    submitBtn.innerText = "SENDING...";
    submitBtn.disabled = true;

    // Service ID, Template ID, and the Form Element
    emailjs.sendForm(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, this)
        .then(function () {
            submitBtn.innerText = "SUCCESS!";
            submitBtn.style.backgroundColor = "#22c55e";
            contactForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerText = "SEND MESSAGE";
                submitBtn.style.backgroundColor = "";
                submitBtn.disabled = false;
            }, 3000);

        }, function (error) {
            console.log('FAILED...', error);
            submitBtn.innerText = "ERROR!";
            submitBtn.style.backgroundColor = "#ef4444"; // Red for error
            submitBtn.disabled = false;
        });
});

// // footer
// gsap.to(".footer-reveal", {
//     scrollTrigger: {
//         trigger: "footer",
//         start: "top 95%",
//         toggleActions: "play none none reverse"
//     },
//     opacity: 1,
//     y: 0,
//     duration: 1.2,
//     ease: "expo.out"
// });


const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Open Menu
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
});

// Close Menu
menuClose.addEventListener('click', () => {
    mobileMenu.classList.add('translate-x-full');
});

// Close Menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
    });
});

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
    gsap.from(".mobile-link", {
        x: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out"
    });
});