const SweetShop = require("../../src/models/sweetShop");

// Test cases for add function
describe("Model: SweetShop, Sweet add", () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();
  });

  it("addSweet: throws if any missing", () => {
    expect(() => shop.addSweet({ id: 1, category: "chocolate" })).toThrow(
      "All fields are required"
    );
  });

  it("addSweet: adds & returns sweet", () => {
    const data = {
      name: "Perk",
      category: "chocolate",
      price: 10,
      quantity: 5,
    };
    const s = shop.addSweet(data);
    expect(s).toMatchObject(data);
    expect(shop.viewSweets()).toContainEqual(s);
  });

  it("addSweet: allows zero price and zero quantity if business allows", () => {
    const data = {
      id: 2,
      name: "Freebie",
      category: "promo",
      price: 0,
      quantity: 0,
    };
    const s = shop.addSweet(data);
    expect(s.price).toBe(0);
    expect(s.quantity).toBe(0);
  });

  it("addSweet: throws if negative price", () => {
    expect(() =>
      shop.addSweet({
        id: 3,
        name: "Bad",
        category: "Biscuit",
        price: -5,
        quantity: 1,
      })
    ).toThrow("Price must be a positive");
  });

  it("throws if quantity is negative", () => {
    expect(() =>
      shop.addSweet({
        id: 4,
        name: "Parle-G",
        category: "Biscuit",
        price: 5,
        quantity: -3,
      })
    ).toThrow("Quantity must be a positive integer");
  });

  it("throws if quantity is not an integer", () => {
    expect(() =>
      shop.addSweet({
        id: 5,
        name: "Monaco",
        category: "Biscuit",
        price: 5,
        quantity: 2.5,
      })
    ).toThrow("Quantity must be a positive integer");
  });
});

// Test cases for delete and search function
describe("Model: SweetShop, Sweet delete & search", () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();

    shop.addSweet({
      id: 1,
      name: "Ladoo",
      category: "Indian",
      price: 20,
      quantity: 10,
    });
    shop.addSweet({
      id: 2,
      name: "Chocolate",
      category: "Chocolate",
      price: 50,
      quantity: 5,
    });
    shop.addSweet({
      id: 3,
      name: "Gulab Jamun",
      category: "Milk-Based",
      price: 10,
      quantity: 50,
    });
    shop.addSweet({
      id: 4,
      name: "Barfi",
      category: "Indian",
      price: 15,
      quantity: 12,
    });
  });

  // delete
  it("deleteSweetsByCategory: removes sweets of the given category", () => {
    const removedSweets = shop.deleteSweetsByCategory("Indian");

    expect(removedSweets).toHaveLength(2);
  });

  it("deleteSweetsByCategory: throws if category not found", () => {
    expect(() => shop.deleteSweetsByCategory("Kaju-Based")).toThrow(
      "No sweets found in category Kaju-Based"
    );
  });

  // search
  it("searchByName: finds sweets", () => {
    const res1 = shop.searchByName("lado");
    expect(res1).toHaveLength(1);
    expect(res1[0].name).toBe("Ladoo");

    const res2 = shop.searchByName("JAmun");
    expect(res2).toHaveLength(1);
    expect(res2[0].name).toBe("Gulab Jamun");
  });

  it("searchByName: returns empty array if no match", () => {
    expect(shop.searchByName("xyz")).toEqual([]);
  });

  it("searchByCategory: exact match, case‑insensitive", () => {
    const res = shop.searchByCategory("milk-based");
    expect(res).toHaveLength(1);
    expect(res[0].category).toBe("Milk-Based");
  });

  it("searchByCategory: returns empty if none", () => {
    expect(shop.searchByCategory("fruit")).toEqual([]);
  });

  it("searchByPriceRange: includes sweets within [min, max]", () => {
    const res = shop.searchByPriceRange(10, 20);
    expect(res.map((s) => s.price).sort()).toEqual([10, 15, 20]);
  });

  it("searchByPriceRange: handles no matches", () => {
    expect(shop.searchByPriceRange(100, 200)).toEqual([]);
  });

  // purchase
  it("purchaseSweet: decreases quantity correctly", () => {
    const sweet = shop.addSweet({
      name: "Ladoo",
      category: "Indian",
      price: 20,
      quantity: 10,
    });
    const updated = shop.purchaseSweet(sweet.id, 3);
    expect(updated.quantity).toBe(7);
    expect(shop.viewSweets().find((s) => s.id === sweet.id).quantity).toBe(7);
  });

  it("purchaseSweet: throws on insufficient stock", () => {
    const sweet = shop.addSweet({
      name: "Chocolate",
      category: "Chocolate",
      price: 50,
      quantity: 5,
    });
    expect(() => shop.purchaseSweet(sweet.id, 10)).toThrow(
      `Insufficient stock for ID ${sweet.id}`
    );
  });

  it("purchaseSweet: throws on unknown id", () => {
    expect(() => shop.purchaseSweet("non-existent-id", 1)).toThrow(
      "Sweet with ID non-existent-id not found"
    );
  });

  // restock
  it("restockSweet: increases quantity correctly", () => {
    const sweet = shop.addSweet({
      name: "Chocolate",
      category: "Chocolate",
      price: 50,
      quantity: 5,
    });
    const updated = shop.restockSweet(sweet.id, 7);
    expect(updated.quantity).toBe(12);
    expect(shop.viewSweets().find((s) => s.id === sweet.id).quantity).toBe(12);
  });

  it("restockSweet: throws on unknown id", () => {
    expect(() => shop.restockSweet("non-existent-id", 5)).toThrow(
      "Sweet with ID non-existent-id not found"
    );
  });
});
