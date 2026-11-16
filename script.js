
/* ==================================
   DRIVE EASE - VEHICLE RENTAL
================================== */

// IMPORTANT: Replace this with your WhatsApp number.
// Include country code 91. Do not use + or spaces.
const ADMIN_WHATSAPP = "9885681516";

// Vehicle details and affordable rental prices
const vehicles = [
  {
    id: 1,
    name: "Maruti Swift",
    type: "Car",
    price: 1500,
    seats: "5 Seats",
    fuel: "Petrol",
    transmission: "Manual",
    image: "images.jpg"
  },
  {
    id: 2,
    name: "Hyundai i20",
    type: "Car",
    price: 2000,
    seats: "5 Seats",
    fuel: "Petrol",
    transmission: "Manual",
    image: "i20.webp"
  },
  {
    id: 3,
    name: "Mahindra Thar",
    type: "Car",
    price: 3500,
    seats: "4 Seats",
    fuel: "Diesel",
    transmission: "Manual",
    image: "thar.jpg"
  },
  {
    id: 4,
    name: "Royal Enfield Classic 350",
    type: "Bike",
    price: 1000,
    seats: "2 Seats",
    fuel: "Petrol",
    transmission: "Manual",
    image: "bullet.jpg"
  },
  {
    id: 5,
    name: "Yamaha R15",
    type: "Bike",
    price: 1200,
    seats: "2 Seats",
    fuel: "Petrol",
    transmission: "Manual",
    image: "r15.webp"
  },
  {
    id: 6,
    name: "Honda Activa 6G",
    type: "Scooter",
    price: 500,
    seats: "2 Seats",
    fuel: "Petrol",
    transmission: "Automatic",
    image: "activa.jpg"
  }
];

const vehicleGrid = document.getElementById("vehicleGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const modal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");

let selectedVehicle = null;

// Display vehicles
function displayVehicles() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(search);
    const matchesCategory =
      category === "All" || vehicle.type === category;

    return matchesSearch && matchesCategory;
  });

  vehicleGrid.innerHTML = "";

  if (filtered.length === 0) {
    vehicleGrid.innerHTML =
      '<p class="no-results">No vehicles found. Try another search.</p>';
    return;
  }

  filtered.forEach(vehicle => {
    const card = document.createElement("article");
    card.className = "vehicle-card";

    card.innerHTML = `
      <img src="${vehicle.image}" alt="${vehicle.name}"
        onerror="this.src='https://placehold.co/800x450?text=Vehicle'">

      <div class="vehicle-info">
        <span class="vehicle-type">${vehicle.type}</span>
        <h3>${vehicle.name}</h3>

        <div class="vehicle-specs">
          <span>${vehicle.seats}</span>
          <span>${vehicle.fuel}</span>
          <span>${vehicle.transmission}</span>
        </div>

        <div class="vehicle-bottom">
          <div class="vehicle-price">
            <strong>₹${vehicle.price.toLocaleString("en-IN")}</strong>
            <small>/ day</small>
          </div>

          <button class="book-btn" data-id="${vehicle.id}">
            Book Now →
          </button>
        </div>
      </div>
    `;

    vehicleGrid.appendChild(card);
  });
}

// Open booking popup
vehicleGrid.addEventListener("click", function(event) {
  const button = event.target.closest(".book-btn");

  if (!button) return;

  const vehicleId = Number(button.dataset.id);

  selectedVehicle = vehicles.find(v => v.id === vehicleId);

  document.getElementById("vehicleName").value =
    selectedVehicle.name;

  document.getElementById("selectedVehicle").textContent =
    selectedVehicle.name + " | ₹" +
    selectedVehicle.price.toLocaleString("en-IN") + " per day";

  bookingForm.reset();
  document.getElementById("vehicleName").value =
    selectedVehicle.name;

  setDateLimits();
  calculatePrice();

  modal.classList.add("show");
});

// Close popup
document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

// Set minimum pickup date to today
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setDateLimits() {
  const pickup = document.getElementById("pickupDate");
  const returning = document.getElementById("returnDate");

  pickup.min = getToday();
  returning.min = pickup.value || getToday();
}

// Calculate rental price
function calculatePrice() {
  if (!selectedVehicle) return;

  const pickup = document.getElementById("pickupDate").value;
  const returning = document.getElementById("returnDate").value;

  let total = 0;

  if (pickup && returning) {
    const start = new Date(pickup + "T00:00:00");
    const end = new Date(returning + "T00:00:00");

    const difference = Math.round(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (difference > 0) {
      total = difference * selectedVehicle.price;
    }
  }

  document.getElementById("totalPrice").textContent =
    "₹" + total.toLocaleString("en-IN");
}

document.getElementById("pickupDate").addEventListener("change", () => {
  const pickup = document.getElementById("pickupDate").value;
  const returning = document.getElementById("returnDate");

  returning.min = pickup || getToday();

  if (returning.value && returning.value <= pickup) {
    returning.value = "";
  }

  calculatePrice();
});

document.getElementById("returnDate").addEventListener("change", calculatePrice);

// Confirm booking
bookingForm.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!selectedVehicle) return;

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const location = document.getElementById("pickupLocation").value.trim();

  const pickup = document.getElementById("pickupDate").value;
  const returning = document.getElementById("returnDate").value;

  if (!name || !email || !phone || !location || !pickup || !returning) {
    alert("Please complete all booking details.");
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    alert("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  const start = new Date(pickup + "T00:00:00");
  const end = new Date(returning + "T00:00:00");

  const days = Math.round((end - start) / (1000 * 60 * 60 * 24));

  if (pickup < getToday() || days <= 0) {
    alert("Please select valid pickup and return dates.");
    return;
  }

  const total = days * selectedVehicle.price;

  const booking = {
    bookingId: "DE" + Date.now(),
    customer: name,
    email: email,
    phone: phone,
    location: location,
    vehicle: selectedVehicle.name,
    category: selectedVehicle.type,
    pickupDate: pickup,
    returnDate: returning,
    days: days,
    total: total,
    status: "Booking request sent",
    createdAt: new Date().toLocaleString()
  };

  // Save booking in browser storage
  const bookings = JSON.parse(
    localStorage.getItem("driveEaseBookings") || "[]"
  );

  bookings.push(booking);

  localStorage.setItem(
    "driveEaseBookings",
    JSON.stringify(bookings)
  );

  // Prepare WhatsApp notification
  const message = `
NEW VEHICLE BOOKING - DRIVE EASE

Booking ID: ${booking.bookingId}

Customer: ${booking.customer}
Email: ${booking.email}
Phone: ${booking.phone}

Vehicle: ${booking.vehicle}
Category: ${booking.category}

Pickup Location: ${booking.location}
Pickup Date: ${booking.pickupDate}
Return Date: ${booking.returnDate}

Rental Days: ${booking.days}
Price Per Day: Rs. ${selectedVehicle.price}
Estimated Total: Rs. ${booking.total}

Status: Booking request sent.

Please contact the customer to confirm availability and payment.
  `;

  const whatsappURL =
    "https://wa.me/" + ADMIN_WHATSAPP +
    "?text=" + encodeURIComponent(message);

  alert(
    "Your booking request has been saved! " +
    "WhatsApp will now open. Press SEND to notify the admin."
  );

  bookingForm.reset();
  modal.classList.remove("show");

  // Open WhatsApp with booking details
  window.open(whatsappURL, "_blank");
});

// Search and category filters
searchInput.addEventListener("input", displayVehicles);
categoryFilter.addEventListener("change", displayVehicles);

// Contact WhatsApp
document.getElementById("contactWhatsApp").href =
  "https://wa.me/" + ADMIN_WHATSAPP +
  "?text=" + encodeURIComponent(
    "Hello DriveEase! I want to know more about vehicle rentals."
  );

// Initial display
displayVehicles();


