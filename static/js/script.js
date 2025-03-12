/**
 * Common JavaScript functions used across the website
 */

// Format a date to a readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  
  // Format a date in YYYY-MM-DD format (for date inputs)
  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  // Get today's date in YYYY-MM-DD format
  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }
  
  // Set min date on date inputs to today
  function setMinDateToToday() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = getTodayDate();
    
    dateInputs.forEach(input => {
      input.min = today;
    });
  }
  
  // Get URL parameter by name
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  // Create a category badge with appropriate styling
  function createCategoryBadge(category) {
    const badgeClasses = {
      music: 'bg-primary',
      technology: 'bg-info',
      food: 'bg-success',
      arts: 'bg-warning',
      sports: 'bg-danger',
      business: 'bg-secondary',
      health: 'bg-info',
      education: 'bg-dark',
      shopping: 'bg-primary'
    };
    
    const className = badgeClasses[category] || 'bg-secondary';
    return `<span class="badge ${className}">${category.charAt(0).toUpperCase() + category.slice(1)}</span>`;
  }
  
  // Display error message
  function showError(message, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i> ${message}
        </div>
      `;
    } else {
      console.error('Error container not found:', containerId);
    }
  }
  
  // Display loading spinner
  function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="loader">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;
    }
  }
  
  // Initialize tooltips and popovers
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    });
    
    // Set min date on date inputs to today
    setMinDateToToday();
  });