/**
 * Event Details page JavaScript functionality
 */

// Global variables
let currentEvent = null;
let allEvents = [];

// Load event details based on the event ID from URL
function loadEventDetails(eventId) {
  showLoading('event-details-container');

  // Fetch event data from JSON
  fetch('static/data/events.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      return response.json();
    })
    .then(events => {
      allEvents = events;
      
      // Find the event with the matching ID
      const event = events.find(e => e.id.toString() === eventId.toString());
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      currentEvent = event;
      
      // Display the event details
      displayEventDetails(event);
      
      // Load similar events (same category but different ID)
      loadSimilarEvents(event);
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Unable to load event details. Please try again later.', 'event-details-container');
    });
}

// Display event details in the container
function displayEventDetails(event) {
  const container = document.getElementById('event-details-container');
  
  if (!container) {
    console.error('Event details container not found');
    return;
  }
  
  const html = `
    <div class="event-header">
      <img src="${event.image}" alt="${event.name}" class="event-header-img">
      <div class="event-overlay">
        <div class="container">
          <div class="mb-3">
            ${createCategoryBadge(event.category)}
          </div>
          <h1 class="display-4">${event.name}</h1>
          <div class="d-flex flex-wrap align-items-center mt-3">
            <div class="me-4 mb-2">
              <i class="fas fa-calendar-alt me-2"></i> ${formatDate(event.date)}
            </div>
            <div class="me-4 mb-2">
              <i class="fas fa-clock me-2"></i> ${event.time}
            </div>
            <div class="mb-2">
              <i class="fas fa-map-marker-alt me-2"></i> ${event.location}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mt-4">
      <div class="row">
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="m-0">About This Event</h3>
            </div>
            <div class="card-body">
              <p class="card-text">${event.description}</p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="m-0">Location</h3>
            </div>
            <div class="card-body">
              <p><i class="fas fa-map-marker-alt me-2"></i> ${event.location}</p>
              <div class="map-container">
                <div class="text-center">
                  <i class="fas fa-map-marked-alt fa-4x mb-3"></i>
                  <p>Map location for ${event.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="m-0">Event Details</h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="fas fa-tag me-2"></i> Price:</span>
                  <span class="fw-bold">${event.price}</span>
                </li>
                ${event.tickets_available ? `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="fas fa-ticket-alt me-2"></i> Tickets Available:</span>
                  <span class="fw-bold">${event.tickets_available}</span>
                </li>
                ` : ''}
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="fas fa-user-tie me-2"></i> Organizer:</span>
                  <span class="fw-bold">${event.organizer}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="m-0">Contact Information</h3>
            </div>
            <div class="card-body">
              <p><i class="fas fa-envelope me-2"></i> <a href="mailto:${event.contact_email}">${event.contact_email}</a></p>
              <p><i class="fas fa-globe me-2"></i> <a href="${event.website}" target="_blank">Visit Website</a></p>
              
              <div class="d-grid gap-2 mt-4">
                <a href="${event.website}" class="btn btn-primary" target="_blank">
                  <i class="fas fa-ticket-alt me-2"></i> Get Tickets
                </a>
                <button class="btn btn-outline-secondary" onclick="window.history.back()">
                  <i class="fas fa-arrow-left me-2"></i> Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Update page title
  document.title = `${event.name} - Event Locator`;
}

// Load similar events (same category)
function loadSimilarEvents(currentEvent) {
  const container = document.getElementById('similar-events');
  const containerWrapper = document.getElementById('similar-events-container');
  
  if (!container || !containerWrapper) {
    return;
  }
  
  // Filter events with the same category but different ID
  const similarEvents = allEvents.filter(event => 
    event.category === currentEvent.category && 
    event.id !== currentEvent.id
  ).slice(0, 3); // Limit to 3 similar events
  
  if (similarEvents.length === 0) {
    containerWrapper.style.display = 'none';
    return;
  }
  
  let html = '';
  
  similarEvents.forEach(event => {
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
  containerWrapper.style.display = 'block';
}

// Initialize event details page
document.addEventListener('DOMContentLoaded', function() {
  const eventId = getUrlParameter('id');
  
  if (eventId) {
    loadEventDetails(eventId);
  } else {
    showError('No event ID provided. Please select an event from the events page.', 'event-details-container');
  }
});