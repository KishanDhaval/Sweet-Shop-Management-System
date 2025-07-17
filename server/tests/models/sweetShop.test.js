const SweetShop = require("../../src/models/sweetShop");

// Test cases for add function
describe("Model: SweetShop, Sweet add", () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();
  });

  it("addSweet: throws if any missing", () => {
    expect(() => shop.addSweet({ category: "chocolate" })).toThrow(
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
        name: "Monaco",
        category: "Biscuit",
        price: 5,
        quantity: 2.5,
      })
    ).toThrow("Quantity must be a positive integer");
  });
});

// Test cases for delete and search function
describe("Model: SweetShop, Sweet delete, search, sort, purchase & restock", () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();

    shop.addSweet({
      name: "Ladoo",
      category: "Indian",
      price: 20,
      quantity: 10,
    });
    shop.addSweet({
      name: "Chocolate",
      category: "Chocolate",
      price: 50,
      quantity: 5,
    });
    shop.addSweet({
      name: "Gulab Jamun",
      category: "Milk-Based",
      price: 10,
      quantity: 50,
    });
    shop.addSweet({
      name: "Barfi",
      category: "Indian",
      price: 15,
      quantity: 12,
    });
  });

  // delete
  it("deleteSweet: removes and returns the sweet by id", () => {
    const sweet = shop.addSweet({
      name: "Barfi",
      category: "Indian",
      price: 15,
      quantity: 12,
    });
    const removed = shop.deleteSweet(sweet.id);
    expect(removed).toMatchObject({ id: sweet.id, name: "Barfi" });
    expect(shop.viewSweets().find((s) => s.id === sweet.id)).toBeUndefined();
  });

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

  // sort
  it("sortByPrice: ascending order (default)", () => {
    const sorted = shop.sortByPrice();
    const prices = sorted.map((s) => s.price);
    expect(prices).toEqual([10, 15, 20, 50]);
  });

  it("sortByPrice: descending order", () => {
    const sorted = shop.sortByPrice(false);
    const prices = sorted.map((s) => s.price);
    expect(prices).toEqual([50, 20, 15, 10]);
  });

  it("sortByPrice: does not mutate original sweet list", () => {
    const original = shop.viewSweets();
    const sorted = shop.sortByPrice();
    expect(shop.viewSweets()).toEqual(original);
    expect(shop.viewSweets()).not.toBe(sorted);
  });

  it("sortByPrice: handles equal prices", () => {
    shop.addSweet({ name: "Equal1", category: "Test", price: 15, quantity: 1 });
    shop.addSweet({ name: "Equal2", category: "Test", price: 15, quantity: 1 });

    const sorted = shop.sortByPrice();
    const prices = sorted.map((s) => s.price);
    const expected = [10, 15, 15, 15, 20, 50];
    expect(prices).toEqual(expected);
  });

  it("sortByPrice: returns single sweet unchanged", () => {
    const singleShop = new SweetShop();
    singleShop.addSweet({
      name: "Only",
      category: "Solo",
      price: 99,
      quantity: 1,
    });
    const sorted = singleShop.sortByPrice();
    expect(sorted).toHaveLength(1);
    expect(sorted[0].price).toBe(99);
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
