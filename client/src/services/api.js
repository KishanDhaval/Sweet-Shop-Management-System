const API_BASE_URL = 'http://localhost:3000';

export const api = {
  // Get all sweets
  getAllSweets: async () => {
    const response = await fetch(`${API_BASE_URL}/sweets`);
    if (!response.ok) throw new Error('Failed to fetch sweets');
    return response.json();
  },

  // Add a new sweet
  addSweet: async (sweetData) => {
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sweetData),
    });
    if (!response.ok) throw new Error('Failed to add sweet');
    return response.json();
  },

  // Delete sweet by ID
  deleteSweet: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete sweet');
    return response.json();
  },

  // Delete sweets by category
  deleteSweetsByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/sweets/category/${encodeURIComponent(category)}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete sweets by category');
    return response.json();
  },

  // Search by name
  searchByName: async (name) => {
    const response = await fetch(`${API_BASE_URL}/sweets/search/name?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error('Failed to search by name');
    return response.json();
  },

  // Search by category
  searchByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/sweets/search/category?category=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Failed to search by category');
    return response.json();
  },

  // Search by price range
  searchByPriceRange: async (min, max) => {
    const response = await fetch(`${API_BASE_URL}/sweets/search/price?min=${min}&max=${max}`);
    if (!response.ok) throw new Error('Failed to search by price range');
    return response.json();
  },

  // Sort sweets by price
  sortSweets: async (ascending = true) => {
    const response = await fetch(`${API_BASE_URL}/sweets/sort?asc=${ascending}`);
    if (!response.ok) throw new Error('Failed to sort sweets');
    return response.json();
  },

  // Purchase sweet
  purchaseSweet: async (id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to purchase sweet');
    return response.json();
  },

  // Restock sweet
  restockSweet: async (id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to restock sweet');
    return response.json();
  },
};