const checkoutContainer = document.getElementById("checkout-container");

// Prevent direct access if no booking exists
const bookings = JSON.parse(localStorage.getItem("checkoutTickets"));
if (!bookings || bookings.length === 0) {
  alert("Please book your tickets first.");
  window.location.href = "booking.html";
}

const times = ["12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];
const finalSelections = [];

// Create checkout blocks for each movie
bookings.forEach((booking, index) => {
  const block = document.createElement("div");
  block.className = "movie-block";
  block.innerHTML = `
    <h3>${booking.movie}</h3>
    <label>Choose Time:
      <select id="time-${index}">
        ${times.map(time => `<option value="${time}">${time}</option>`).join("")}
      </select>
    </label>
    <div class="seat-grid" data-index="${index}"></div>
  `;
  checkoutContainer.appendChild(block);

  const grid = block.querySelector(".seat-grid");

  // Randomly block 5 seats
  const blocked = new Set();
  while (blocked.size < 5) {
    const row = String.fromCharCode(65 + Math.floor(Math.random() * 8)); // A–H
    const col = Math.floor(Math.random() * 10) + 1; // 1–10
    blocked.add(`${row}${col}`);
  }

  for (let row = 65; row <= 72; row++) {
    for (let col = 1; col <= 10; col++) {
      const seatId = String.fromCharCode(row) + col;
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.innerText = seatId;
      seat.dataset.id = seatId;

      if (blocked.has(seatId)) {
        seat.classList.add("booked");
        seat.style.background = "#dc3545";
        seat.style.cursor = "not-allowed";
        seat.style.pointerEvents = "none";
      } else {
        seat.addEventListener("click", () => {
          const selected = grid.querySelectorAll(".seat.selected");
          if (!seat.classList.contains("selected") && selected.length >= booking.qty) return;
          seat.classList.toggle("selected");
        });
      }

      grid.appendChild(seat);
    }
  }
});

// Handle payment
document.getElementById("pay-btn").addEventListener("click", () => {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const cardName = document.getElementById("cardName").value.trim();
  const expiryDate = document.getElementById("expiryDate").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!name || !email || !phone || !cardNumber || !cardName || !expiryDate || !cvv) {
    alert("Please fill out all required fields.");
    return;
  }

  finalSelections.length = 0;
  let valid = true;

  bookings.forEach((b, i) => {
    const time = document.getElementById(`time-${i}`).value;
    const seats = Array.from(document.querySelectorAll(`[data-index="${i}"] .seat.selected`)).map(s => s.dataset.id);
    if (seats.length !== b.qty) {
      alert(`Please select ${b.qty} seat(s) for "${b.movie}"`);
      valid = false;
      return;
    }
    finalSelections.push({ movie: b.movie, time, seats, total: b.total });
  });

  if (!valid) return;

  const confirmation = document.getElementById("confirmation");
  confirmation.innerHTML = `
    <h2>Thank You, ${name}!</h2>
    <p>Confirmation sent to: <strong>${email}</strong></p>
    ${finalSelections.map(f => `
      <p>
        <strong>${f.movie}</strong><br>
        Time: ${f.time}<br>
        Seats: ${f.seats.join(", ")}<br>
        Total: $${f.total}<br>
        Booking Ref: #${Math.floor(Math.random() * 1000000)}
      </p>
    `).join("<hr>")}
  `;
  confirmation.style.display = "block";
  localStorage.removeItem("checkoutTickets");
});
