
describe("Model: SweetShop", () => {
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
      id: 1,
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

  it("addSweet: throws on duplicate id", () => {
    const data = {
      id: 1,
      name: "Melody",
      category: "chocolate",
      price: 2,
      quantity: 10,
    };
    shop.addSweet(data);
    expect(() => shop.addSweet(data)).toThrow("Sweet with ID 1 already exists");
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
    ).toThrow("Price should be positive");
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

  it("addSweet: throws if id is not a number", () => {
    expect(() =>
      shop.addSweet({
        id: "one",
        name: "20-20",
        category: "Biscuit",
        price: 20,
        quantity: 1,
      })
    ).toThrow("id must be an Integer");
  });
});
