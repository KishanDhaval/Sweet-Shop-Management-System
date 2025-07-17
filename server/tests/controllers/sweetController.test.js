const request = require('supertest');
const express = require('express');
const sweetController = require('../../src/controllers/sweetController');

const app = express();
app.use(express.json());

app.post('/sweets', sweetController.addSweet);
app.get('/sweets', sweetController.viewSweets);
app.delete('/sweets/:id', sweetController.deleteSweet);
app.delete('/sweets/category/:category', sweetController.deleteSweetsByCategory);
app.get('/sweets/search/name', sweetController.searchByName);
app.get('/sweets/search/category', sweetController.searchByCategory);
app.get('/sweets/search/price', sweetController.searchByPriceRange);
app.get('/sweets/sort', sweetController.sortSweets);
app.post('/sweets/:id/purchase', sweetController.purchaseSweet);
app.post('/sweets/:id/restock', sweetController.restockSweet);

// Test cases
describe('SweetShop Controller', () => {
  let sweetId;

  // add sweets
  it('should add a sweet', async () => {
    const res = await request(app)
      .post('/sweets')
      .send({ name: 'Perk', category: 'chocolate', price: 10, quantity: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Perk');
    sweetId = res.body.id;
  });

  // view list
  it('should view sweets', async () => {
    const res = await request(app).get('/sweets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // search sweets
  it('should search by name', async () => {
    const res = await request(app).get('/sweets/search/name?name=perk');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Perk');
  });

  it('should search by category', async () => {
    const res = await request(app).get('/sweets/search/category?category=chocolate');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].category).toBe('chocolate');
  });

  it('should search by price range', async () => {
    const res = await request(app).get('/sweets/search/price?min=5&max=15');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].price).toBe(10);
  });

  // purchase sweets
  it('should purchase sweet', async () => {
    const res = await request(app)
      .post(`/sweets/${sweetId}/purchase`)
      .send({ qty: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  // restock sweets
  it('should restock sweet', async () => {
    const res = await request(app)
      .post(`/sweets/${sweetId}/restock`)
      .send({ qty: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(8);
  });

  // delete sweets
  it('should delete sweet by id', async () => {
    const res = await request(app).delete(`/sweets/${sweetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(sweetId);
  });

  it('should return 404 when deleting non-existent sweet', async () => {
    const res = await request(app).delete(`/sweets/non-existent-id`);
    expect(res.statusCode).toBe(404);
  });

  // sort sweets
  it('should sort sweets by price ascending (default)', async () => {
    await request(app)
      .post('/sweets')
      .send({ name: 'Cheap', category: 'misc', price: 10, quantity: 1 });
    await request(app)
      .post('/sweets')
      .send({ name: 'Expensive', category: 'misc', price: 100, quantity: 1 });

    const res = await request(app).get('/sweets/sort');
    expect(res.statusCode).toBe(200);
    const prices = res.body.map(s => s.price);
    expect(prices).toEqual(prices.slice().sort((a, b) => a - b)); 
  });

  it('should sort sweets by price descending when asc=false', async () => {
    await request(app)
      .post('/sweets')
      .send({ name: 'Mid', category: 'misc', price: 50, quantity: 1 });
    await request(app)
      .post('/sweets')
      .send({ name: 'High', category: 'misc', price: 150, quantity: 1 });

    const res = await request(app).get('/sweets/sort?asc=false');
    expect(res.statusCode).toBe(200);
    const prices = res.body.map(s => s.price);
    expect(prices).toEqual(prices.slice().sort((a, b) => b - a)); 
  });
});
