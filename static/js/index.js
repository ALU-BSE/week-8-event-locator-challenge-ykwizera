/**
 * Home page JavaScript functionality
 */

// Load featured events
function loadFeaturedEvents() {
    const container = document.getElementById('featured-events');
    
    if (!container) {
      console.error('Featured events container not found');
      return;
    }
    
    // Show loading indicator
    showLoading('featured-events');
    
    // Fetch events from JSON
    fetch('static/data/events.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load events');
        }
        return response.json();
      })
      .then(events => {
        // Select 3 random events to feature
        const shuffled = events.sort(() => 0.5 - Math.random());
        const featured = shuffled.slice(0, 3);
        
        // Create HTML for featured events
        let html = '';
        
        featured.forEach(event => {
          html += `
            <div class="col-md-4">
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
        
        container.innerHTML = html;
      })
      .catch(error => {
        console.error('Error:', error);
        showError('Unable to load featured events. Please try again later.', 'featured-events');
      });
  }
  
  // Load category grid for the homepage
  function loadCategoryGrid() {
    const container = document.getElementById('categories-grid');
    
    if (!container) {
      console.error('Categories grid container not found');
      return;
    }
    
    // Show loading indicator
    showLoading('categories-grid');
    
    // Fetch categories from JSON
    fetch('static/data/categories.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        return response.json();
      })
      .then(categories => {
        // Filter out the "all" category
        const filteredCategories = categories.filter(category => category.id !== 'all');
        
        // Create HTML for category grid
        let html = '';
        
        filteredCategories.forEach(category => {
          const iconClass = getCategoryIcon(category.id);
          
          html += `
            <div class="col-6 col-md-4 col-lg-3">
              <a href="events.html?category=${category.id}" class="text-decoration-none">
                <div class="card h-100 text-center">
                  <div class="card-body">
                    <div class="display-6 mb-3 text-primary">
                      <i class="${iconClass}"></i>
                    </div>
                    <h5 class="card-title">${category.name}</h5>
                    <p class="card-text">Browse ${category.name.toLowerCase()} events</p>
                  </div>
                </div>
              </a>
            </div>
          `;
        });
        
        container.innerHTML = html;
      })
      .catch(error => {
        console.error('Error:', error);
        showError('Unable to load categories. Please try again later.', 'categories-grid');
      });
  }
  
  // Get appropriate icon class for each category
  function getCategoryIcon(categoryId) {
    const iconMap = {
      music: 'fas fa-music',
      technology: 'fas fa-laptop-code',
      food: 'fas fa-utensils',
      arts: 'fas fa-palette',
      sports: 'fas fa-running',
      business: 'fas fa-briefcase',
      health: 'fas fa-heartbeat',
      education: 'fas fa-graduation-cap',
      shopping: 'fas fa-shopping-bag'
    };
    
    return iconMap[categoryId] || 'fas fa-calendar-alt';
  }
  
  // Populate the quick category dropdown
  function populateQuickCategoryDropdown() {
    const select = document.getElementById('quick-category');
    
    if (!select) {
      return;
    }
    
    fetch('static/data/categories.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        return response.json();
      })
      .then(categories => {
        // Create default "All Categories" option
        let html = `<option value="all">All Categories</option>`;
        
        // Add options for each category
        categories.forEach(category => {
          if (category.id !== 'all') {
            html += `<option value="${category.id}">${category.name}</option>`;
          }
        });
        
        select.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading categories:', error);
      });
  }
  
  // Initialize homepage
  document.addEventListener('DOMContentLoaded', function() {
    // Load featured events
    loadFeaturedEvents();
    
    // Load category grid
    loadCategoryGrid();
    
    // Populate quick category dropdown
    populateQuickCategoryDropdown();
  });