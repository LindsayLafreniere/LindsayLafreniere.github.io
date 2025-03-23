// Writing page specific functionality
document.addEventListener('DOMContentLoaded', () => {
  initWritingPage();
});

function initWritingPage() {
  // Initialize description toggles with special handling
  const toggles = document.querySelectorAll('.writing-item .toggle-description');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent navigation when clicking toggle
      const description = this.previousElementSibling;
      description.classList.toggle('description-truncated');
      description.classList.toggle('description-expanded');
      
      this.textContent = description.classList.contains('description-truncated') ? 'Read more' : 'Read less';
    });
  });
  
  // Make writing items clickable (navigation)
  document.querySelectorAll('.writing-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.classList.contains('toggle-description')) {
        return; // Don't navigate if clicking on the toggle
      }
      
      const title = this.querySelector('h3').textContent;
      // Create a safer slug from title
      let slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
        
      // Map specific titles to known filenames
      const fileMap = {
        'sunbathing and surgical wounds': 'post-sunbathing-surgical-wounds',
        'probiotics for eczema do they really work': 'post-probiotics-eczema',
        'talk it forward': 'post-talk-it-forward',
        'which plants need humidity': 'post-which-plants-need-humidity',
        'could your smartphone know youre high': 'post-could-your-smartphone-know-youre-high',
        '15 best movie podcasts for cinematic and tv series fans': 'post-15-best-movie-podcasts-for-cinematic-and-tv-series-fans'
      };
      
      // Use mapped filename if available, otherwise use generated slug
      const fileSlug = fileMap[slug] || `post-${slug}`;
      window.location.href = `${fileSlug}.html`;
    });
    
    // Add cursor pointer style
    item.style.cursor = 'pointer';
  });
}