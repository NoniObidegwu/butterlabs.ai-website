// Butter Labs Demo Application JavaScript
class ButterLabsDemo {
    constructor() {
        this.currentSection = 'home';
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDemo();
        this.setupHeroButtons();
        this.setupMobileNav();
        this.setupScrollAnimations();
        
        // Initial setup
        this.showSection('home');
        setTimeout(() => {
            this.animateAccuracyBars();
        }, 500);
    }

    // Navigation Management
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });
    }

    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            this.currentSection = sectionId;
        }

        // Update navigation
        this.updateActiveNavLink(sectionId);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger section-specific animations
        setTimeout(() => {
            this.triggerSectionAnimations(sectionId);
        }, 100);
    }

    showSection(sectionId) {
        this.navigateToSection(sectionId);
    }

    updateActiveNavLink(sectionId = null) {
        const activeSection = sectionId || this.currentSection;
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    triggerSectionAnimations(sectionId) {
        switch (sectionId) {
            case 'home':
                setTimeout(() => this.animateAccuracyBars(), 200);
                break;
            case 'demo':
                setTimeout(() => this.startWaveformAnimations(), 200);
                break;
        }
    }

    // Demo Section Functionality
    setupDemo() {
        const accentSelect = document.getElementById('accentSelect');
        const startDemoBtn = document.getElementById('startDemo');

        if (startDemoBtn && accentSelect) {
            startDemoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedAccent = accentSelect.value;
                
                if (selectedAccent) {
                    this.runDemo(selectedAccent);
                } else {
                    alert('Please select an accent first');
                }
            });
        }

        // Start waveform animations
        this.startWaveformAnimations();
    }

    async runDemo(accent) {
        if (this.isProcessing) return;

        this.isProcessing = true;
        const startBtn = document.getElementById('startDemo');
        const processingIndicator = document.querySelector('.processing-indicator');
        const detectedAccent = document.getElementById('detectedAccent');
        const confidenceScore = document.getElementById('confidenceScore');
        const processingTime = document.getElementById('processingTime');

        // Update button state
        if (startBtn) {
            startBtn.textContent = 'Processing...';
            startBtn.disabled = true;
        }

        // Show processing indicator
        if (processingIndicator) {
            processingIndicator.classList.add('active');
        }

        // Simulate processing delay
        await this.sleep(2000 + Math.random() * 1000);

        // Generate demo results
        const results = this.generateDemoResults(accent);

        // Update results
        if (detectedAccent) detectedAccent.textContent = results.accent;
        if (confidenceScore) confidenceScore.textContent = results.confidence;
        if (processingTime) processingTime.textContent = results.processingTime;

        // Update conversation example
        this.updateConversationExample(accent);

        // Hide processing indicator
        if (processingIndicator) {
            processingIndicator.classList.remove('active');
        }

        // Reset button
        if (startBtn) {
            startBtn.textContent = 'Start Recognition';
            startBtn.disabled = false;
        }
        
        this.isProcessing = false;
    }

    generateDemoResults(accent) {
        const accentNames = {
            'scottish': 'Scottish',
            'welsh': 'Welsh',
            'northern-irish': 'Northern Irish',
            'geordie': 'Geordie',
            'yorkshire': 'Yorkshire',
            'cornish': 'Cornish',
            'brummie': 'Brummie',
            'scouse': 'Scouse',
            'devon': 'Devon',
            'norfolk': 'Norfolk',
            'cockney': 'Cockney',
            'rp': 'Received Pronunciation',
            'west-country': 'West Country',
            'midlands': 'Midlands'
        };

        return {
            accent: accentNames[accent] || 'Unknown',
            confidence: (95 + Math.random() * 4).toFixed(1) + '%',
            processingTime: (80 + Math.random() * 40).toFixed(0) + 'ms'
        };
    }

    updateConversationExample(accent) {
        const messages = document.getElementById('conversationMessages');
        if (!messages) return;

        const examples = {
            'scottish': {
                user: 'Och, I cannae get intae my account',
                userNote: '(Scottish accent detected)',
                ai: 'I understand you\'re having trouble accessing your account. Let me help you with that right away.',
                aiNote: '(Response adapted for Scottish dialect patterns)'
            },
            'geordie': {
                user: 'Howay man, me account\'s not working',
                userNote: '(Geordie accent detected)',
                ai: 'I can see you\'re having issues with your account. Let me sort that out for you.',
                aiNote: '(Response adapted for Geordie dialect patterns)'
            },
            'welsh': {
                user: 'Right then, my account isn\'t working properly',
                userNote: '(Welsh accent detected)',
                ai: 'I understand there\'s a problem with your account. I\'ll help you resolve this straight away.',
                aiNote: '(Response adapted for Welsh dialect patterns)'
            }
        };

        const example = examples[accent] || {
            user: 'Hello, I need help with my account',
            userNote: `(${accent.replace('-', ' ')} accent detected)`,
            ai: 'Hello! I\'d be happy to help you with your account. Can you please provide your account number?',
            aiNote: `(Response adapted for ${accent.replace('-', ' ')} accent patterns)`
        };

        messages.innerHTML = `
            <div class="message user">
                <span class="message-text">${example.user}</span>
                <span class="message-accent">${example.userNote}</span>
            </div>
            <div class="message ai">
                <span class="message-text">${example.ai}</span>
                <span class="message-note">${example.aiNote}</span>
            </div>
        `;
    }

    startWaveformAnimations() {
        const waveBars = document.querySelectorAll('.wave-bar');
        
        if (this.waveformInterval) {
            clearInterval(this.waveformInterval);
        }
        
        this.waveformInterval = setInterval(() => {
            waveBars.forEach((bar, index) => {
                const time = Date.now() / 1000;
                const frequency = 0.5 + (index % 3) * 0.3;
                const amplitude = 30 + Math.sin(time * frequency + index * 0.5) * 25;
                const noise = Math.random() * 15;
                
                bar.style.height = Math.max(8, amplitude + noise) + '%';
            });
        }, 200);
    }

    // Accuracy Bar Animations
    animateAccuracyBars() {
        const accuracyFills = document.querySelectorAll('.accuracy-fill');
        
        // Reset first
        accuracyFills.forEach(fill => {
            fill.style.width = '0%';
        });
        
        // Then animate
        setTimeout(() => {
            accuracyFills.forEach((fill, index) => {
                setTimeout(() => {
                    if (fill.classList.contains('butter-labs')) {
                        fill.style.width = '98%';
                    } else if (fill.classList.contains('competitor')) {
                        fill.style.width = '76%';
                    }
                }, index * 500);
            });
        }, 200);
    }

    // Hero Button Handlers
    setupHeroButtons() {
        const tryDemoBtn = document.getElementById('tryDemoBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');

        if (tryDemoBtn) {
            tryDemoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('demo');
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('architecture');
            });
        }
    }

    // Mobile Navigation
    setupMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.classList.toggle('show');
            });

            // Close mobile nav when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks) {
                        navLinks.classList.remove('show');
                    }
                });
            });

            // Close mobile nav when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('show');
                }
            });
        }
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all cards and major elements
        document.querySelectorAll('.feature-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility Functions
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ButterLabsDemo();
    
    // Make app globally available for debugging
    window.ButterLabsApp = app;
});