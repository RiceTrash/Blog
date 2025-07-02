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
        this.initSlideshows(); // Initialize slideshows
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Improved navbar scroll effect that keeps navbar visible
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Always keep navbar visible, just change styling on scroll
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
            
            // Remove the transform that would hide the navbar
            // navbar.style.transform = 'translateY(0)';
            
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
            if (placeholder) {
                card.addEventListener('mouseenter', () => {
                    placeholder.style.transform = 'scale(1.05)';
                    placeholder.style.transition = 'transform 0.3s ease';
                });
                
                card.addEventListener('mouseleave', () => {
                    placeholder.style.transform = 'scale(1)';
                });
                
                // Add click interaction to open modal, but check if click was on slideshow controls
                card.addEventListener('click', (e) => {
                    // Don't open modal if clicking on slideshow controls
                    if (e.target.closest('.slideshow-arrow') || e.target.closest('.dot')) {
                        return;
                    }
                    this.showPhotoModal(card);
                });
            }
        });
    }

    // Add modal functionality back
    showPhotoModal(photoCard) {
        // Create modal container with improved design
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.4s ease;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        `;

        // Create a more architecturally interesting modal content container
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 4px;
            max-width: 700px;
            width: 90%;
            position: relative;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
            transform: scale(0.95) translateY(20px);
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        `;

        // Get info from the card
        const title = photoCard.querySelector('.photo-info h4').textContent;
        const description = photoCard.querySelector('.photo-info p').textContent;
        
        // Check if this is a slideshow
        const slideContainer = photoCard.querySelector('.slideshow-container');
        
        // Create the header section with subtle top border gradient
        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = `
            position: relative;
            overflow: hidden;
        `;
        
        modalHeader.innerHTML = `<div style="height: 4px; background: linear-gradient(90deg, #007AFF, #5856D6);"></div>`;
        
        // Add a close icon in the corner - moved here to fix reference issues
        const closeIcon = document.createElement('button');
        closeIcon.innerHTML = '&times;';
        closeIcon.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
        `;
        
        closeIcon.addEventListener('mouseenter', () => {
            closeIcon.style.background = 'rgba(0,0,0,0.8)';
            closeIcon.style.transform = 'scale(1.1)';
        });
        
        closeIcon.addEventListener('mouseleave', () => {
            closeIcon.style.background = 'rgba(0,0,0,0.5)';
            closeIcon.style.transform = 'scale(1)';
        });
        
        // Create the image/slideshow container with better proportions
        const mediaContainer = document.createElement('div');
        
        if (slideContainer) {
            // For slideshow, include all images in the modal with navigation
            const images = Array.from(slideContainer.querySelectorAll('.slideshow-image'));
            const activeImageIndex = images.findIndex(img => img.classList.contains('active'));
            
            mediaContainer.style.cssText = `
                width: 100%;
                height: 420px;
                position: relative;
                overflow: hidden;
                background: #000;
            `;
            
            let currentModalIndex = activeImageIndex >= 0 ? activeImageIndex : 0;
            
            // Add images to modal
            images.forEach((img, index) => {
                const imgClone = document.createElement('img');
                imgClone.src = img.src;
                imgClone.alt = img.alt;
                imgClone.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: ${index === currentModalIndex ? '1' : '0'};
                    transition: opacity 0.5s ease;
                `;
                mediaContainer.appendChild(imgClone);
            });
            
            // Add navigation arrows with improved design
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&#10094;';
            prevBtn.style.cssText = `
                position: absolute;
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                z-index: 2;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '&#10095;';
            nextBtn.style.cssText = `
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                z-index: 2;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Hover effects for buttons
            prevBtn.addEventListener('mouseenter', () => {
                prevBtn.style.background = 'rgba(0,0,0,0.8)';
                prevBtn.style.transform = 'translateY(-50%) scale(1.1)';
            });
            
            prevBtn.addEventListener('mouseleave', () => {
                prevBtn.style.background = 'rgba(0,0,0,0.5)';
                prevBtn.style.transform = 'translateY(-50%) scale(1)';
            });
            
            nextBtn.addEventListener('mouseenter', () => {
                nextBtn.style.background = 'rgba(0,0,0,0.8)';
                nextBtn.style.transform = 'translateY(-50%) scale(1.1)';
            });
            
            nextBtn.addEventListener('mouseleave', () => {
                nextBtn.style.background = 'rgba(0,0,0,0.5)';
                nextBtn.style.transform = 'translateY(-50%) scale(1)';
            });
            
            mediaContainer.appendChild(prevBtn);
            mediaContainer.appendChild(nextBtn);
            
            // Add progress indicators
            const indicators = document.createElement('div');
            indicators.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 10px;
                z-index: 2;
            `;
            
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.style.cssText = `
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${index === currentModalIndex ? 'white' : 'rgba(255,255,255,0.4)'};
                    transition: all 0.3s ease;
                    cursor: pointer;
                `;
                dot.dataset.index = index;
                indicators.appendChild(dot);
                
                dot.addEventListener('click', () => {
                    showModalImage(index);
                });
            });
            
            mediaContainer.appendChild(indicators);
            
            // Navigation functionality with improved transitions
            const showModalImage = (index) => {
                if (index < 0) index = images.length - 1;
                if (index >= images.length) index = 0;
                
                Array.from(mediaContainer.querySelectorAll('img')).forEach((img, i) => {
                    img.style.opacity = i === index ? '1' : '0';
                });
                
                Array.from(indicators.querySelectorAll('span')).forEach((dot, i) => {
                    dot.style.background = i === index ? 'white' : 'rgba(255,255,255,0.4)';
                    dot.style.transform = i === index ? 'scale(1.2)' : 'scale(1)';
                });
                
                currentModalIndex = index;
            };
            
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showModalImage(currentModalIndex - 1);
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showModalImage(currentModalIndex + 1);
            });
        } else {
            // For regular images, create an enhanced image display
            const image = photoCard.querySelector('.photo-image');
            
            mediaContainer.style.cssText = `
                width: 100%;
                height: 420px;
                position: relative;
                overflow: hidden;
                background: #000;
            `;
            
            if (image) {
                const modalImg = document.createElement('img');
                modalImg.src = image.src;
                modalImg.alt = image.alt;
                modalImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                `;
                mediaContainer.appendChild(modalImg);
            } else {
                // Fallback if no image is found
                mediaContainer.style.cssText = `
                    width: 100%;
                    height: 300px;
                    background: linear-gradient(135deg, #f0f2f5 0%, #e6e9ef 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                mediaContainer.innerHTML = '<span style="font-size: 48px; opacity: 0.4;">📷</span>';
            }
        }
        
        modalHeader.appendChild(mediaContainer);
        
        // Create content section with improved typography
        const modalInfo = document.createElement('div');
        modalInfo.style.cssText = `
            padding: 32px 36px 24px;
            background: white;
        `;
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        modalTitle.style.cssText = `
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
            line-height: 1.3;
        `;
        
        const modalDesc = document.createElement('p');
        modalDesc.textContent = description;
        modalDesc.style.cssText = `
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 0;
        `;
        
        // Create an architectural modal footer
        const modalFooter = document.createElement('div');
        modalFooter.style.cssText = `
            padding: 20px 36px;
            background: #f5f7fa;
            border-top: 1px solid #e4e7ec;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        `;
        
        // Add subtle decorative elements
        const footerAccent = document.createElement('div');
        footerAccent.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(to right, 
                transparent, 
                rgba(0, 122, 255, 0.2) 20%, 
                rgba(0, 122, 255, 0.3) 50%, 
                rgba(0, 122, 255, 0.2) 80%, 
                transparent
            );
            transform: translateY(-1px);
        `;
        modalFooter.appendChild(footerAccent);
        
        // Left side: metadata
        const metaContainer = document.createElement('div');
        metaContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;
        
        // Add image info
        const imageInfoWrapper = document.createElement('div');
        imageInfoWrapper.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const imageTypeIcon = document.createElement('span');
        imageTypeIcon.innerHTML = slideContainer ? '🖼️' : '📸';
        imageTypeIcon.style.cssText = `
            font-size: 14px;
            opacity: 0.8;
        `;
        
        const imageTypeLabel = document.createElement('span');
        imageTypeLabel.textContent = slideContainer ? 'Gallery Image' : 'Single Image';
        imageTypeLabel.style.cssText = `
            font-size: 13px;
            color: #555;
            font-weight: 500;
        `;
        
        imageInfoWrapper.appendChild(imageTypeIcon);
        imageInfoWrapper.appendChild(imageTypeLabel);
        
        // Add location info
        const locationInfo = document.createElement('div');
        locationInfo.style.cssText = `
            font-size: 12px;
            color: #888;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        
        locationInfo.innerHTML = '<span style="font-size: 10px;">📍</span> Luzon, Philippines';
        
        metaContainer.appendChild(imageInfoWrapper);
        metaContainer.appendChild(locationInfo);
        
        // Right side: actions area
        const actionsContainer = document.createElement('div');
        actionsContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 16px;
        `;
        
        // Add counter for slideshow
        if (slideContainer) {
            const images = Array.from(slideContainer.querySelectorAll('.slideshow-image'));
            const imageCounter = document.createElement('div');
            imageCounter.style.cssText = `
                font-size: 13px;
                color: #666;
                background: #ecedf0;
                padding: 4px 10px;
                border-radius: 12px;
                font-variant-numeric: tabular-nums;
            `;
            
            // Set initial counter value
            const initialIndex = images.findIndex(img => img.classList.contains('active'));
            imageCounter.textContent = `${initialIndex + 1} / ${images.length}`;
            imageCounter.id = 'modal-image-counter';
            
            // We need to update the showModalImage function to update the counter
            const originalShowModalImage = window.showModalImage;
            window.showModalImage = function(index) {
                if (typeof originalShowModalImage === 'function') {
                    originalShowModalImage(index);
                }
                imageCounter.textContent = `${index + 1} / ${images.length}`;
            };
            
            actionsContainer.appendChild(imageCounter);
        }
        
        // Close button with icon
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-modal';
        closeBtn.innerHTML = '<span style="margin-right: 6px; font-size: 14px;">✕</span> Close';
        closeBtn.style.cssText = `
            background: #f0f2f5;
            color: #1a1a1a;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            letter-spacing: 0.02em;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#e4e6ea';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = '#f0f2f5';
        });
        
        actionsContainer.appendChild(closeBtn);
        
        // Assemble the footer
        modalFooter.appendChild(metaContainer);
        modalFooter.appendChild(actionsContainer);
        
        // Assemble the modal parts
        modalInfo.appendChild(modalTitle);
        modalInfo.appendChild(modalDesc);
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalInfo);
        modalContent.appendChild(modalFooter);
        modalContent.appendChild(closeIcon);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animate in with more sophisticated motion
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1) translateY(0)';
        });

        // Close modal function
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95) translateY(20px)';
            document.body.style.overflow = '';
            
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 400);
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        closeBtn.addEventListener('click', closeModal);
        closeIcon.addEventListener('click', closeModal);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
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

    initSlideshows() {
        const slideshows = document.querySelectorAll('.slideshow-container');
        
        slideshows.forEach(slideshow => {
            const images = slideshow.querySelectorAll('.slideshow-image');
            const dots = slideshow.querySelectorAll('.dot');
            const prevArrow = slideshow.querySelector('.prev');
            const nextArrow = slideshow.querySelector('.next');
            let currentIndex = 0;
            let slideInterval;
            
            // Function to show a specific slide
            const showSlide = (index) => {
                // Handle index boundaries
                if (index < 0) {
                    index = images.length - 1;
                } else if (index >= images.length) {
                    index = 0;
                }
                
                // Hide all images
                images.forEach(image => image.classList.remove('active'));
                
                // Remove active class from all dots
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Show the selected image
                images[index].classList.add('active');
                
                // Highlight the corresponding dot
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
                
                // Update current index
                currentIndex = index;
            };
            
            // Function to start automatic slideshow
            const startSlideshow = () => {
                slideInterval = setInterval(() => {
                    showSlide(currentIndex + 1);
                }, 3000); // Change slide every 3 seconds
            };
            
            // Reset interval timer
            const resetInterval = () => {
                clearInterval(slideInterval);
                startSlideshow();
            };
            
            // Start automatic slideshow
            startSlideshow();
            
            // Event listeners for manual navigation
            if (prevArrow) {
                prevArrow.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop event from bubbling to the photo card
                    showSlide(currentIndex - 1);
                    resetInterval();
                });
            }
            
            if (nextArrow) {
                nextArrow.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop event from bubbling to the photo card
                    showSlide(currentIndex + 1);
                    resetInterval();
                });
            }
            
            // Event listeners for dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop event from bubbling to the photo card
                    showSlide(index);
                    resetInterval();
                });
            });
            
            // Pause slideshow on hover
            slideshow.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            // Resume slideshow after hover
            slideshow.addEventListener('mouseleave', () => {
                startSlideshow();
            });
        });
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