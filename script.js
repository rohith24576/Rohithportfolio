document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initSmoothScroll();
    initSkillCards();
    initCodeBlockAnimation();
    initParticles();
    initResumeDownload();
});

function initResumeDownload() {
    const resumeLink = document.querySelector('.resume-download');
    if (!resumeLink) return;

    resumeLink.addEventListener('click', async function(e) {
        e.preventDefault();
        const url = this.getAttribute('href');
        const filename = this.getAttribute('download') || 'Rohith_resume.pdf';

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.location.href = url;
        }
    });
}

function initParticles() {
    const container = document.querySelector('.particles');
    if (!container) return;
    const count = 50;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = -(Math.random() * 20) + 's';
        particle.style.animationDuration = (15 + Math.random() * 20) + 's';
        particle.style.width = (1 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

function initCodeBlockAnimation() {
    const codeLines = document.querySelectorAll('.code-line');
    const codeCursor = document.querySelector('.code-cursor');
    codeLines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, 1200 + i * 150);
    });
    if (codeCursor) {
        codeCursor.style.opacity = '0';
        codeCursor.style.transition = 'opacity 0.3s ease';
        setTimeout(() => { codeCursor.style.opacity = '1'; }, 1800);
    }
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const navSlideout = document.querySelector('.nav-slideout');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navSlideout.classList.toggle('active');
        document.body.style.overflow = navSlideout.classList.contains('active') ? 'hidden' : '';
    });

    navSlideout.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navSlideout.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealThreshold = 0.1;
    const revealRootMargin = '0px 0px -80px 0px';

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: revealThreshold,
        rootMargin: revealRootMargin
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
