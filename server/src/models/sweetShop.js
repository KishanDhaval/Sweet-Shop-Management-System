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
}

module.exports = SweetShop;
