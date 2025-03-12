/**
 * Events page JavaScript functionality
 */

// Global variables
let allEvents = [];
let allCategories = [];

// Load events from JSON based on search, date, and category filters
function loadEvents(search = '', date = '', category = 'all') {
  showLoading('events-container');
  
  // Fetch categories first
  fetch('static/data/categories.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      return response.json();
    })
    .then(categories => {
      allCategories = categories;
      populateCategoryFilter(categories);
      
      // Then fetch events
      return fetch('static/data/events.json');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      return response.json();
    })
    .then(events => {
      allEvents = events;
      
      // Apply filters
      let filteredEvents = events;
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.name.toLowerCase().includes(searchLower) || 
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by date
      if (date) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.date) >= new Date(date)
        );
      }
      
      // Filter by category
      if (category && category !== 'all') {
        filteredEvents = filteredEvents.filter(event => 
          event.category === category
        );
      }
      
      // Display filtered events
      displayEvents(filteredEvents);
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Unable to load events. Please try again later.', 'events-container');
    });
}

// Display events in the container
function displayEvents(events) {
  const container = document.getElementById('events-container');
  
  if (!container) {
    console.error('Events container not found');
    return;
  }
  
  if (events.length === 0) {
    container.innerHTML = `
      <div class="no-events">
        <i class="fas fa-calendar-times fa-3x mb-3"></i>
        <h3>No events found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="row g-4">';
  
  events.forEach(event => {
    html += `
      <div class="col-md-6 col-lg-4">
        <div class="card event-card h-100">
          <div class="position-relative">
            <img src="${event.image}" class="card-img-top" alt="${event.name}">
            <div class="date-badge bg-dark text-white">
              ${formatDate(event.date)}
            </div>
          </div>
          <div class="card-body">
            <div class="mb-2">
              ${createCategoryBadge(event.category)}
            </div>
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text text-truncate">${event.description}</p>
            <div class="d-flex align-items-center mb-2">
              <i class="fas fa-map-marker-alt me-2"></i>
              <span>${event.location}</span>
            </div>
            <div class="d-flex align-items-center mb-3">
              <i class="fas fa-clock me-2"></i>
              <span>${event.time}</span>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <a href="event-details.html?id=${event.id}" class="btn btn-outline-primary w-100">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// Populate category filter dropdown
function populateCategoryFilter(categories) {
  const categorySelect = document.getElementById('category-filter');
  if (!categorySelect) return;
  
  categorySelect.innerHTML = '';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
  
  // Set selected option based on URL parameters
  const urlCategory = getUrlParameter('category');
  if (urlCategory) {
    categorySelect.value = urlCategory;
  }
}

// Apply filters when form is submitted
function applyFilters() {
  const searchInput = document.getElementById('search-input');
  const dateInput = document.getElementById('date-filter');
  const categorySelect = document.getElementById('category-filter');
  
  const search = searchInput ? searchInput.value : '';
  const date = dateInput ? dateInput.value : '';
  const category = categorySelect ? categorySelect.value : 'all';
  
  // Update URL parameters
  const url = new URL(window.location);
  if (search) url.searchParams.set('search', search);
  else url.searchParams.delete('search');
  
  if (date) url.searchParams.set('date', date);
  else url.searchParams.delete('date');
  
  if (category && category !== 'all') url.searchParams.set('category', category);
  else url.searchParams.delete('category');
  
  window.history.pushState({}, '', url);
  
  // Load events with filters
  loadEvents(search, date, category);
  
  return false; // Prevent form submission
}

// Clear all filters
function clearFilters() {
  const searchInput = document.getElementById('search-input');
  const dateInput = document.getElementById('date-filter');
  const categorySelect = document.getElementById('category-filter');
  
  if (searchInput) searchInput.value = '';
  if (dateInput) dateInput.value = '';
  if (categorySelect) categorySelect.value = 'all';
  
  // Clear URL parameters
  const url = new URL(window.location);
  url.searchParams.delete('search');
  url.searchParams.delete('date');
  url.searchParams.delete('category');
  window.history.pushState({}, '', url);
  
  // Reload all events
  loadEvents();
}

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
  // Get filter values from URL parameters
  const urlSearch = getUrlParameter('search') || '';
  const urlDate = getUrlParameter('date') || '';
  const urlCategory = getUrlParameter('category') || 'all';
  
  // Set form values from URL parameters
  const searchInput = document.getElementById('search-input');
  const dateInput = document.getElementById('date-filter');
  
  if (searchInput && urlSearch) searchInput.value = urlSearch;
  if (dateInput && urlDate) dateInput.value = urlDate;
  
  // Load events with initial filters
  loadEvents(urlSearch, urlDate, urlCategory);
  
  // Setup event listeners
  const filterForm = document.getElementById('filter-form');
  const clearButton = document.getElementById('clear-filters');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  if (clearButton) {
    clearButton.addEventListener('click', function(e) {
      e.preventDefault();
      clearFilters();
    });
  }
});