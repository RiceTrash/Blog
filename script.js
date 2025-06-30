// Modern JavaScript for enhanced user experience
class TourBlog {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.setupPhotoInteractions();
        this.setupSmoothScrolling();
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Active nav link highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.day-article');

        const updateActiveLink = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink);
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Scroll progress indicator
        const createScrollProgress = () => {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 72px;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #007AFF, #5856D6);
                z-index: 1000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);

            window.addEventListener('scroll', () => {
                const scrollTop = document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
            });
        };

        createScrollProgress();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate company cards with stagger
                    const cards = entry.target.querySelectorAll('.company-card, .location-card, .photo-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all day articles
        document.querySelectorAll('.day-article').forEach(article => {
            observer.observe(article);
        });

        // Set initial state for cards
        document.querySelectorAll('.company-card, .location-card, .photo-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
        });
    }

    setupPhotoInteractions() {
        const photoCards = document.querySelectorAll('.photo-card');
        
        photoCards.forEach(card => {
            const placeholder = card.querySelector('.photo-placeholder');
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                placeholder.style.transform = 'scale(1.05)';
                placeholder.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                placeholder.style.transform = 'scale(1)';
            });

            // Add click interaction for future image upload
            card.addEventListener('click', () => {
                this.showPhotoModal(card);
            });
        });
    }

    showPhotoModal(photoCard) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 32px;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        const title = photoCard.querySelector('.photo-info h4').textContent;
        const description = photoCard.querySelector('.photo-info p').textContent;

        modalContent.innerHTML = `
            <h3 style="margin-bottom: 16px; font-size: 24px; color: #1a1a1a;">${title}</h3>
            <p style="margin-bottom: 24px; color: #666; line-height: 1.6;">${description}</p>
            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #f8f9ff 0%, #e6e8ff 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <span style="font-size: 48px; opacity: 0.6;">📷</span>
            </div>
            <button class="close-modal" style="background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; cursor: pointer;">Close</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        });

        // Close modal
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        modalContent.querySelector('.close-modal').addEventListener('click', closeModal);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        modal.addEventListener('remove', () => {
            document.body.style.overflow = '';
        });
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add floating action button for scroll to top
        const createScrollToTop = () => {
            const scrollBtn = document.createElement('button');
            scrollBtn.innerHTML = '↑';
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.style.cssText = `
                position: fixed;
                bottom: 32px;
                right: 32px;
                width: 56px;
                height: 56px;
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 20px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 1000;
            `;

            document.body.appendChild(scrollBtn);

            // Show/hide scroll to top button
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 500) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.transform = 'translateY(0)';
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.transform = 'translateY(20px)';
                }
            });

            // Scroll to top functionality
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Add hover effect
            scrollBtn.addEventListener('mouseenter', () => {
                scrollBtn.style.transform = 'translateY(-2px) scale(1.05)';
                scrollBtn.style.boxShadow = '0 6px 25px rgba(0, 122, 255, 0.4)';
            });

            scrollBtn.addEventListener('mouseleave', () => {
                scrollBtn.style.transform = window.pageYOffset > 500 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(1)';
                scrollBtn.style.boxShadow = '0 4px 20px rgba(0, 122, 255, 0.3)';
            });
        };

        createScrollToTop();
    }
}

// Initialize the tour blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TourBlog();
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #007AFF !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            gap: 16px;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);