const movieData = {
  nowShowing: [
    { title: "HIT 3 ", image: "images/hit3.jpg" },
    { title: "BALLERINA", image: "images/ballerina.jpg" },
    { title: "RETRO", image: "images/retro.jpg" },
    { title: "DROP", image: "images/drop.jpg" },
    { title: "DEATH OF A UNICORN", image: "images/deathofaunicorn.jpg" },
    { title: "L2: EMPURAAN", image: "images/empuraan.jpg" }
  ],
  upcoming: [
    { title: "THE BATMAN PART 2", image: "images/thebatmanpart2.png" },
    { title: "MEGAN 2.0", image: "images/megan2.0.jpg" },
    { title: "TRON ARES", image: "images/tronares.jpg" },
    { title: "DUNE 3", image: "images/dune3.jpg" },
    { title: "SUPERMAN", image: "images/superman.jpg" },
    { title: "SPIDERMAN : BEYOND THE SPIDER-VERSE", image: "images/spidermanbeyondthespiderverse.jpg" }
  ],
  premium: [
    { title: "A WORKING MAN", image: "images/aworkingman.jpg" },
    { title: "FINAL DESTINATION: BLOODLINES", image: "images/bloodlines.jpg" },
    { title: "VEERA DHEERA SOORAN: PART 2", image: "images/veeradheerasooran.jpg" },
    { title: "SMURFS", image: "images/smurfs.jpg" }
  ],
  imax: [
    { title: "MISSION IMPOSSIBLE : THE FINAL RECKONING", image: "images/missionimpossible8.jpg" },
    { title: "SINNERS", image: "images/sinners.jpg" },
    { title: "CAPTAIN AMERICA BRAVE NEW WORLD", image: "images/captainamericabravenewworld.jpeg" },
    { title: "A MINECRAFT MOVIE", image: "images/minecraft.jpeg" }
  ],
  discounts: [
    { title: "HEART EYES", image: "images/hearteyes.jpg" },
    { title: "DEVA", image: "images/deva.jpg" },
    { title: "IDENTITY", image: "images/identity.jpg" }
  ]
};

const prices = {
  nowShowing: 600,
  upcoming: {
    "THE BATMAN PART 2": 800,
    "MEGAN 2.0": 600,
    "TRON ARES": 700,
    "DUNE 3": 700,
    "SUPERMAN": 800,
    "SPIDERMAN : BEYOND THE SPIDER-VERSE": 750
  },
  premium: 800,
  imax: 1000,
  discounts: 300
};

const ticketTableBody = document.getElementById("ticket-table-body");
const grandTotalEl = document.getElementById("grand-total");
let selectedTickets = [];

function createMovieCards(sectionId, category) {
  const container = document.getElementById(sectionId);
  movieData[category].forEach(movie => {
    const price = category === "upcoming" ? prices.upcoming[movie.title] : prices[category];
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <h4>${movie.title}</h4>
      <img src="${movie.image}" alt="${movie.title} poster" class="movie-poster" />
      <p>Price: Rs.${price}</p>
      <label>Tickets:
        <input type="number" min="0" value="0" data-category="${category}" data-movie="${movie.title}">
      </label>
    `;
    container.appendChild(card);
  });
}

function updateSummary() {
  selectedTickets = [];
  const inputs = document.querySelectorAll("input[type='number']");
  ticketTableBody.innerHTML = "";
  let grandTotal = 0;

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      const movie = input.dataset.movie;
      const category = input.dataset.category;
      const price = category === "upcoming" ? prices.upcoming[movie] : prices[category];
      const total = qty * price;
      grandTotal += total;

      selectedTickets.push({ movie, qty, price, total });

      ticketTableBody.innerHTML += `
        <tr>
          <td>${movie}</td>
          <td>${qty}</td>
          <td>Rs.${price}</td>
          <td>Rs.${total.toFixed(2)}</td>
        </tr>
      `;
    }
  });

  grandTotalEl.innerText = `Rs.${grandTotal.toFixed(2)}`;
}

function saveFavourite() {
  updateSummary();
  localStorage.setItem("favouriteBooking", JSON.stringify(selectedTickets));
  alert("Favourite booking saved!");
}

function applyFavourite() {
  const fav = JSON.parse(localStorage.getItem("favouriteBooking"));
  if (!fav) {
    alert("No favourite booking found.");
    return;
  }

  const inputs = document.querySelectorAll("input[type='number']");
  inputs.forEach(input => {
    const movie = input.dataset.movie;
    const match = fav.find(f => f.movie === movie);
    input.value = match ? match.qty : 0;
  });

  updateSummary();
}

function goToCheckout() {
  updateSummary();
  if (selectedTickets.length === 0) {
    alert("Please select at least one ticket.");
    return;
  }

  localStorage.setItem("checkoutTickets", JSON.stringify(selectedTickets));
  window.location.href = "checkout.html";
}

createMovieCards("now-showing", "nowShowing");
createMovieCards("upcoming", "upcoming");
createMovieCards("premium", "premium");
createMovieCards("imax", "imax");
createMovieCards("discounts", "discounts");

document.body.addEventListener("input", updateSummary);
