const { v4: uuidv4 } = require('uuid');

class Sweet {
  constructor({ id, name, category, price, quantity }) {
    if (!name || !category || price == null || quantity == null) {
      throw new Error('All fields are required');
    }
    if(price < 0){
        throw new Error("Price must be a positive")
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        throw new Error("Quantity must be a positive integer");
    }
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.quantity = quantity;
  }
}

class SweetShop {
  constructor() {
    this.sweets = [];
  }

  addSweet(data) {
    const sweetData = { ...data, id: uuidv4() };
    const sweet = new Sweet(sweetData);
    this.sweets.push(sweet);
    return sweet;
  }

  viewSweets() {
    return [...this.sweets];
  }

  deleteSweet(id) {
    const idx = this.sweets.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Sweet with ID ${id} not found`);
    return this.sweets.splice(idx, 1)[0];
  }
  
  deleteSweetsByCategory(category) {
    const matchedSweets = this.sweets.filter(s => s.category === category);
    if (matchedSweets.length === 0) {
      throw new Error(`No sweets found in category ${category}`);
    }

    this.sweets = this.sweets.filter(s => s.category !== category);
    return matchedSweets; 
  }

  searchByName(name) {
    return this.sweets.filter(s =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  searchByCategory(cat) {
    return this.sweets.filter(s =>
      s.category.toLowerCase() === cat.toLowerCase()
    );
  }

  searchByPriceRange(min, max) {
    return this.sweets.filter(s => s.price >= min && s.price <= max);
  }
  
  sortByPrice(asc = true) {
    return [...this.sweets].sort((a, b) =>
      asc ? a.price - b.price : b.price - a.price
    );
  }

  purchaseSweet(id, qty) {
    const sweet = this.sweets.find(s => s.id === id);
    if (!sweet) throw new Error(`Sweet with ID ${id} not found`);
    if (qty > sweet.quantity) throw new Error(`Insufficient stock for ID ${id}`);
    sweet.quantity -= qty;
    return sweet;
  }

  restockSweet(id, qty) {
    const sweet = this.sweets.find(s => s.id === id);
    if (!sweet) throw new Error(`Sweet with ID ${id} not found`);
    sweet.quantity += qty;
    return sweet;
  }
}

module.exports = SweetShop;
