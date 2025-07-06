// Initialize Supabase
const { createClient } = supabase;
const supabaseUrl = "https://hcyufsgwgrcvldizvfhb.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjeXVmc2d3Z3JjdmxkaXp2ZmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NjkxMTAsImV4cCI6MjA2NzM0NTExMH0.dx1MsHdpCREiWJRtd3jOAJAAmUyPLRcZka96JU2A3W4"; // Replace with your Anon Key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock user ID (replace with real auth later)
const userId = "user123";

// Tools list
let tools = [];

// Load on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchTools();
});

// Fetch tools from Supabase
async function fetchTools() {
  const { data, error } = await supabase.from("tools").select("*");
  if (error) {
    console.error("Error fetching tools:", error);
    return;
  }

  tools = data;
  renderTools();
  renderFavorites();
}

// Render tools
function renderTools() {
  const toolList = document.getElementById("tool-list");
  const selectedCategory = document.getElementById("category").value;
  const sortBy = document.getElementById("sort").value;

  let displayTools = [...tools];

  // Filter by category
  if (selectedCategory) {
    displayTools = displayTools.filter(tool => tool.category === selectedCategory);
  }

  // Sort by most recent update
  if (sortBy === "updated") {
    displayTools.sort((a, b) => new Date(b.update) - new Date(a.update));
  }

  toolList.innerHTML = "";
  displayTools.forEach((tool) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <small>Last updated: ${new Date(tool.update).toLocaleDateString()}</small><br/>
      <a href="${tool.url}" target="_blank">Visit</a><br/>
      <button onclick='toggleFavorite(${tool.id})'>Add to Favorites</button>
    `;
    toolList.appendChild(card);
  });
}

// Toggle favorite
async function toggleFavorite(toolId) {
  // Check if already favorited
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("tool_id", toolId)
    .eq("user_id", userId);

  if (error) return console.error("Error checking favorite:", error);

  if (data.length === 0) {
    // Add to favorites
    const { error: insertError } = await supabase
      .from("favorites")
      .insert([{ tool_id: toolId, user_id: userId }]);
    if (insertError) return console.error("Error adding favorite:", insertError);
  } else {
    // Remove from favorites
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("tool_id", toolId)
      .eq("user_id", userId);
    if (deleteError) return console.error("Error removing favorite:", deleteError);
  }

  renderFavorites();
}

// Render favorites
async function renderFavorites() {
  const favoritesDiv = document.getElementById("favorites");
  const { data, error } = await supabase
    .from("favorites")
    .select("tool_id")
    .eq("user_id", userId);

  if (error || !data) {
    favoritesDiv.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favoritesDiv.innerHTML = "<h3>Saved Favorites</h3>";

  data.forEach(({ tool_id }) => {
    const tool = tools.find(t => t.id === tool_id);
    if (!tool) return;

    const p = document.createElement("p");
    p.textContent = tool.name;
    favoritesDiv.appendChild(p);
  });
}
