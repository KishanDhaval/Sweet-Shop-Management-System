class Sweet {
  constructor({ id, name, category, price, quantity }) {
    if (!id || !name || !category || price == null || quantity == null) {
      throw new Error('All fields are required');
    }
    if(price < 0){
        throw new Error("Price must be a positive")
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        throw new Error("Quantity must be a positive integer");
    }
    if(!Number.isInteger(id)){
        throw new Error("id must be an Integer");
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
    if (this.sweets.some(s => s.id === data.id)) {
      throw new Error(`Sweet with ID ${data.id} already exists`);
    }
    const sweet = new Sweet(data);
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
}

module.exports = SweetShop;
