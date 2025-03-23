/* Kunal Sharma IIT Jammu */
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Only create navigation for desktop
    if (window.innerWidth > 768) {
        createNavigation();
    }

    // Add scroll to top button
    createScrollToTopButton();

    // Add dark mode toggle
    addDarkModeToggle();

    // Initialize skills filter
    initSkillsFilter();

    // Update copyright year to current year
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('current-year');
    
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
    
    // For backward compatibility with the previous copyright code
    const copyrightElement = document.querySelector('footer p');
    
    if (copyrightElement && !document.getElementById('current-year')) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/\d{4}/, currentYear);
    }

    // Add loading indicator
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Add PDF download functionality
    const downloadBtn = document.getElementById('downloadPDF');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Temporarily hide UI elements that shouldn't be in PDF
            const elementsToHide = document.querySelectorAll('.cv-nav, .scroll-top, .dark-mode-toggle');
            elementsToHide.forEach(el => el.style.display = 'none');
            
            // Set body to light mode for printing
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                document.body.classList.remove('dark-mode');
            }
            
            // Add print-specific class
            document.body.classList.add('printing');
            
            // Create a clone of the container for printing
            const container = document.querySelector('.container');
            const printContainer = container.cloneNode(true);
            printContainer.style.position = 'absolute';
            printContainer.style.left = '-9999px';
            document.body.appendChild(printContainer);
            
            // Set print settings
            const printSettings = {
                margin: 0,
                scale: 1,
                landscape: false,
                printBackground: true,
                preferCSSPageSize: true,
                pageRanges: '1-2'
            };
            
            // Trigger print with settings
            window.print();
            
            // Clean up
            document.body.removeChild(printContainer);
            document.body.classList.remove('printing');
            
            // Restore UI elements
            elementsToHide.forEach(el => el.style.display = '');
            
            // Restore dark mode if it was enabled
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            }
        });
    }
});

// Create navigation menu (only for desktop)
function createNavigation() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    const nav = document.createElement('nav');
    nav.classList.add('cv-nav');
    
    const navList = document.createElement('ul');
    
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const sectionTitle = section.querySelector('h2').textContent.trim();
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${sectionId}`;
        link.textContent = sectionTitle.replace(/^\S+\s+/, ''); // Remove icon
        
        listItem.appendChild(link);
        navList.appendChild(listItem);
    });
    
    nav.appendChild(navList);
    
    // Insert navigation after header
    const header = document.querySelector('header');
    header.parentNode.insertBefore(nav, header.nextSibling);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cv-nav {
            background-color: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            justify-content: center;
            padding: 0.5rem 2rem;
        }
        
        .cv-nav ul {
            list-style: none;
            display: flex;
            padding: 0;
            margin: 0;
        }
        
        .cv-nav li {
            margin: 0 1rem;
        }
        
        .cv-nav a {
            color: #333;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            display: block;
            position: relative;
        }
        
        .cv-nav a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: #0066cc;
            transition: width 0.3s ease;
        }
        
        .cv-nav a:hover::after {
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .cv-nav {
                display: none !important; /* Hide navigation on mobile */
            }
        }
    `;
    
    document.head.appendChild(style);

    // Highlight active section on scroll
    highlightActiveSection();
}

// Create scroll to top button
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.classList.add('scroll-top');
    button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    button.title = 'Scroll to top';
    button.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background-color: #0066cc;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .scroll-top.visible {
            opacity: 1;
        }
        
        .scroll-top:hover {
            background-color: #0055aa;
        }
        
        @media (max-width: 768px) {
            .scroll-top {
                bottom: 1.5rem;
                right: 1.5rem;
                width: 36px;
                height: 36px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add dark mode toggle
function addDarkModeToggle() {
    const button = document.createElement('button');
    button.classList.add('dark-mode-toggle');
    button.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
    button.title = 'Toggle dark mode';
    button.setAttribute('aria-label', 'Toggle dark mode');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode-toggle {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background-color: #0066cc;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .dark-mode-toggle:hover {
            background-color: #0055aa;
        }
        
        body.dark-mode {
            background-color: #1a1a1a;
            color: #f0f0f0;
            background-image: radial-gradient(#444 1px, transparent 1px);
            background-size: 20px 20px;
            background-attachment: fixed;
        }
        
        body.dark-mode .container {
            background-color: #2a2a2a;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        body.dark-mode header {
            background: linear-gradient(135deg, #004c99, #002040);
        }
        
        body.dark-mode h2 {
            border-bottom-color: #444;
        }
        
        body.dark-mode .cv-nav {
            background-color: #2a2a2a;
        }
        
        body.dark-mode .cv-nav a {
            color: #f0f0f0;
        }
        
        body.dark-mode .project-card {
            border-color: #444;
        }
        
        body.dark-mode .language-list li {
            background-color: #3a3a3a;
            color: #f0f0f0;
        }
        
        body.dark-mode footer {
            background-color: #222;
        }
        
        body.dark-mode .skill-category {
            background-color: #2d2d2d;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        
        body.dark-mode .filter-btn {
            background-color: #333;
            color: #ddd;
        }
        
        body.dark-mode .filter-btn.active {
            background-color: #004c99;
        }
        
        body.dark-mode .download-btn {
            background-color: #333;
            color: #f0f0f0;
        }

        body {
            background-color: #f9f9f9;
            background-image: radial-gradient(#ccc 1px, transparent 1px);
            background-size: 20px 20px;
            background-attachment: fixed;
        }

        @media (max-width: 768px) {
            .dark-mode-toggle {
                top: 1.5rem;
                right: 1.5rem;
                width: 36px;
                height: 36px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(button);
    
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        button.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
    }
    
    // Toggle dark mode on click
    button.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'true');
            button.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
        } else {
            localStorage.setItem('darkMode', 'false');
            button.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        }
    });
}

function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillsContainer = document.querySelector('.skills-container');
    
    if (!filterButtons.length || !skillCategories.length || !skillsContainer) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Reset animations by removing and re-adding the filtered class
            skillsContainer.classList.remove('filtered');
            
            // Force browser to recognize the change before adding the class back
            void skillsContainer.offsetWidth;
            
            // Apply filtered class if not showing all
            if (filter !== 'all') {
                skillsContainer.classList.add('filtered');
                
                // Hide all categories first
                skillCategories.forEach(category => {
                    category.classList.add('hidden');
                    category.style.opacity = '0';
                });
                
                // Then show only the matching category
                skillCategories.forEach(category => {
                    if (category.getAttribute('data-category') === filter) {
                        category.classList.remove('hidden');
                        setTimeout(() => {
                            category.style.opacity = '1';
                            category.classList.add('fade-in');
                        }, 50);
                    }
                });
            } else {
                // Show all categories for 'all' filter
                skillCategories.forEach(category => {
                    category.classList.remove('hidden');
                    category.style.opacity = '1';
                    setTimeout(() => {
                        category.classList.add('fade-in');
                    }, 50);
                });
            }
            
            // Reset skill bar animations
            document.querySelectorAll('.skill-bar::before').forEach(bar => {
                bar.style.animation = 'none';
                void bar.offsetWidth; // Force reflow
                bar.style.animation = '';
            });
        });
    });
    
    // Reset skill bar animations when they become visible in viewport
    const observeSkillBars = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-bar');
                    skillBars.forEach(bar => {
                        bar.style.animation = 'none';
                        void bar.offsetWidth; // Force reflow
                        bar.style.animation = '';
                    });
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        skillCategories.forEach(category => {
            observer.observe(category);
        });
    };
    
    // Initialize the observer
    if ('IntersectionObserver' in window) {
        observeSkillBars();
    }
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.cv-nav a');
    
    if (!sections.length || !navLinks.length) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            
            if (href === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Add style for active link
    const style = document.createElement('style');
    style.textContent = `
        .cv-nav a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

