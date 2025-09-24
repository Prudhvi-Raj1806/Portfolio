// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CUSTOM SVG CURSOR ANIMATION (ILLUMINATI VIBE) ---
    const customCursor = document.getElementById('custom-cursor');
    const cursorPath = document.getElementById('cursor-path');
    const cursorPupil = document.getElementById('cursor-pupil');
    const interactiveElements = document.querySelectorAll('a, button, .tilt-element, input, textarea');

    // SVG path data for Triangle and Eye
    const trianglePath = "M20 5 L35 35 L5 35 Z"; // Simple equilateral triangle
    const eyePath = "M5 20 C15 10, 25 10, 35 20 C25 30, 15 30, 5 20 Z"; // Eye shape

    // Default state
    cursorPath.setAttribute('d', trianglePath);
    cursorPath.setAttribute('fill', 'var(--accent-color-1)');

    window.addEventListener('mousemove', (e) => {
        // Move the SVG container
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Animate path to eye shape
            const pathAnimation = cursorPath.animate([
                { d: cursorPath.getAttribute('d'), fill: cursorPath.getAttribute('fill') },
                { d: eyePath, fill: 'var(--accent-color-2)' }
            ], { duration: 300, fill: 'forwards', easing: 'ease-out' });

            // Animate pupil in
            cursorPupil.animate([
                { r: 0, opacity: 0 },
                { r: 5, opacity: 1 }
            ], { duration: 300, fill: 'forwards', easing: 'ease-out' });

            pathAnimation.onfinish = () => {
                cursorPath.setAttribute('d', eyePath);
                cursorPath.setAttribute('fill', 'var(--accent-color-2)');
                cursorPupil.setAttribute('r', 5);
                cursorPupil.setAttribute('opacity', 1);
            };
        });

        el.addEventListener('mouseleave', () => {
            // Animate path back to triangle shape
            const pathAnimation = cursorPath.animate([
                { d: cursorPath.getAttribute('d'), fill: cursorPath.getAttribute('fill') },
                { d: trianglePath, fill: 'var(--accent-color-1)' }
            ], { duration: 300, fill: 'forwards', easing: 'ease-out' });

            // Animate pupil out
            cursorPupil.animate([
                { r: cursorPupil.getAttribute('r'), opacity: cursorPupil.getAttribute('opacity') },
                { r: 0, opacity: 0 }
            ], { duration: 300, fill: 'forwards', easing: 'ease-out' });

            pathAnimation.onfinish = () => {
                cursorPath.setAttribute('d', trianglePath);
                cursorPath.setAttribute('fill', 'var(--accent-color-1)');
                cursorPupil.setAttribute('r', 0);
                cursorPupil.setAttribute('opacity', 0);
            };
        });
    });

    // --- 2. SCROLL-REVEAL & STAGGERED ANIMATIONS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Special staggered animation for achievement cards
                if(entry.target.id === 'achievements') {
                    const cards = document.querySelectorAll('.achievement-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('in-view');
                        }, index * 200); // 200ms delay between each card
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 3. HERO TEXT TYPING EFFECT ---
    const typingTextElement = document.getElementById('typing-text');
    const textToType = "Technologist | Photographer | Creative Problem-Solver";
    let index = 0;

    function type() {
        if (index < textToType.length) {
            typingTextElement.innerHTML += textToType.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    type();

    // --- 4. 3D TILT EFFECT ON CARDS/SKILLS ---
    const tiltElements = document.querySelectorAll('.tilt-element');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const middleX = rect.width / 2;
            const middleY = rect.height / 2;

            const maxRotation = 15;
            const rotateY = ((x - middleX) / middleX) * maxRotation;
            const rotateX = ((middleY - y) / middleY) * maxRotation;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
    
    // --- 5. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ---
    const sections = document.querySelectorAll('section[data-nav]');
    const navLinks = document.querySelectorAll('nav a');

    const mainElement = document.querySelector('main');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const navName = entry.target.getAttribute('data-nav');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.textContent === navName) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { 
        root: mainElement,
        rootMargin: '-50% 0px -50% 0px' 
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });

});