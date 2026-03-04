// --- Settings & Initializations ---
const colors = ['#ff0080', '#ff8c00', '#40e0d0', '#8a2be2', '#ffed00', '#00ff00', '#ff00ff'];

// --- Confetti Animations System ---
window.onload = () => {
    // Initial celebration burst when page loads
    setTimeout(firePageLoadConfetti, 500);
};

function firePageLoadConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        // Launch confetti from left and right edges
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            zIndex: 100
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            zIndex: 100
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function shootBigSplash() {
    // Big explosion centered
    confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        scalar: 1.2,
        zIndex: 100
    });
}

// --- Interactive Canvas Background (Holi Powder) ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class PowderParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Random sizes for depth and variety
        this.size = Math.random() * 25 + 5;
        // Gravity effect
        this.weight = Math.random() * 1.5 + 0.1; 
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * 8 - 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.weight += 0.05; // gravity pulls down
        this.y += this.weight;
        this.speedX *= 0.95; // friction
        this.alpha -= 0.015; // fade out gradually
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        // Give particles a slightly organic, powder-like shape rather than perfect circles
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Add a blur filter simulating dusty powder
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.restore();
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Remove particle if faded out or off screen
        if (particlesArray[i].alpha <= 0 || particlesArray[i].y > canvas.height + 50) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Spawn particles on mouse movement
window.addEventListener('mousemove', (event) => {
    // Only spawn occasionally to keep performance up
    if (Math.random() > 0.5) {
        for (let i = 0; i < 2; i++) {
            particlesArray.push(new PowderParticle(event.x, event.y));
        }
    }
});

// Create splash on click everywhere (except UI elements)
window.addEventListener('click', (event) => {
    const targetTag = event.target.tagName.toLowerCase();
    // Don't interfere with buttons or inputs
    if(targetTag !== 'button' && targetTag !== 'input' && targetTag !== 'i') {
        createPowderExplosion(event.x, event.y);
    }
});

function createPowderExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
        particlesArray.push(new PowderParticle(x, y));
    }
}

// --- UI Interactions ---

// Celebrate Button
const celebrateBtn = document.getElementById('celebrateBtn');
celebrateBtn.addEventListener('click', () => {
    shootBigSplash();
    // Also create some canvas powder
    const rect = celebrateBtn.getBoundingClientRect();
    createPowderExplosion(rect.left + rect.width / 2, rect.top);
});

// Personalized Wish
const generateBtn = document.getElementById('generateBtn');
const nameInput = document.getElementById('nameInput');
const greetingText = document.getElementById('greetingText');

generateBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if(name) {
        // Build clean personalized string safely
        const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        greetingText.innerHTML = `${safeName} Wishes You<br>Happy Holi <span class="year-highlight">2026</span>`;
        // Make font a bit smaller for long names
        greetingText.style.fontSize = "clamp(2rem, 6vw, 4rem)";
        
        shootBigSplash();
        nameInput.value = "";
    }
});

// Enter key support for input
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});

// Audio Controller
const musicToggleBtn = document.getElementById('musicToggleBtn');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

// Set audio volume lower so it's pleasant
bgMusic.volume = 0.5;

musicToggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i><span class="tooltiptext">Play Music</span>';
    } else {
        // Play method returns a promise
        bgMusic.play().catch(error => {
            console.log('Audio playback failed: ', error);
            alert("Please make sure assets/holi-instrumental.mp3 exists or audio is allowed.");
        });
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i><span class="tooltiptext">Pause Music</span>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Share Functionality
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
    const shareData = {
        title: 'Happy Holi 2026',
        text: 'Wishing you a very Happy Holi! May your life be filled with vibrant colors and joy.',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Successfully shared'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support native sharing
        navigator.clipboard.writeText(shareData.url)
            .then(() => {
                const icon = shareBtn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fa-solid fa-check';
                setTimeout(() => {
                    icon.className = originalClass;
                }, 2000);
            })
            .catch(err => {
                alert("URL copied to clipboard!");
            });
    }
});
