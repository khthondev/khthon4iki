// assets/ui-elements.js

document.addEventListener('DOMContentLoaded', () => {
  // Function to load the popup HTML and inject it into the body
  async function loadPopup() {
    try {
      const response = await fetch('assets/ui-elements.html');
      if (!response.ok) {
        throw new Error(`Failed to load UI elements: ${response.statusText}`);
      }
      const popupHTML = await response.text();
      document.body.insertAdjacentHTML('beforeend', popupHTML);
      initializePopup();
    } catch (error) {
      console.error(error);
    }
  }

  // Function to initialize popup behavior
  function initializePopup() {
    const popup = document.getElementById('message-popup');
    const closeButton = document.querySelector('.close-button');

    // Function to show the popup
    window.showMessagePopup = (message) => {
      const messageElement = document.getElementById('popup-message');
      if (messageElement) {
        messageElement.textContent = message;
      }
      popup.classList.add('show');
    };

    // Function to hide the popup
    function hidePopup() {
      popup.classList.remove('show');
    }

    // Event listener for close button
    closeButton.addEventListener('click', hidePopup);

    // Optional: Hide popup when clicking outside the content box
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        hidePopup();
      }
    });

    // Optional: Hide popup when pressing the 'Escape' key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('show')) {
        hidePopup();
      }
    });
  }

  // Load the popup on page load
  loadPopup();
});
