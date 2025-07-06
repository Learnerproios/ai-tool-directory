// Initialize Supabase
const { createClient } = supabase;
const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL"; // Replace with your Supabase Project URL
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // Replace with your Supabase Anon Key

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
  toolList.innerHTML = "";

  tools.forEach((tool) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
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
