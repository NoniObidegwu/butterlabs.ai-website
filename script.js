// Enhanced Xoiq AI Application Data
const demoData = {
    billing: {
        customer_messages: [
            "Hi, my bill seems wrong this month, it's £50 higher than usual",
            "That sounds perfect, can you switch me now?"
        ],
        ai_responses: [
            "I can help with that! I can see your account and the increase is due to overage charges. Let me break this down and offer you a better plan that will actually save you £30 monthly.",
            "Absolutely! I've moved you to our unlimited plan effective immediately. You'll save £30/month going forward, and I've applied a £25 credit for the overage. Confirmation sent to your email."
        ],
        metrics: {
            resolution_time: "90 seconds",
            satisfaction: "5/5",
            cost_saved: "£12",
            accent_detected: "Scottish",
            confidence: "97%"
        }
    },
    technical: {
        customer_messages: [
            "My internet has been cutting out all week, it's driving me mad",
            "Yes please, that would be brilliant"
        ],
        ai_responses: [
            "I can see intermittent connection issues on your line. I've run diagnostics and found the problem - there's signal degradation at your local exchange. I can schedule a priority engineer visit for tomorrow morning at no charge.",
            "Perfect! Engineer booked for 9-11am tomorrow. I've also applied a service credit to your account and upgraded your connection speed at no extra cost as compensation."
        ],
        metrics: {
            resolution_time: "2 minutes",
            satisfaction: "5/5",
            cost_saved: "£15",
            accent_detected: "Welsh",
            confidence: "96%"
        }
    },
    account: {
        customer_messages: [
            "I need to change my address and transfer my services",
            "Brilliant, thank you so much!"
        ],
        ai_responses: [
            "I can help you with that transfer right away. I can see availability at your new address and we can keep all your current services at the same rates. I'll also waive the transfer fee as a goodwill gesture.",
            "You're very welcome! Your services will be active at the new address by tomorrow evening. I've sent you confirmation details and a temporary mobile hotspot will arrive today for any transition period."
        ],
        metrics: {
            resolution_time: "85 seconds",
            satisfaction: "5/5",
            cost_saved: "£18",
            accent_detected: "Northern Irish",
            confidence: "95%"
        }
    },
    service: {
        customer_messages: [
            "My TV service keeps freezing during programs",
            "That would be great, when can they come?"
        ],
        ai_responses: [
            "I can see there's an issue with your set-top box. The diagnostics show it needs replacing. I can arrange a same-day replacement delivery and our technician will set it up for you at no charge.",
            "I've scheduled a technician for this afternoon between 2-4pm. They'll bring a new premium box and I've also added 3 months of premium sports channels as an apology for the inconvenience."
        ],
        metrics: {
            resolution_time: "75 seconds",
            satisfaction: "5/5",
            cost_saved: "£20",
            accent_detected: "Geordie",
            confidence: "94%"
        }
    },
    cancellation: {
        customer_messages: [
            "I'm thinking of cancelling my service, the bills are just too high",
            "Oh wow, that's much better! Yes, let's do that"
        ],
        ai_responses: [
            "I understand your concerns about costs. Before cancelling, let me show you what I can offer. I can reduce your monthly bill by £35 while giving you more channels and faster internet. Would you like to hear the details?",
            "Excellent! I've applied the new package to your account. Your bill drops from £89 to £54 monthly, you get 200Mbps instead of 50Mbps internet, and I've added the full entertainment package. Changes are effective immediately."
        ],
        metrics: {
            resolution_time: "2 minutes",
            satisfaction: "5/5",
            cost_saved: "£25",
            accent_detected: "Yorkshire",
            confidence: "98%"
        }
    }
};

// DOM elements
let conversationMessages, waveformBars;
let currentDemo = null;
let isTyping = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeROICalculator();
    initializeDemo();
    initializeWaveform();
    initializeScrolling();
    initializeForm();
    initializeAnimations();
    // Set consistent stats without animation initially
    setConsistentStats();
});

function setConsistentStats() {
    // Ensure consistent statistics display - no animation on initial load
    const stats = [
        { element: document.querySelector('.stat__number'), value: '40%' },
        { element: document.querySelectorAll('.stat__number')[1], value: '95%' },
        { element: document.querySelectorAll('.stat__number')[2], value: '24/7' }
    ];
    
    stats.forEach((stat, index) => {
        if (stat.element) {
            const values = ['40%', '95%', '24/7'];
            stat.element.textContent = values[index];
        }
    });
}

function initializeElements() {
    conversationMessages = document.getElementById('messages');
    waveformBars = document.querySelectorAll('.waveform__bar');
    
    // Event listeners
    const startDemoBtn = document.getElementById('startDemo');
    if (startDemoBtn) {
        startDemoBtn.addEventListener('click', startDemo);
    }
    
    const showTechnicalBtn = document.getElementById('showTechnical');
    if (showTechnicalBtn) {
        showTechnicalBtn.addEventListener('click', showTechnicalDemo);
    }
    
    const backToDemoBtn = document.getElementById('backToDemo');
    if (backToDemoBtn) {
        backToDemoBtn.addEventListener('click', backToMainDemo);
    }
    
    // ROI calculator inputs with proper event handling
    const roiInputs = ['agentCount', 'avgSalary', 'callVolume'];
    roiInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            // Use both input and change events to ensure updates
            input.addEventListener('input', debounceROICalculation);
            input.addEventListener('change', debounceROICalculation);
            input.addEventListener('blur', calculateROI);
        }
    });
}

// Debounced ROI calculation to prevent excessive calls
let roiTimeout;
function debounceROICalculation() {
    clearTimeout(roiTimeout);
    roiTimeout = setTimeout(calculateROI, 300);
}

// Demo Functionality
function initializeDemo() {
    // Reset demo state
    const partA = document.getElementById('partA');
    const partB = document.getElementById('partB');
    const demoResults = document.getElementById('demoResults');
    const placeholder = document.querySelector('.conversation__placeholder');
    
    if (partA) partA.style.display = 'block';
    if (partB) partB.style.display = 'none';
    if (demoResults) demoResults.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    
    if (conversationMessages) {
        conversationMessages.innerHTML = '';
    }
}

async function startDemo() {
    if (isTyping) return;
    
    const issueTypeSelect = document.getElementById('issueType');
    const issueType = issueTypeSelect.value;
    const startBtn = document.getElementById('startDemo');
    const demoResults = document.getElementById('demoResults');
    const placeholder = document.querySelector('.conversation__placeholder');
    
    currentDemo = demoData[issueType];
    
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = 'Starting Conversation...';
    }
    
    // Hide placeholder and clear messages
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    if (conversationMessages) {
        conversationMessages.innerHTML = '';
    }
    
    if (demoResults) {
        demoResults.style.display = 'none';
    }
    
    // Start conversation
    await playConversation(currentDemo);
    
    // Show results
    showDemoResults(currentDemo.metrics);
    
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = 'Start Conversation';
    }
}

async function playConversation(demo) {
    const messages = demo.customer_messages;
    const responses = demo.ai_responses;
    
    for (let i = 0; i < messages.length; i++) {
        // Customer message
        await addMessage(messages[i], 'customer');
        await delay(1000);
        
        // AI response
        await addMessage(responses[i], 'ai');
        await delay(1500);
    }
}

async function addMessage(text, sender) {
    isTyping = true;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;
    
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message__sender';
    senderDiv.textContent = sender === 'customer' ? 'Customer' : 'Xoiq AI';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message__text';
    
    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(textDiv);
    conversationMessages.appendChild(messageDiv);
    
    // Typing effect
    await typeText(textDiv, text);
    
    // Scroll to bottom
    conversationMessages.scrollTop = conversationMessages.scrollHeight;
    
    isTyping = false;
}

function typeText(element, text) {
    return new Promise((resolve) => {
        let i = 0;
        const speed = 30; // ms per character
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        type();
    });
}

function showDemoResults(metrics) {
    const demoResults = document.getElementById('demoResults');
    
    const resolutionElement = document.getElementById('resolutionTime');
    const satisfactionElement = document.getElementById('satisfaction');
    const costSavedElement = document.getElementById('costSaved');
    
    if (resolutionElement) resolutionElement.textContent = metrics.resolution_time;
    if (satisfactionElement) satisfactionElement.textContent = metrics.satisfaction;
    if (costSavedElement) costSavedElement.textContent = metrics.cost_saved;
    
    if (demoResults) {
        demoResults.style.display = 'block';
    }
}

function showTechnicalDemo() {
    const partA = document.getElementById('partA');
    const partB = document.getElementById('partB');
    
    if (partA) partA.style.display = 'none';
    if (partB) partB.style.display = 'block';
    
    if (currentDemo) {
        const metrics = currentDemo.metrics;
        const accentElement = document.getElementById('detectedAccent');
        const confidenceElement = document.getElementById('confidence');
        
        if (accentElement) accentElement.textContent = metrics.accent_detected;
        if (confidenceElement) confidenceElement.textContent = metrics.confidence;
    }
    
    // Animate waveform
    startWaveformAnimation();
}

function backToMainDemo() {
    const partA = document.getElementById('partA');
    const partB = document.getElementById('partB');
    
    if (partA) partA.style.display = 'block';
    if (partB) partB.style.display = 'none';
    
    stopWaveformAnimation();
}

// Waveform Animation
function initializeWaveform() {
    waveformBars = document.querySelectorAll('.waveform__bar');
}

function startWaveformAnimation() {
    if (waveformBars.length === 0) return;
    
    waveformBars.forEach((bar, index) => {
        bar.style.animationPlayState = 'running';
        bar.style.animationDelay = `${index * 0.1}s`;
    });
}

function stopWaveformAnimation() {
    waveformBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
    });
}

// Enhanced ROI Calculator with proper input handling
function initializeROICalculator() {
    calculateROI();
}

function calculateROI() {
    const agentCountInput = document.getElementById('agentCount');
    const avgSalaryInput = document.getElementById('avgSalary');
    const callVolumeInput = document.getElementById('callVolume');
    
    // Ensure inputs exist and have valid values
    if (!agentCountInput || !avgSalaryInput || !callVolumeInput) {
        return;
    }
    
    const agentCount = parseInt(agentCountInput.value) || 50;
    const avgSalary = parseInt(avgSalaryInput.value) || 35000;
    const callVolume = parseInt(callVolumeInput.value) || 10000;
    
    // Validate input ranges
    const validatedAgentCount = Math.max(1, Math.min(10000, agentCount));
    const validatedAvgSalary = Math.max(15000, Math.min(200000, avgSalary));
    const validatedCallVolume = Math.max(100, Math.min(1000000, callVolume));
    
    // Update inputs if they were corrected
    if (agentCountInput.value != validatedAgentCount) {
        agentCountInput.value = validatedAgentCount;
    }
    if (avgSalaryInput.value != validatedAvgSalary) {
        avgSalaryInput.value = validatedAvgSalary;
    }
    if (callVolumeInput.value != validatedCallVolume) {
        callVolumeInput.value = validatedCallVolume;
    }
    
    // Enhanced calculations
    const currentMonthlyCost = (validatedAgentCount * validatedAvgSalary) / 12;
    const callHandlingCost = validatedCallVolume * 8.50; // Current cost per call
    const totalCurrentMonthlyCost = currentMonthlyCost + callHandlingCost;
    
    // With Xoiq AI - 40% reduction in agent costs
    const xoiqCallCost = validatedCallVolume * 0.85; // 90% cost reduction per call
    const reducedAgentCost = currentMonthlyCost * 0.6; // 40% reduction
    const totalXoiqMonthlyCost = reducedAgentCost + xoiqCallCost;
    
    const monthlySavings = totalCurrentMonthlyCost - totalXoiqMonthlyCost;
    const annualSavings = monthlySavings * 12;
    
    // Implementation and setup costs
    const implementationCost = 50000; // Estimated implementation cost
    const paybackMonths = Math.max(1, Math.ceil(implementationCost / monthlySavings));
    
    // 3-year ROI calculation
    const threeYearSavings = (annualSavings * 3) - implementationCost;
    const threeYearROI = Math.max(0, (threeYearSavings / implementationCost) * 100);
    
    // Break-even analysis
    const costPerCall = 8.50 - 0.85; // Savings per call
    const breakEvenCalls = Math.ceil(implementationCost / costPerCall);
    const monthsToBreakEven = Math.ceil(breakEvenCalls / validatedCallVolume);
    
    // Update display with smooth animations
    updateROIDisplay({
        monthlySavings: monthlySavings,
        annualSavings: annualSavings,
        paybackMonths: paybackMonths,
        threeYearROI: threeYearROI,
        breakEvenCalls: breakEvenCalls,
        monthsToBreakEven: monthsToBreakEven
    });
}

function updateROIDisplay(values) {
    // Update elements with proper error checking
    const elements = {
        'monthlySavings': { value: values.monthlySavings, formatter: (v) => `£${Math.round(v).toLocaleString()}` },
        'annualSavings': { value: values.annualSavings, formatter: (v) => `£${Math.round(v).toLocaleString()}` },
        'paybackPeriod': { value: values.paybackMonths, formatter: (v) => `${Math.round(v)} months` },
        'threeYearROI': { value: values.threeYearROI, formatter: (v) => `${Math.round(v)}%` },
        'breakEvenCalls': { value: values.breakEvenCalls, formatter: (v) => Math.round(v).toLocaleString() },
        'breakEvenTimeline': { value: values.monthsToBreakEven, formatter: (v) => `${Math.round(v)} months` }
    };
    
    Object.entries(elements).forEach(([elementId, config]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = config.formatter(config.value);
        }
    });
}

function animateValue(elementId, start, end, duration, formatter) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const stepTime = Math.abs(Math.floor(duration / 50));
    const increment = range / 50;
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatter(current);
    }, stepTime);
}

// Smooth Scrolling
function initializeScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Enhanced Form Handling with Web3Forms
function initializeForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('formMessage');
    const originalText = button.textContent;
    
    // Update button state
    button.textContent = 'Sending...';
    button.disabled = true;
    
    try {
        // Note: In a real implementation, you would replace 'YOUR_ACCESS_KEY_HERE' 
        // with an actual Web3Forms access key
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // For demo purposes, show success message
        showFormMessage('Thank you! We\'ll send your custom ROI analysis within 24 hours.', 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            form.reset();
        }, 500);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('There was an error submitting your form. Please try again.', 'error');
    }
    
    // Reset button
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Animation Initialization
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.value-prop, .architecture__card, .story__card, .process__step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(31, 33, 33, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(31, 33, 33, 0.95)';
        }
    }
});

// Utility Functions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Responsive menu handling
function initializeResponsiveMenu() {
    const navMenu = document.querySelector('.nav__menu');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.display = 'none';
    menuToggle.style.background = 'transparent';
    menuToggle.style.border = '1px solid var(--border-color)';
    menuToggle.style.color = 'var(--text-primary)';
    menuToggle.style.padding = 'var(--space-8)';
    menuToggle.style.borderRadius = 'var(--radius-base)';
    menuToggle.style.cursor = 'pointer';
    
    // Add to nav
    const nav = document.querySelector('.nav');
    if (nav && navMenu) {
        nav.insertBefore(menuToggle, navMenu);
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav__menu--open');
        });
        
        // Add CSS for mobile menu
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .menu-toggle {
                    display: block !important;
                }
                .nav__menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-color);
                    flex-direction: column;
                    padding: var(--space-16);
                    gap: var(--space-16);
                }
                .nav__menu--open {
                    display: flex !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize responsive menu after DOM load
document.addEventListener('DOMContentLoaded', initializeResponsiveMenu);

// Export functions for global access
window.scrollToSection = scrollToSection;
