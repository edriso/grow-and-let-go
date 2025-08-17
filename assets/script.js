// Evidence-based encouraging messages inspired by therapeutic practices
const encouragingMessages = [
    "You've taken a powerful step toward healing. This moment of release matters.",
    "Your willingness to let go shows incredible emotional strength.",
    "Every memory you release creates space for new growth and peace.",
    "You're not your past experiences. You're the wisdom you've gained from them.",
    "This act of self-compassion will ripple through your future in beautiful ways.",
    "You've transformed pain into purpose. That's the essence of resilience.",
    "Your courage to face difficult memories is a testament to your inner strength.",
    "You're building emotional freedom, one release at a time.",
    "This moment of letting go is a gift to your future self.",
    "You've chosen growth over staying stuck. That's true wisdom.",
    "Your healing journey inspires others to find their own strength.",
    "You're creating space for joy, peace, and new possibilities.",
    "This release is a declaration of your commitment to emotional well-being.",
    "You've turned a difficult memory into a stepping stone for growth.",
    "Your future is brighter because you chose to let go today."
];

// Helper function to get CSS variable value
function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return { r, g, b };
}

// DOM elements
const elements = {
    memoryForm: document.getElementById('memoryForm'),
    main: document.getElementById('main'),
    animationContainer: document.getElementById('animationContainer'),
    burningSection: document.getElementById('burningSection'),
    lessonSection: document.getElementById('lessonSection'),
    memoryText: document.getElementById('memoryText'),
    lessonText: document.getElementById('lessonText'),
    memoryCard: document.getElementById('memoryCard'),
    lessonCard: document.getElementById('lessonCard'),
    fireContainer: document.getElementById('fireContainer'),
    startOverBtn: document.getElementById('startOverBtn'),
    header: document.getElementById('header'),
    memoryInput: document.getElementById('memoryInput'),
    lessonInput: document.getElementById('lessonInput'),
    submitBtn: document.getElementById('submitBtn'),
    notificationContainer: document.getElementById('notificationContainer')
};

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePageAnimations();
    setupFormInteractions();
});

// Initialize page animations with Anime.js
function initializePageAnimations() {
    // Set initial states
    anime.set([elements.header, elements.memoryInput, elements.lessonInput, elements.submitBtn], {
        opacity: 0,
        translateY: 50
    });

    // Create timeline for page entrance
    const timeline = anime.timeline({
        easing: 'easeOutCubic',
        duration: 800
    });

    timeline
        .add({
            targets: elements.header,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1200
        })
        .add({
            targets: [elements.memoryInput, elements.lessonInput, elements.submitBtn],
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(150),
            duration: 600
        }, '-=600');
}

// Setup form interactions
function setupFormInteractions() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        // Auto-resize with viewport constraints
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            const maxHeight = window.innerWidth <= 480 ? 100 : window.innerWidth <= 640 ? 120 : 150;
            this.style.height = Math.min(this.scrollHeight, maxHeight) + 'px';
        });
        
        // Focus animation
        textarea.addEventListener('focus', function() {
            anime({
                targets: this.parentElement,
                translateY: -8,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
        
        textarea.addEventListener('blur', function() {
            anime({
                targets: this.parentElement,
                translateY: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
    });
}

// Form handling
let isProcessing = false; // Flag to prevent multiple submissions
elements.memoryForm.addEventListener('submit', handleFormSubmit);

// Error display
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'notification';
    errorDiv.textContent = message;
    
    // Add to notification container instead of DOM flow to prevent CLS
    elements.notificationContainer.appendChild(errorDiv);
    
    // Animate in with bounce
    anime({
        targets: errorDiv,
        translateY: ['100%', '0%'],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeOutElastic(1, 0.8)'
    });
    
    // Animate out
    setTimeout(() => {
        anime({
            targets: errorDiv,
            translateY: ['0%', '100%'],
            opacity: [1, 0],
            scale: [1, 0.8],
            duration: 400,
            easing: 'easeInCubic',
            complete: () => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }
        });
    }, 4000);
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isProcessing) {
        return;
    }
    
    isProcessing = true;
    
    const badMemory = document.getElementById('badMemory').value.trim();
    const lessonLearned = document.getElementById('lessonLearned').value.trim();
    
    if (!badMemory) {
        showError('Please write down the memory you want to release.');
        isProcessing = false;
        return;
    }
    
    if (!lessonLearned) {
        showError('Please reflect on the lesson you learned from this experience.');
        isProcessing = false;
        return;
    }
    
    await startAnimationSequence(badMemory, lessonLearned);
}

// Main animation sequence
async function startAnimationSequence(badMemory, lessonLearned) {
    // Set content with preserved formatting
    elements.memoryText.textContent = badMemory;
    elements.lessonText.textContent = lessonLearned;
    
    // Hide form and show animation container
    elements.memoryForm.style.display = 'none';
    elements.animationContainer.classList.remove('hidden');
    
    // Animate container in with elastic bounce
    await new Promise(resolve => {
        anime({
            targets: elements.animationContainer,
            opacity: [0, 1],
            translateY: [60, 0],
            scale: [0.8, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, 0.6)',
            complete: resolve
        });
    });
    
    // Show burning section
    elements.burningSection.classList.remove('hidden');
    elements.lessonSection.classList.add('hidden');
    
    await sleep(2000);
    
    // Burn memory
    await burnMemory();
    
    // Show lesson growing
    await showLessonGrowing();
    
    // Show restart button and notification
    showRestartButton();
    showNotification();
}

// Burn memory animation
async function burnMemory() {
    // Start particle system
    createFireParticles();
    
    await sleep(1000);
    
    // Check if mobile device for reduced scaling
    const isMobile = window.innerWidth <= 640;
    const maxScale = isMobile ? 1.08 : 1.15;
    const maxRotate = isMobile ? 5 : 8;
    
    // Create burning timeline
    const burnTimeline = anime.timeline({
        easing: 'easeInOutSine',
        duration: 800
    });

    burnTimeline
        .add({
            targets: elements.memoryCard,
            scale: [1, isMobile ? 1.05 : 1.08],
            rotate: [0, isMobile ? 2 : 3],
            filter: ['brightness(1)', 'brightness(1.3) sepia(0.4)'],
            duration: 600
        })
        .add({
            targets: elements.memoryCard,
            scale: [isMobile ? 1.05 : 1.08, maxScale],
            rotate: [isMobile ? 2 : 3, maxRotate],
            filter: ['brightness(1.3) sepia(0.4)', 'brightness(1.6) sepia(0.7) blur(1px)'],
            duration: 800
        })
        .add({
            targets: elements.memoryCard,
            scale: [maxScale, 0.7],
            rotate: [maxRotate, isMobile ? 10 : 15],
            opacity: [1, 0],
            filter: ['brightness(1.6) sepia(0.7) blur(1px)', 'brightness(0) sepia(1) blur(3px)'],
            duration: 1200
        });

    // Continue particles during burn
    const particleInterval = setInterval(createFireParticles, 150);
    
    await sleep(3000);
    clearInterval(particleInterval);
    
    // Fade out burning section
    await new Promise(resolve => {
        anime({
            targets: elements.burningSection,
            opacity: [1, 0],
            translateY: [0, -40],
            scale: [1, 0.8],
            duration: 800,
            easing: 'easeInCubic',
            complete: () => {
                elements.burningSection.classList.add('hidden');
                resolve();
            }
        });
    });
}

// Create fire particles
function createFireParticles() {
    const container = elements.fireContainer;
    const particleCount = Math.floor(Math.random() * 5) + 4;
    
    // Check if mobile device
    const isMobile = window.innerWidth <= 640;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        
        const size = Math.random() * (isMobile ? 10 : 15) + (isMobile ? 6 : 8);
        const startX = Math.random() * 100;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.bottom = '0';
        
        container.appendChild(particle);
        
        // Animate particle with physics-like movement
        anime({
            targets: particle,
            translateY: [0, isMobile ? -80 : -120],
            translateX: [0, anime.random(isMobile ? -20 : -40, isMobile ? 20 : 40)],
            scale: [1, 0],
            opacity: [1, 0],
            duration: anime.random(2000, 3500),
            easing: 'easeOutQuart',
            complete: () => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }
        });
    }
}

// Show lesson growing
async function showLessonGrowing() {
    elements.lessonSection.classList.remove('hidden');
    
    // Animate section in with slide
    await new Promise(resolve => {
        anime({
            targets: elements.lessonSection,
            opacity: [0, 1],
            translateX: [-80, 0],
            duration: 1000,
            easing: 'easeOutCubic',
            complete: resolve
        });
    });
    
    // Animate lesson card with elastic growth
    await new Promise(resolve => {
        anime({
            targets: elements.lessonCard,
            scale: [0.1, 1],
            opacity: [0, 1],
            translateY: [60, 0],
            duration: 1500,
            easing: 'easeOutElastic(1, 0.5)',
            complete: resolve
        });
    });
    
    // Create wisdom particles
    createWisdomParticles();
    
    await sleep(2000);
    
    // Add floating animation to text
    anime({
        targets: elements.lessonText,
        translateY: [0, -12, 0],
        duration: 4000,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
    });
    
    // Add pulsing glow effect
    const primaryColor = getCSSVariable('--primary');
    const primaryRGB = hexToRgb(primaryColor);
    
    anime({
        targets: elements.lessonCard,
        boxShadow: [
            `0 0 25px rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.4)`,
            `0 0 50px rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.8)`,
            `0 0 25px rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.4)`
        ],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
    });
    
    await sleep(3000);
}

// Create wisdom particles
function createWisdomParticles() {
    const container = elements.lessonCard;
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        particle.style.background = 'var(--primary)';
        
        const size = Math.random() * 10 + 5;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        
        container.style.position = 'relative';
        container.appendChild(particle);
        
        // Animate particle with spiral-like movement
        anime({
            targets: particle,
            translateY: [0, -150],
            translateX: [0, anime.random(-50, 50)],
            scale: [1, 0],
            opacity: [1, 0],
            duration: anime.random(3000, 5000),
            easing: 'easeOutQuart',
            complete: () => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }
        });
    }
}

// Show restart button
function showRestartButton() {
    elements.startOverBtn.classList.remove('hidden');
    anime({
        targets: elements.startOverBtn,
        scale: [0, 1],
        opacity: [0, 1],
        rotate: [360, 0],
        duration: 1000,
        easing: 'easeOutElastic(1, 0.8)'
    });
}

// Show notification
function showNotification() {
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = randomMessage;
    
    elements.notificationContainer.appendChild(notification);
    
    // Animate in with elastic slide
    anime({
        targets: notification,
        translateY: ['100%', '0%'],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        easing: 'easeOutElastic(1, 0.8)'
    });
    
    // Animate out
    setTimeout(() => {
        anime({
            targets: notification,
            translateY: ['0%', '100%'],
            opacity: [1, 0],
            scale: [1, 0.8],
            duration: 600,
            easing: 'easeInCubic',
            complete: () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }
        });
    }, 5000);
}

// Start over functionality - refresh page
elements.startOverBtn.addEventListener('click', function() {
    window.location.reload();
});

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn && submitBtn.offsetParent !== null && !isProcessing) {
            submitBtn.click();
        }
    }
    
    // Escape to reset - works anytime
    if (e.key === 'Escape') {
        window.location.reload();
    }
});
