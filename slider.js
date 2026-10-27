// New slider functionality with auto-generated dots and arrows
document.addEventListener('DOMContentLoaded', () => {
  initEnhancedSliders();
});

function initEnhancedSliders() {
  const sliderContainers = document.querySelectorAll('.slider-container');
  
  sliderContainers.forEach((container) => {
    const sliderWrapper = container.querySelector('.slider-wrapper');
    const slides = sliderWrapper.querySelectorAll('.writing-item, .featured-item');
    const dotsContainer = container.querySelector('.slider-dots, .featured-dots');
    
    if (!slides.length || !dotsContainer) return;
    
    // 1. Dynamically generate pagination dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      
      dot.addEventListener('click', () => {
        goToSlide(sliderWrapper, slides, index, dotsContainer);
      });
      
      dotsContainer.appendChild(dot);
    });
    
    // 2. Dynamically generate Next / Prev arrows if they aren't there yet
    if (!container.querySelector('.slider-arrow.prev')) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'slider-arrow prev';
      prevBtn.innerHTML = '&#10094;'; // Left chevron arrow
      prevBtn.setAttribute('aria-label', 'Previous slide');
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'slider-arrow next';
      nextBtn.innerHTML = '&#10095;'; // Right chevron arrow
      nextBtn.setAttribute('aria-label', 'Next slide');
      
      container.appendChild(prevBtn);
      container.appendChild(nextBtn);
      
      prevBtn.addEventListener('click', () => {
        const activeDot = dotsContainer.querySelector('.slider-dot.active, .featured-dot.active');
        if (!activeDot) return;
        const currentIndex = parseInt(activeDot.dataset.index);
        const prevIndex = Math.max(currentIndex - 1, 0);
        goToSlide(sliderWrapper, slides, prevIndex, dotsContainer);
      });
      
      nextBtn.addEventListener('click', () => {
        const activeDot = dotsContainer.querySelector('.slider-dot.active, .featured-dot.active');
        if (!activeDot) return;
        const currentIndex = parseInt(activeDot.dataset.index);
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        goToSlide(sliderWrapper, slides, nextIndex, dotsContainer);
      });
    }
    
    setupEnhancedTouchControls(container, sliderWrapper, slides, dotsContainer);
    setupKeyboardControls(container, sliderWrapper, slides, dotsContainer);
  });
}

function setupEnhancedTouchControls(container, wrapper, slides, dotsContainer) {
  let startX, moveX, startY, moveY, initialOffset;
  let isScrolling = false;
  
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    initialOffset = getTranslateX(wrapper);
    wrapper.style.transition = 'none';
  }, { passive: true });
  
  container.addEventListener('touchmove', (e) => {
    if (!startX) return;
    moveX = e.touches[0].clientX;
    moveY = e.touches[0].clientY;
    
    if (!isScrolling) {
      isScrolling = Math.abs(moveY - startY) > Math.abs(moveX - startX);
    }
    
    if (!isScrolling) {
      e.preventDefault();
      const diff = moveX - startX;
      wrapper.style.transform = `translateX(${initialOffset + diff}px)`;
    }
  }, { passive: false });
  
  container.addEventListener('touchend', () => {
    wrapper.style.transition = 'transform 0.3s ease-out';
    
    if (!startX || !moveX || isScrolling) {
      isScrolling = false;
      startX = null;
      moveX = null;
      return;
    }
    
    const diff = startX - moveX;
    const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
    const threshold = slideWidth * 0.2;
    
    const activeDot = dotsContainer.querySelector('.slider-dot.active, .featured-dot.active');
    if (!activeDot) return;
    
    const currentIndex = parseInt(activeDot.dataset.index);
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToSlide(wrapper, slides, Math.min(currentIndex + 1, slides.length - 1), dotsContainer);
      } else {
        goToSlide(wrapper, slides, Math.max(currentIndex - 1, 0), dotsContainer);
      }
    } else {
      goToSlide(wrapper, slides, currentIndex, dotsContainer);
    }
    
    startX = null;
    moveX = null;
    isScrolling = false;
  });
}

function setupKeyboardControls(container, wrapper, slides, dotsContainer) {
  container.tabIndex = 0;
  
  container.addEventListener('keydown', (e) => {
    const activeDot = dotsContainer.querySelector('.slider-dot.active, .featured-dot.active');
    if (!activeDot) return;
    const currentIndex = parseInt(activeDot.dataset.index);
    
    if (e.key === 'ArrowLeft') {
      goToSlide(wrapper, slides, Math.max(currentIndex - 1, 0), dotsContainer);
    } else if (e.key === 'ArrowRight') {
      goToSlide(wrapper, slides, Math.min(currentIndex + 1, slides.length - 1), dotsContainer);
    }
  });
}

function goToSlide(sliderWrapper, slides, index, dotsContainer) {
  if (slides.length === 0) return;
  
  const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
  sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
  
  const dots = dotsContainer.querySelectorAll('.slider-dot, .featured-dot');
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

function getTranslateX(element) {
  const style = window.getComputedStyle(element);
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix.m41;
}
