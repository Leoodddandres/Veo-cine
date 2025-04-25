/**
 * VeoCine - Script principal
 * Contiene la funcionalidad básica para la interactividad de la página
 * 
 * Versión: 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');
    const movieCards = document.querySelectorAll('.movie-card');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchQuery = document.querySelector('#search-query span');
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');
    const contentSections = document.querySelectorAll('.content-section');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoModal = document.getElementById('video-player-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const videoTitle = document.getElementById('video-title');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const videoContainer = document.querySelector('.video-container');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    const dropdownItems = document.querySelectorAll('.has-dropdown');

    dropdownItems.forEach(item => {
        const dropdownLink = item.querySelector('a');

        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                item.classList.toggle('active');

                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });

    document.querySelectorAll('.btn-watch').forEach(button => {
        button.addEventListener('click', function() {
            const movieCard = this.closest('.movie-card');
            const title = movieCard.querySelector('.movie-title').textContent;
            videoTitle.textContent = title;
            videoModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            videoModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            videoModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');

            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');

                const progressFilled = document.querySelector('.progress-filled');
                let width = 0;

                const interval = setInterval(() => {
                    width += 0.5;
                    if (width <= 100) {
                        progressFilled.style.width = width + '%';
                    } else {
                        clearInterval(interval);
                        icon.classList.remove('fa-pause');
                        icon.classList.add('fa-play');
                    }
                }, 500);

            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    document.querySelector('.mock-video').addEventListener('click', function() {
        if (playPauseBtn) playPauseBtn.click();
    });

    const volumeBtn = document.querySelector('.volume-btn');
    const volumeSlider = document.querySelector('.volume-slider');

    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');

            if (icon.classList.contains('fa-volume-up')) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                document.querySelector('.volume-filled').style.width = '0%';
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                document.querySelector('.volume-filled').style.width = '70%';
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const width = e.clientX - rect.left;
            const percentage = Math.min(Math.max(width / rect.width, 0), 1) * 100;

            document.querySelector('.volume-filled').style.width = percentage + '%';

            const volumeIcon = volumeBtn.querySelector('i');
            if (percentage === 0) {
                volumeIcon.className = 'fas fa-volume-mute';
            } else if (percentage < 50) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        });
    }

    const fullscreenBtn = document.querySelector('.fullscreen-btn');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                videoContainer.requestFullscreen().catch(err => {
                    console.error(`Error al intentar pantalla completa: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    document.querySelector('.progress-bar').addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const width = e.clientX - rect.left;
        const percentage = Math.min(Math.max(width / rect.width, 0), 1) * 100;

        document.querySelector('.progress-filled').style.width = percentage + '%';

        const totalTime = 8100;
        const currentTime = Math.floor(totalTime * (percentage / 100));

        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        };

        document.querySelector('.time-display').textContent = 
            `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    function animateOnScroll() {
        movieCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight - 100) {
                card.classList.add('visible');
            }
        });
    }

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    setTimeout(() => {
        document.querySelectorAll('.poster-placeholder').forEach(placeholder => {
            placeholder.classList.add('loaded');
        });
    }, 1000);

    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${currentSection}` || 
                (currentSection === '' && href === '#')) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (query.length > 0) {
            performSearch(query);
        }
    });

    function performSearch(query) {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        searchResults.style.display = 'block';
        searchQuery.textContent = query;

        const mockResults = [
            { title: 'Avatar', year: '2009', rating: 8.7 },
            { title: 'Interstellar', year: '2014', rating: 9.1 },
            { title: 'El Padrino', year: '1972', rating: 9.8 }
        ];

        const filteredResults = mockResults.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredResults.length > 0) {
            resultsGrid.style.display = 'grid';
            noResults.style.display = 'none';
            resultsGrid.innerHTML = '';

            filteredResults.forEach(movie => {
                const color = `hsl(${Math.random() * 40 + 200}, 70%, 30%)`;

                const movieCard = document.createElement('article');
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                    <div class="movie-poster">
                        <div class="poster-overlay">
                            <button class="btn-watch">Ver Ahora</button>
                        </div>
                        <svg class="poster-placeholder" viewBox="0 0 240 340" xmlns="http://www.w3.org/2000/svg">
                            <rect width="240" height="340" fill="${color}"/>
                            <circle cx="120" cy="140" r="50" fill="${adjustBrightness(color, 1.2)}"/>
                            <path d="M110 130 L140 140 L110 150 Z" fill="#fff"/>
                        </svg>
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-meta">
                            <span class="movie-year">${movie.year}</span>
                            <span class="movie-rating">
                                <i class="fas fa-star"></i> ${movie.rating}
                            </span>
                        </div>
                    </div>
                `;

                resultsGrid.appendChild(movieCard);
            });
        } else {
            resultsGrid.style.display = 'none';
            noResults.style.display = 'block';
        }

        window.scrollTo({
            top: searchResults.offsetTop - 100,
            behavior: 'smooth'
        });
    }

    function adjustBrightness(color, factor) {
        return color.replace(/(\d+)%/, (match, p1) => {
            return Math.min(parseInt(p1) * factor, 100) + '%';
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            document.querySelectorAll('.nav-links a').forEach(item => {
                item.classList.remove('active');
            });

            this.classList.add('active');

            const targetId = this.getAttribute('href').substring(1);

            document.querySelectorAll('section[id]').forEach(section => {
                section.style.display = 'none';
            });

            document.querySelectorAll('.home-section').forEach(section => {
                section.style.display = 'none';
            });

            searchResults.style.display = 'none';

            if (targetId === 'home') {
                document.getElementById('home').style.display = 'block';
                document.querySelectorAll('.home-section').forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';

                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }

            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');

            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.remove('active'));
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentSection = this.closest('.section-filters');
            parentSection.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            this.classList.add('active');
            console.log('Filtrado por:', this.textContent.trim());
        });
    });

    const dropdownItemsOriginal = document.querySelectorAll('.has-dropdown');

    dropdownItemsOriginal.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('active');

                dropdownItemsOriginal.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            dropdownItemsOriginal.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    const viewMoreButtons = document.querySelectorAll('.btn-view-more');
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionTitle = this.closest('.featured-content').querySelector('.section-title').textContent;

            if (sectionTitle.includes('Películas')) {
                document.querySelector('a[href="#movies"]').click();
            } else if (sectionTitle.includes('Series')) {
                document.querySelector('a[href="#series"]').click();
            } else if (sectionTitle.includes('Tendencias')) {
                document.querySelector('a[href="#trending"]').click();
            }
        });
    });

    document.querySelector('#mylist .btn-primary').addEventListener('click', function() {
        document.querySelector('a[href="#movies"]').click();
    });

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .bar.active:nth-child(1) {
                transform: translateY(10px) rotate(45deg);
            }

            .bar.active:nth-child(2) {
                opacity: 0;
            }

            .bar.active:nth-child(3) {
                transform: translateY(-10px) rotate(-45deg);
            }

            .main-header.scrolled {
                background-color: rgba(18, 18, 18, 0.98);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            }

            body.no-scroll {
                overflow: hidden;
            }

            .movie-card.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .poster-placeholder.loaded {
                animation: pulse 1.5s infinite alternate;
            }

            .blur-bg {
                filter: blur(3px);
            }

            @keyframes pulse {
                0% { opacity: 0.9; }
                100% { opacity: 1; }
            }

            @media (max-width: 768px) {
                .nav-links li {
                    width: 100%;
                    text-align: center;
                }

                .nav-links a::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    margin-right: 10px;
                    text-align: center;
                    font-family: 'Font Awesome 5 Free';
                    font-weight: 900;
                }

                .nav-links li:nth-child(1) a::before { content: '\\f015'; }
                .nav-links li:nth-child(2) a::before { content: '\\f008'; }
                .nav-links li:nth-child(3) a::before { content: '\\f26c'; }
                .nav-links li:nth-child(4) a::before { content: '\\f201'; }
                .nav-links li:nth-child(5) a::before { content: '\\f02c'; }
                .nav-links li:nth-child(6) a::before { content: '\\f02e'; }
            }
        </style>
    `);

    const playerStyles = document.createElement('style');
    playerStyles.textContent = `
        .movie-player-section {
            padding-top: 5rem;
            background-color: var(--dark);
        }

        .player-header {
            display: flex;
            align-items: center;
            margin-bottom: 3rem;
        }

        .btn-back {
            background: var(--dark-elevated);
            color: var(--white);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            margin-right: 2rem;
            font-weight: 500;
            transition: all var(--transition-normal);
        }

        .btn-back:hover {
            background: var(--primary-dark);
        }

        .movie-player-title {
            font-size: 2.4rem;
        }

        .player-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
        }

        .video-player {
            width: 100%;
            padding-top: 56.25%;
            position: relative;
            background-color: #000;
            border-radius: 1rem;
            overflow: hidden;
            margin-bottom: 2rem;
        }

        .player-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--white);
        }

        .player-placeholder i {
            font-size: 6rem;
            margin-bottom: 2rem;
            color: var(--primary);
            transition: all var(--transition-normal);
            cursor: pointer;
        }

        .player-placeholder i:hover {
            color: var(--accent);
            transform: scale(1.1);
        }

        .player-info {
            display: grid;
            grid-template-columns: 22rem 1fr;
            gap: 3rem;
        }

        .player-poster {
            width: 100%;
            height: 100%;
        }

        .player-poster svg {
            width: 100%;
            height: auto;
            border-radius: 0.8rem;
        }

        .player-details h3 {
            font-size: 2.6rem;
            margin-bottom: 1rem;
        }

        .player-year {
            color: var(--gray-light);
            margin-bottom: 1.5rem;
            font-size: 1.6rem;
        }

        .player-meta {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .player-meta span {
            display: inline-flex;
            align-items: center;
            background: var(--dark-elevated);
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 1.4rem;
        }

        .player-meta i {
            margin-right: 0.5rem;
            color: var(--primary-light);
        }

        .player-description {
            color: var(--text-secondary);
            line-height: 1.7;
            margin-bottom: 2.5rem;
        }

        .player-actions {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
        }

        .player-actions .btn-secondary {
            background: var(--dark-elevated);
            border: none;
            padding: 1rem 1.5rem;
        }

        .player-actions .btn-secondary:hover {
            background: var(--dark-surface);
        }

        .player-actions i {
            margin-right: 0.8rem;
        }

        @media (max-width: 768px) {
            .player-info {
                grid-template-columns: 1fr;
            }

            .player-poster {
                max-width: 22rem;
                margin: 0 auto;
            }

            .player-actions {
                justify-content: center;
            }

            .nav-links {
                right: -100%;
                width: 80%;
                height: 100vh;
                position: fixed;
                top: 0;
                background: linear-gradient(to bottom, var(--dark-surface), var(--dark));
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                gap: 2.5rem;
                padding-top: 8rem;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
                overflow-y: auto;
                transition: right 0.3s ease-in-out;
                z-index: 1000;
            }
        }
    `;
    document.head.appendChild(playerStyles);

    const trailerButton = document.querySelector('.exclusive-content .btn-primary');
    if (trailerButton) {
        trailerButton.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'trailer-modal';
            modal.innerHTML = `
                <div class="trailer-modal-content">
                    <button class="close-modal">&times;</button>
                    <div class="trailer-container">
                        <div class="trailer-placeholder">
                            <i class="fas fa-film"></i>
                            <p>Tráiler: "Dimensión Desconocida"</p>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.classList.add('no-scroll');

            setTimeout(() => {
                modal.classList.add('active');
            }, 10);

            modal.querySelector('.close-modal').addEventListener('click', function() {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.classList.remove('no-scroll');
                }, 300);
            });
        });
    }

    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .trailer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
        }

        .trailer-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .trailer-modal-content {
            width: 90%;
            max-width: 90rem;
            position: relative;
        }

        .close-modal {
            position: absolute;
            top: -4rem;
            right: 0;
            font-size: 3rem;
            color: var(--white);
            background: none;
            border: none;
            cursor: pointer;
        }

        .trailer-container {
            width: 100%;
            padding-top: 56.25%;
            position: relative;
            background-color: var(--dark-surface);
            border-radius: 1rem;
            overflow: hidden;
        }

        .trailer-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--white);
        }

        .trailer-placeholder i {
            font-size: 5rem;
            margin-bottom: 2rem;
            color: var(--accent);
        }

        .trailer-placeholder p {
            font-size: 2rem;
            font-weight: 500;
        }
    `;
    document.head.appendChild(modalStyles);
});