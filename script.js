document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initSmoothScroll();
    initSkillCards();
    initCodeBlockAnimation();
    initParticles();
    initResumeDownload();
    initGitHubProjects();
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

const GITHUB_USER = 'rohith24576';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`;

const REPO_DESCRIPTIONS = {
    'connect4': 'A classic two-player Connect4 board game built in Java. Implements turn-based gameplay, win detection across horizontal, vertical, and diagonal lines, and draw conditions. Demonstrates object-oriented programming and algorithmic thinking for game state validation.',
    'rohithportfolio': 'Personal portfolio website showcasing my projects, skills, and experience. Built with HTML, CSS, and JavaScript as a dynamic, responsive single-page application with smooth animations and modern design.',
    'canteen-management-system': 'Web-based user interface for managing canteen operations. Features dynamic menu display with categories, food item cards with pricing, shopping cart functionality, and order placement. Responsive design for desktop and mobile devices.',
    'canteen-management-system-with-database': 'Database design and implementation for the canteen management system using MySQL. Includes normalized tables for users, menu items, orders, and inventory with proper relationships, foreign keys, and constraints for data integrity.'
};

function formatRepoName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getProjectDescription(repo) {
    const key = repo.name.toLowerCase();
    if (REPO_DESCRIPTIONS[key]) return REPO_DESCRIPTIONS[key];
    if (repo.description) {
        const d = repo.description.trim();
        if (d.length >= 40 && d.length <= 200) return d;
        if (d.length > 200) return d.slice(0, 197) + '...';
    }
    return 'A project demonstrating practical application of programming concepts and software development skills.';
}

function initGitHubProjects() {
    const grid = document.getElementById('projects-grid');
    const loading = document.getElementById('projects-loading');
    if (!grid || !loading) return;

    fetch(GITHUB_API)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch repositories');
            return res.json();
        })
        .then(repos => {
            const ownedRepos = repos.filter(r => !r.fork);
            loading.remove();

            if (ownedRepos.length === 0) {
                grid.innerHTML = '<div class="projects-error reveal">No public repositories found.</div>';
                return;
            }

            ownedRepos.forEach((repo, i) => {
                const card = document.createElement('a');
                card.href = repo.html_url;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.className = `project-card reveal ${i > 0 ? `reveal-delay-${Math.min(i, 3)}` : ''}`;

                const tag = repo.language || 'Project';
                const techTags = repo.topics?.length
                    ? repo.topics.slice(0, 5)
                    : (repo.language ? [repo.language] : ['Code']);

                card.innerHTML = `
                    <div class="project-card-glow"></div>
                    <div class="project-header">
                        <span class="project-number">${String(i + 1).padStart(2, '0')}</span>
                        <span class="project-tag">${escapeHtml(tag)}</span>
                    </div>
                    <h3>${escapeHtml(formatRepoName(repo.name))}</h3>
                    <p>${escapeHtml(getProjectDescription(repo))}</p>
                    <div class="project-tech">
                        ${techTags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
                    </div>
                `;
                grid.appendChild(card);
            });

            initScrollReveal();
        })
        .catch(() => {
            loading.textContent = 'Unable to load projects. Check back later.';
            loading.classList.remove('projects-loading');
            loading.classList.add('projects-error');
        });
}
