document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Menu Toggle
    // ----------------------------------------------------
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const bars = document.querySelectorAll('.bar');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Animate hamburger to X
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && navMenu) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                bars.forEach(bar => bar.style.transform = 'none');
                bars[1].style.opacity = '1';
            }
        });
    });

    // ----------------------------------------------------
    // 2. Sticky Navbar Trigger
    // ----------------------------------------------------
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // ----------------------------------------------------
    // 3. Active Link Highlight on Scroll
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 180)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 4. Dynamic GitHub Repos Sync
    // ----------------------------------------------------
    const reposContainer = document.getElementById('github-repos-container');
    const githubUsername = 'ajul-03';

    // List of repositories to exclude from the dynamic bento list
    // (since they are already featured, represent template boilerplate, or are this portfolio itself)
    const excludedRepos = [
        'Aashilgym-website',
        'gym-fitness-management',
        'digital-marketing-analytics-dashboard',
        'Stock-price-prediction-using-LSTM-neural-networks',
        'power-bi-sales-analysis',
        'defake-sys',
        'tm-wayz-website',
        'Ajul-MK-personal-portfolio',
        'html',
        'new_project'
    ];

    async function fetchGitHubRepos() {
        if (!reposContainer) return;

        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=30`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            // Filter repositories
            const filteredRepos = repos.filter(repo => 
                !repo.fork && 
                !repo.archived && 
                !excludedRepos.includes(repo.name)
            );

            // Clear loading card
            reposContainer.innerHTML = '';

            if (filteredRepos.length === 0) {
                reposContainer.innerHTML = `
                    <div class="repo-loading-card">
                        <i class="fas fa-folder-open" style="font-size: 24px; color: var(--accent-neon);"></i>
                        <p>No additional public repositories found.</p>
                    </div>
                `;
                return;
            }

            // Render repositories in clean bento style
            filteredRepos.forEach(repo => {
                const repoCard = document.createElement('div');
                repoCard.className = 'repo-card';

                // Clean name formatting
                const displayName = repo.name
                    .replace(/-/g, ' ')
                    .replace(/_/g, ' ')
                    .toUpperCase();

                const description = repo.description || 'No description provided for this repository yet.';
                const language = repo.language || 'HTML/CSS';
                const stars = repo.stargazers_count;
                const forks = repo.forks_count;

                repoCard.innerHTML = `
                    <div class="repo-header">
                        <i class="fab fa-github repo-icon"></i>
                        <div class="repo-stats">
                            <span><i class="far fa-star"></i> ${stars}</span>
                            <span><i class="fas fa-code-branch"></i> ${forks}</span>
                        </div>
                    </div>
                    <h3>${displayName}</h3>
                    <p>${description}</p>
                    <div class="repo-footer">
                        <div class="repo-lang">
                            <span class="lang-color"></span>
                            <span>${language}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="repo-link-btn">
                            VIEW REPO <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;

                reposContainer.appendChild(repoCard);
            });

        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            reposContainer.innerHTML = `
                <div class="repo-loading-card">
                    <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: var(--accent-neon);"></i>
                    <p>Unable to sync repositories from GitHub. Please refresh or check back later.</p>
                </div>
            `;
        }
    }

    // Load repos
    fetchGitHubRepos();
});
