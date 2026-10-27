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
}
