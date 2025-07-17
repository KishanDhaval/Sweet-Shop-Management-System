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
    this.sweets = [
      {
        "id": "a1c3d5b6-789f-4c5a-9d6f-2f6e8f5b2c90",
        "name": "Rasgulla",
        "category": "Milk-Based",
        "price": 150,
        "quantity": 100
      },
      {
        "id": "b7f4e2d1-36e1-4a3a-b2b9-3c12d3a678fa",
        "name": "Soan Papdi",
        "category": "Flour-Based",
        "price": 80,
        "quantity": 50
      },
      {
        "id": "c9a4be12-f1f2-4c6d-931a-eab23fe38bd0",
        "name": "Kaju Katli",
        "category": "Kaju-Based",
        "price": 250,
        "quantity": 30
      },
      {
        "id": "d812a7f6-0e48-4013-9b0e-8a4d649ab913",
        "name": "Jalebi",
        "category": "Sugar-Based",
        "price": 60,
        "quantity": 75
      },
      {
        "id": "e3b2f791-14a5-4dbb-aeef-93a2f892bd27",
        "name": "Motichoor Ladoo",
        "category": "Gram Flour-Based",
        "price": 120,
        "quantity": 90
      },
      {
        "id": "f9715c36-3422-48f0-9cc6-7080bc94284d",
        "name": "Gulab Jamun",
        "category": "Milk-Based",
        "price": 100,
        "quantity": 60
      },
      {
        "id": "11e9608a-0f3e-4691-bb59-10b8fe3f78cd",
        "name": "Barfi",
        "category": "Milk-Based",
        "price": 180,
        "quantity": 40
      },
      {
        "id": "22a812d1-e1e5-4b39-9d14-4bb6b8d79e8d",
        "name": "Halwa",
        "category": "Wheat-Based",
        "price": 90,
        "quantity": 35
      }
    ]
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
