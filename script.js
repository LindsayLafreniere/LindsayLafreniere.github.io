// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-link');
const cursorFollower = document.querySelector('.cursor-follower');
const fadeElements = document.querySelectorAll('.fade-in');
const sections = document.querySelectorAll('section');
const contactForm = document.querySelector('.contact-form');

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Highlight current nav item
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === `#${currentPage}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Animate hero section elements immediately if on home page
  if (currentPage === 'index.html' || currentPage === '') {
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero h2');
    
    if (heroTitle) heroTitle.classList.add('active');
    if (heroSubtitle) heroSubtitle.classList.add('active');
  }
  
  // Check for elements in viewport on initial load
  checkFadeElements();
  
  // Set active nav link based on scroll position
  setActiveNavLink();
  
  // Initialize sliders and featured work section
  initSliders();
  initFeaturedWork();
  
  // Initialize description toggles
  initDescriptionToggles();
  
  // Check if URL has #contact hash
  if (window.location.hash === '#contact') {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      // Add a small delay to ensure page has loaded
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
});

// Header scroll effects
window.addEventListener('scroll', () => {
  // Add class to header when scrolled
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Check for elements to fade in
  checkFadeElements();
  
  // Update active nav link
  setActiveNavLink();
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    nav.classList.remove('active');
  });
});

// Custom cursor follower
if (!isMobileDevice()) {
  document.addEventListener('mousemove', (e) => {
    cursorFollower.style.opacity = '1';
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Smooth follow with slight delay using CSS transform
    requestAnimationFrame(() => {
      cursorFollower.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
  });
  
  // Cursor effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .work-item, .social-link');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorFollower.style.width = '50px';
      cursorFollower.style.height = '50px';
      cursorFollower.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
      cursorFollower.style.border = 'none';
    });
    
    element.addEventListener('mouseleave', () => {
      cursorFollower.style.width = '30px';
      cursorFollower.style.height = '30px';
      cursorFollower.style.backgroundColor = 'transparent';
      cursorFollower.style.border = '2px solid var(--primary-color)';
    });
  });
  
  // Hide cursor when leaving document
  document.addEventListener('mouseleave', () => {
    cursorFollower.style.opacity = '0';
  });
  
  // Show cursor when entering document
  document.addEventListener('mouseenter', () => {
    cursorFollower.style.opacity = '1';
  });
}

// Scroll animations for fade-in elements
function checkFadeElements() {
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight * 0.85) {
      element.classList.add('visible');
    }
  });
}

// Set active nav link based on scroll position
function setActiveNavLink() {
  const scrollPosition = window.scrollY;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Contact form submission (prevent default)
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (name && email && subject && message) {
      // In a real application, you would send this data to your server
      console.log('Form submitted:', { name, email, subject, message });
      
      // Show success message
      const submitButton = contactForm.querySelector('button');
      const originalContent = submitButton.innerHTML;
      
      submitButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Message Sent!</span>
      `;
      
      submitButton.disabled = true;
      
      // Reset form
      contactForm.reset();
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }, 3000);
    }
  });
}

// Podcast waveform animations
document.querySelectorAll('.podcast-item').forEach((podcast, index) => {
  const waveform = podcast.querySelector('.podcast-waveform path');
  const randomDelay = index * 0.2;
  
  if (waveform) {
    waveform.style.animationDelay = `${randomDelay}s`;
  }
});

// Utility function to detect mobile devices
function isMobileDevice() {
  return (window.innerWidth <= 768) || 
         ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) || 
         (navigator.msMaxTouchPoints > 0);
}

// Initialize dynamic elements in work items
document.querySelectorAll('.work-item').forEach(item => {
  const bgColor = item.querySelector('.work-image').style.getPropertyValue('--bg-color');
  item.querySelector('.work-image').style.backgroundColor = bgColor;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Writing sliders functionality
function initSliders() {
  const sliders = [
    { id: 'health-slider', dotsId: 'health-dots' },
    { id: 'cannabis-slider', dotsId: 'cannabis-dots' },
    { id: 'media-slider', dotsId: 'media-dots' },
    { id: 'lifestyle-slider', dotsId: 'lifestyle-dots' }
  ];
  
  sliders.forEach(slider => {
    if (document.getElementById(slider.id)) {
      setupSlider(slider.id, slider.dotsId);
    }
  });
  
  // Make writing items clickable
  document.querySelectorAll('.writing-item').forEach(item => {
    item.addEventListener('click', function() {
      const title = this.querySelector('h3').textContent;
      // Create a safer slug from title
      let slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
        
      // Map specific titles to known filenames
      const fileMap = {
        'sunbathing and surgical wounds': 'post-sunbathing-surgical-wounds',
        'probiotics for eczema do they really work': 'post-probiotics-eczema',
        'talk it forward': 'post-talk-it-forward'
      };
      
      // Use mapped filename if available, otherwise use generated slug
      const fileSlug = fileMap[slug] || `post-${slug}`;
      window.location.href = `${fileSlug}.html`;
    });
    
    // Add cursor pointer style
    item.style.cursor = 'pointer';
  });
  
  // Make podcast items clickable too
  document.querySelectorAll('.podcast-item').forEach(item => {
    item.addEventListener('click', function() {
      const title = this.querySelector('h3').textContent;
      // Convert title to slug and redirect to the post page
      const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      window.location.href = `post-${slug}.html`;
    });
    
    // Add cursor pointer style
    item.style.cursor = 'pointer';
  });
}

function setupSlider(sliderId, dotsId) {
  const sliderContainer = document.getElementById(sliderId);
  if (!sliderContainer) return;
  
  const sliderWrapper = sliderContainer.querySelector('.slider-wrapper');
  const slides = sliderWrapper.querySelectorAll('.writing-item');
  const dotsContainer = document.getElementById(dotsId);
  
  if (slides.length === 0) return;
  
  // Create dots based on the number of slides
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      goToSlide(sliderWrapper, slides, i, dotsContainer);
    });
    dotsContainer.appendChild(dot);
  }
  
  // Add touch events for mobile swipe
  let startX, moveX;
  sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  sliderContainer.addEventListener('touchmove', (e) => {
    moveX = e.touches[0].clientX;
  });
  
  sliderContainer.addEventListener('touchend', () => {
    if (!startX || !moveX) return;
    
    const diff = startX - moveX;
    const threshold = 50; // minimum distance to be considered a swipe
    
    if (Math.abs(diff) > threshold) {
      const activeDot = dotsContainer.querySelector('.slider-dot.active');
      if (!activeDot) return; // Add this check to avoid null reference
      
      const currentIndex = parseInt(activeDot.dataset.index);
      
      if (diff > 0) { // swipe left
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(sliderWrapper, slides, nextIndex, dotsContainer);
      } else { // swipe right
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(sliderWrapper, slides, prevIndex, dotsContainer);
      }
    }
    
    startX = null;
    moveX = null;
  });
  
  // Adjust slider based on viewport width
  adjustSlider(sliderWrapper, slides);
  window.addEventListener('resize', () => {
    adjustSlider(sliderWrapper, slides);
  });
}

function goToSlide(sliderWrapper, slides, index, dotsContainer) {
  if (slides.length === 0) return; // Add this check to avoid errors
  
  const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
  sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
  
  // Update active dot
  const dots = dotsContainer.querySelectorAll('.slider-dot');
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  dots[index].classList.add('active');
}

function adjustSlider(sliderWrapper, slides) {
  if (slides.length === 0) return;
  
  const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
  const sliderContainer = sliderWrapper.closest('.slider-container');
  if (!sliderContainer) return; // Add this check to avoid null reference
  
  const dotsContainer = sliderContainer.nextElementSibling;
  if (!dotsContainer) return; // Add this check to avoid null reference
  
  const activeDot = dotsContainer.querySelector('.slider-dot.active');
  
  if (activeDot) {
    const currentIndex = parseInt(activeDot.dataset.index);
    sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
}

// Initialize description toggles
function initDescriptionToggles() {
  const toggles = document.querySelectorAll('.toggle-description');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const description = this.previousElementSibling;
      description.classList.toggle('description-truncated');
      description.classList.toggle('description-expanded');
      
      this.textContent = description.classList.contains('description-truncated') ? 'Read more' : 'Read less';
    });
  });
}

// Initialize featured work section
function initFeaturedWork() {
  // Using the original initFeaturedWork code for the featured-slider
  const featuredSlider = document.getElementById('featured-slider');
  if (featuredSlider) {
    setupFeaturedSlider(featuredSlider, 'featured-dots');
    setupSliderButtons(featuredSlider);
  }
  
  // Add new podcast slider initialization
  const podcastSlider = document.getElementById('podcast-slider');
  if (podcastSlider) {
    setupFeaturedSlider(podcastSlider, 'podcast-dots');
    setupSliderButtons(podcastSlider);
  }
}

function setupFeaturedSlider(sliderContainer, dotsId) {
  if (!sliderContainer) return;
  
  const featuredWrapper = sliderContainer.querySelector('.featured-wrapper');
  const featuredItems = featuredWrapper.querySelectorAll('.featured-item');
  const dotsContainer = document.getElementById(dotsId);
  
  if (featuredItems.length === 0) return;
  
  // Create dots based on the number of items
  dotsContainer.innerHTML = ''; // Clear any existing dots
  for (let i = 0; i < featuredItems.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('featured-dot');
    if (i === 0) dot.classList.add('active');
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      goToSlide(featuredWrapper, featuredItems, i, dotsContainer);
    });
    dotsContainer.appendChild(dot);
  }
  
  // Enhanced touch handling for smoother swipe
  let startX, moveX, initialOffset;
  
  sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    initialOffset = getTranslateX(featuredWrapper);
    featuredWrapper.style.transition = 'none';
  }, { passive: true });
  
  sliderContainer.addEventListener('touchmove', (e) => {
    if (!startX) return;
    moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    featuredWrapper.style.transform = `translateX(${initialOffset + diff}px)`;
  }, { passive: true });
  
  sliderContainer.addEventListener('touchend', () => {
    featuredWrapper.style.transition = 'transform 0.3s ease-out';
    
    if (!startX || !moveX) return;
    
    const diff = startX - moveX;
    const slideWidth = featuredItems[0].offsetWidth + parseInt(window.getComputedStyle(featuredItems[0]).marginRight);
    const threshold = slideWidth * 0.3; // 30% of slide width
    
    const activeDot = dotsContainer.querySelector('.featured-dot.active');
    if (!activeDot) return;
    
    const currentIndex = parseInt(activeDot.dataset.index);
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) { // swipe left
        const nextIndex = Math.min(currentIndex + 1, featuredItems.length - 1);
        goToSlide(featuredWrapper, featuredItems, nextIndex, dotsContainer);
      } else { // swipe right
        const prevIndex = Math.max(currentIndex - 1, 0);
        goToSlide(featuredWrapper, featuredItems, prevIndex, dotsContainer);
      }
    } else {
      // Return to current slide if swipe wasn't far enough
      goToSlide(featuredWrapper, featuredItems, currentIndex, dotsContainer);
    }
    
    startX = null;
    moveX = null;
  });
  
  // Make featured items clickable
  featuredItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Don't navigate if clicking on the toggle description
      if (e.target.classList.contains('toggle-description')) return;
      
      const link = this.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });
  
  // Adjust featured slider based on viewport width
  adjustSlider(featuredWrapper, featuredItems);
  window.addEventListener('resize', () => {
    adjustSlider(featuredWrapper, featuredItems);
  });
}

// Get current translateX value
function getTranslateX(element) {
  const style = window.getComputedStyle(element);
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix.m41;
}

// Setup slider navigation buttons
function setupSliderButtons(sliderContainer) {
  const wrapper = sliderContainer.querySelector('.featured-wrapper');
  const items = wrapper.querySelectorAll('.featured-item');
  const dotsContainer = sliderContainer.nextElementSibling;
  
  const prevButton = sliderContainer.querySelector('.slider-button.prev');
  const nextButton = sliderContainer.querySelector('.slider-button.next');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const activeDot = dotsContainer.querySelector('.featured-dot.active');
      if (!activeDot) return;
      
      const currentIndex = parseInt(activeDot.dataset.index);
      const prevIndex = Math.max(currentIndex - 1, 0);
      
      if (prevIndex !== currentIndex) {
        goToSlide(wrapper, items, prevIndex, dotsContainer);
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const activeDot = dotsContainer.querySelector('.featured-dot.active');
      if (!activeDot) return;
      
      const currentIndex = parseInt(activeDot.dataset.index);
      const nextIndex = Math.min(currentIndex + 1, items.length - 1);
      
      if (nextIndex !== currentIndex) {
        goToSlide(wrapper, items, nextIndex, dotsContainer);
      }
    });
  }
}

function goToSlide(sliderWrapper, slides, index, dotsContainer) {
  if (slides.length === 0) return; // Add this check to avoid errors
  
  const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
  sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
  
  // Update active dot
  const dots = dotsContainer.querySelectorAll('.featured-dot');
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  dots[index].classList.add('active');
}