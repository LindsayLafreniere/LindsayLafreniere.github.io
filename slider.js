// New slider functionality for better swipability
document.addEventListener('DOMContentLoaded', () => {
  initEnhancedSliders();
});

function initEnhancedSliders() {
  const sliderContainers = document.querySelectorAll('.slider-container');
  
  sliderContainers.forEach((container) => {
    const sliderWrapper = container.querySelector('.slider-wrapper');
    const slides = sliderWrapper.querySelectorAll('.writing-item, .featured-item');
    const dotsContainer = container.nextElementSibling;
    
    if (!slides.length || !dotsContainer) return;
    
    setupEnhancedTouchControls(container, sliderWrapper, slides, dotsContainer);
    setupKeyboardControls(container, sliderWrapper, slides, dotsContainer);
  });
}

function setupEnhancedTouchControls(container, wrapper, slides, dotsContainer) {
  let startX, moveX, startY, moveY, initialOffset;
  let isScrolling = false;
  
  // Enhanced touch handling with better detection
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
    
    // Determine if the user is trying to scroll vertically
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
    const threshold = slideWidth * 0.2; // 20% of slide width
    
    const activeDot = dotsContainer.querySelector('.slider-dot.active, .featured-dot.active');
    if (!activeDot) return;
    
    const currentIndex = parseInt(activeDot.dataset.index);
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) { // swipe left
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        goToSlide(wrapper, slides, nextIndex, dotsContainer);
      } else { // swipe right
        const prevIndex = Math.max(currentIndex - 1, 0);
        goToSlide(wrapper, slides, prevIndex, dotsContainer);
      }
    } else {
      // Return to current slide if swipe wasn't far enough
      goToSlide(wrapper, slides, currentIndex, dotsContainer);
    }
    
    startX = null;
    moveX = null;
    isScrolling = false;
  });
}

function setupKeyboardControls(container, wrapper, slides, dotsContainer) {
  // Add keyboard navigation when the slider is in focus
  container.tabIndex = 0;
  
  container.addEventListener('keydown', (e) => {
    const activeDot = dotsContainer.querySelector('.slider-dot.active, .featured-dot.active');
    if (!activeDot) return;
    
    const currentIndex = parseInt(activeDot.dataset.index);
    
    if (e.key === 'ArrowLeft') {
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex) {
        goToSlide(wrapper, slides, prevIndex, dotsContainer);
      }
    } else if (e.key === 'ArrowRight') {
      const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
      if (nextIndex !== currentIndex) {
        goToSlide(wrapper, slides, nextIndex, dotsContainer);
      }
    }
  });
}

function goToSlide(sliderWrapper, slides, index, dotsContainer) {
  if (slides.length === 0) return;
  
  const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
  sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
  
  // Update active dot
  const dots = dotsContainer.querySelectorAll('.slider-dot, .featured-dot');
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  dots[index].classList.add('active');
}

// Get current translateX value
function getTranslateX(element) {
  const style = window.getComputedStyle(element);
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix.m41;
}