// Additional script for podcast page slider functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize podcast page slider
  const podcastPageSlider = document.getElementById('podcast-page-slider');
  if (podcastPageSlider) {
    setupPodcastPageSlider(podcastPageSlider, 'podcast-page-dots');
  }
});

function setupPodcastPageSlider(sliderContainer, dotsId) {
  if (!sliderContainer) return;
  
  const sliderWrapper = sliderContainer.querySelector('.featured-wrapper');
  const slides = sliderWrapper.querySelectorAll('.featured-item');
  const dotsContainer = document.getElementById(dotsId);
  
  if (slides.length === 0) return;
  
  // Create dots based on the number of slides
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('featured-dot');
    if (i === 0) dot.classList.add('active');
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      goToSlide(sliderWrapper, slides, i, dotsContainer);
    });
    dotsContainer.appendChild(dot);
  }
  
  // Add touch events for mobile swipe
  let startX, moveX, initialOffset;
  
  sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    initialOffset = getTranslateX(sliderWrapper);
    sliderWrapper.style.transition = 'none';
  }, { passive: true });
  
  sliderContainer.addEventListener('touchmove', (e) => {
    if (!startX) return;
    moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    sliderWrapper.style.transform = `translateX(${initialOffset + diff}px)`;
  }, { passive: true });
  
  sliderContainer.addEventListener('touchend', () => {
    sliderWrapper.style.transition = 'transform 0.3s ease-out';
    
    if (!startX || !moveX) return;
    
    const diff = startX - moveX;
    const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
    const threshold = slideWidth * 0.3; // 30% of slide width
    
    const activeDot = dotsContainer.querySelector('.featured-dot.active');
    if (!activeDot) return;
    
    const currentIndex = parseInt(activeDot.dataset.index);
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) { // swipe left
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        goToSlide(sliderWrapper, slides, nextIndex, dotsContainer);
      } else { // swipe right
        const prevIndex = Math.max(currentIndex - 1, 0);
        goToSlide(sliderWrapper, slides, prevIndex, dotsContainer);
      }
    } else {
      // Return to current slide if swipe wasn't far enough
      goToSlide(sliderWrapper, slides, currentIndex, dotsContainer);
    }
    
    startX = null;
    moveX = null;
  });
  
  // Add click handling for nav buttons
  const prevButton = sliderContainer.querySelector('.slider-button.prev');
  const nextButton = sliderContainer.querySelector('.slider-button.next');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const activeDot = dotsContainer.querySelector('.featured-dot.active');
      if (!activeDot) return;
      
      const currentIndex = parseInt(activeDot.dataset.index);
      const prevIndex = Math.max(currentIndex - 1, 0);
      
      if (prevIndex !== currentIndex) {
        goToSlide(sliderWrapper, slides, prevIndex, dotsContainer);
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const activeDot = dotsContainer.querySelector('.featured-dot.active');
      if (!activeDot) return;
      
      const currentIndex = parseInt(activeDot.dataset.index);
      const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
      
      if (nextIndex !== currentIndex) {
        goToSlide(sliderWrapper, slides, nextIndex, dotsContainer);
      }
    });
  }
  
  // Make items clickable
  slides.forEach(item => {
    item.addEventListener('click', function(e) {
      // Don't navigate if clicking on the toggle description
      if (e.target.classList.contains('toggle-description')) return;
      
      const link = this.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });
  
  // Initialize description toggles
  initDescriptionToggles(sliderContainer);
}

function initDescriptionToggles(container) {
  const toggles = container.querySelectorAll('.toggle-description');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const description = this.previousElementSibling;
      description.classList.toggle('description-truncated');
      description.classList.toggle('description-expanded');
      
      this.textContent = description.classList.contains('description-truncated') ? 'Read more' : 'Read less';
    });
  });
}

function goToSlide(sliderWrapper, slides, index, dotsContainer) {
  if (slides.length === 0) return;
  
  const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slides[0]).marginRight);
  sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
  
  // Update active dot
  const dots = dotsContainer.querySelectorAll('.featured-dot');
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