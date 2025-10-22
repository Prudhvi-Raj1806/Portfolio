// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: EASTER EGG (CONSOLE) ---
    console.log(
        '%cHey, curious developer! 🕵️‍♂️', 
        'color: #00aaff; font-size: 20px; font-weight: bold; -webkit-text-stroke: 1px black;'
    );
    console.log(
        '%cTry the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) for a surprise!', 
        'color: #ff00ff; font-size: 14px;'
    );
    // --- END CONSOLE EASTER EGG ---

    // --- 1. SCROLL-REVEAL & STAGGERED ANIMATIONS --- (Was 2)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                if(entry.target.id === 'achievements') {
                    const cards = document.querySelectorAll('.achievement-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('in-view');
                        }, index * 200);
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 2. HERO TEXT TYPING EFFECT --- (Was 3)
    const typingTextElement = document.getElementById('typing-text');
    // UPDATED TEXT
    const textToType = "Software Developer | Full-Stack Enthusiast | B.Tech Student";
    let index = 0;

    function type() {
        if (index < textToType.length) {
            typingTextElement.innerHTML += textToType.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    type();

    // --- 3. 3D TILT EFFECT ON CARDS/SKILLS --- (Was 4)
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
    
    // --- 4. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL --- (Was 5)
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

    // --- 5. EASTER EGG (KONAMI CODE) --- (NEW)
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
        'b', 'a'
    ];
    let konamiIndex = 0;

    // --- Matrix Rain Effect Logic ---
    const matrixCanvas = document.getElementById('matrix-canvas');
    const matrixCtx = matrixCanvas.getContext('2d');
    let matrixAnimationId;

    function startMatrixRain() {
        if (matrixAnimationId) return; // Already running

        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = matrixCanvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        // Use the CSS variable for the color
        const hackerGreen = getComputedStyle(document.documentElement).getPropertyValue('--hacker-green').trim();

        const drawMatrix = () => {
            matrixCtx.fillStyle = 'rgba(10, 10, 20, 0.05)'; // Fading effect
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            matrixCtx.fillStyle = hackerGreen || '#00ff41'; // Fallback
            matrixCtx.font = fontSize + 'px "Fira Code", monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                matrixCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };
        
        matrixAnimationId = setInterval(drawMatrix, 33);
    }
    
    function stopMatrixRain() {
         if (matrixAnimationId) {
            clearInterval(matrixAnimationId);
            matrixAnimationId = null;
            matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        }
    }
    
    // --- Konami Code Listener ---
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Code entered!
                document.body.classList.toggle('hacker-mode');
                
                if (document.body.classList.contains('hacker-mode')) {
                    startMatrixRain();
                } else {
                    stopMatrixRain();
                }
                
                konamiIndex = 0; // Reset
            }
        } else {
            konamiIndex = 0; // Reset
        }
    });

    // --- 6. EASTER EGG (PROFILE PIC CLICK) --- (NEW)
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        profilePic.addEventListener('click', () => {
            // Prevent re-triggering if animation is already running
            if (profilePic.classList.contains('shake-animation')) {
                return; 
            }
            
            profilePic.classList.add('shake-animation');
            
            // Remove the class after the animation (500ms) finishes
            setTimeout(() => {
                profilePic.classList.remove('shake-animation');
            }, 500); 
        });
    }

    // --- 7. EASTER EGG (H1 GLITCH CLICK) --- (NEW)
    const mainName = document.getElementById('main-name');
    if (mainName) {
        const originalName = mainName.innerText;
        const glitchName = originalName + " // root";
        
        mainName.addEventListener('click', () => {
            if (mainName.classList.contains('glitch-active')) {
                return; // Animation already running
            }

            mainName.classList.add('glitch'); // Add base class
            mainName.classList.add('glitch-active');
            mainName.setAttribute('data-text', glitchName);
            mainName.innerText = glitchName;

            setTimeout(() => {
                mainName.classList.remove('glitch-active');
                mainName.setAttribute('data-text', originalName);
                mainName.innerText = originalName;
            }, 1000); // Duration of the glitch
        });
    }
    
    // Adjust canvas on resize
    window.addEventListener('resize', () => {
        if (document.body.classList.contains('hacker-mode')) {
            stopMatrixRain();
            // Debounce resize
            setTimeout(startMatrixRain, 250);
        }
    });
});
