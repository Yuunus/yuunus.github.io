class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
        this.drops = [];
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`'.split('');
        this.init();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.columns = Math.floor(this.canvas.width / 20);
        this.init();
    }
    
    init() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.font = '15px JetBrains Mono';
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(text, i * 20, this.drops[i] * 20);
            
            if (this.drops[i] * 20 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles-container');
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = '#3b82f6';
            particle.style.borderRadius = '50%';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.pointerEvents = 'none';
            
            const animationDuration = Math.random() * 20 + 10;
            particle.style.animation = `particleFloat ${animationDuration}s infinite linear`;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            const opacity = parseFloat(particle.style.opacity);
            particle.style.opacity = (opacity + (Math.random() - 0.5) * 0.02).toString();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme = prefersDark ? 'dark' : 'light';
            this.applyTheme();
        }
    }
    
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    this.updateActiveLink(link);
                }
            });
        });
        
        window.addEventListener('scroll', () => this.updateActiveOnScroll());
    }
    
    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    updateActiveOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        this.navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const elementTop = targetElement.offsetTop;
                const elementBottom = elementTop + targetElement.offsetHeight;
                
                if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                    this.updateActiveLink(link);
                }
            }
        });
    }
}

class BlogCardAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.blog-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onCardHover(card));
            card.addEventListener('mouseleave', () => this.onCardLeave(card));
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    onCardHover(card) {
        const tags = card.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
                tag.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.2)';
            }, index * 100);
        });
    }
    
    onCardLeave(card) {
        const tags = card.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.style.transform = 'translateY(0)';
            tag.style.boxShadow = 'none';
        });
    }
}

class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }
    
    init() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

class InteractiveElements {
    constructor() {
        this.init();
    }
    
    init() {
        this.addHoverEffects();
        this.addClickEffects();
        this.addParallaxEffect();
    }
    
    addHoverEffects() {
        const buttons = document.querySelectorAll('.cta-button, .social-link');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.marginLeft = '-10px';
                ripple.style.marginTop = '-10px';
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    addClickEffects() {
        const clickElements = document.querySelectorAll('.blog-card, .nav-link');
        
        clickElements.forEach(element => {
            element.addEventListener('click', (e) => {
                element.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-visual');
            const rate = scrolled * -0.3;
            
            if (parallax) {
                parallax.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes codeGlow {
        0%, 100% {
            text-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }
        50% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.5);
        }
    }
    
    .floating-code {
        animation: codeGlow 2s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const matrix = new MatrixRain(canvas);
        matrix.animate();
    }
    
    new ParticleSystem();
    
    new ThemeManager();
    
    new SmoothScroll();
    
    new BlogCardAnimations();
    
    new InteractiveElements();
    
    const greetingElement = document.querySelector('.code-comment');
    if (greetingElement) {
        new TypingAnimation(greetingElement, [
            '// Welcome to my digital realm',
            '// Crafting code, building futures',
            '// Where innovation meets execution'
        ], 80);
    }
    
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
        }
    });
});