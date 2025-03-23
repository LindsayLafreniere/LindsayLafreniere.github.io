// Description toggle functionality for writing and podcast items
document.addEventListener('DOMContentLoaded', () => {
  initDescriptionToggles();
});

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