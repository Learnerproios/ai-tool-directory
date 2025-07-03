const tools = [
  { id: 1, name: "ChatGPT", description: "Powerful language model.", category: "Writing", url: "https://chat.openai.com " },
  { id: 2, name: "MidJourney", description: "Generates stunning images from text.", category: "Design", url: "https://www.midjourney.com " },
  { id: 3, name: "GitHub Copilot", description: "AI pair programmer.", category: "Coding", url: "https://github.com/features/copilot " },
  { id: 4, name: "Canva AI", description: "Create visuals easily.", category: "Design", url: "https://canva.com " },
  { id: 5, name: "Grammarly", description: "Write clearly and avoid mistakes.", category: "Writing", url: "https://grammarly.com " }
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function renderTools() {
  const list = document.getElementById("tool-list");
  const query = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;

  const filtered = tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(query) &&
      (!category || tool.category === category)
    );
  });

  list.innerHTML = "";
  filtered.forEach(tool => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <a href="${tool.url}" target="_blank">Visit</a>
      <br/>
      <button class="${favorites.includes(tool.id) ? 'unfav' : 'fav'}" onclick='toggleFavorite(${tool.id})'>
        ${favorites.includes(tool.id) ? 'Remove Favorite' : 'Add to Favorites'}
      </button>
    `;
    list.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderTools();
  renderFavorites();
}

function renderFavorites() {
  const favList = document.getElementById("favorites");
  favList.innerHTML = "";

  const favTools = tools.filter(t => favorites.includes(t.id));
  if (favTools.length === 0) {
    favList.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favTools.forEach(tool => {
    const p = document.createElement("div");
    p.innerHTML = `<strong>${tool.name}</strong>`;
    favList.appendChild(p);
  });
}

document.getElementById("search").addEventListener("input", renderTools);
document.getElementById("category").addEventListener("change", renderTools);

// Initial render
renderTools();
renderFavorites();