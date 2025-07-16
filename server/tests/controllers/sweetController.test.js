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
app.post('/sweets/:id/purchase', sweetController.purchaseSweet);
app.post('/sweets/:id/restock', sweetController.restockSweet);

// Test cases
describe('SweetShop Controller', () => {
  let sweetId;

  it('should add a sweet', async () => {
    const res = await request(app)
      .post('/sweets')
      .send({ name: 'Perk', category: 'chocolate', price: 10, quantity: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Perk');
    sweetId = res.body.id;
  });

  it('should view sweets', async () => {
    const res = await request(app).get('/sweets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

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

  it('should purchase sweet', async () => {
    const res = await request(app)
      .post(`/sweets/${sweetId}/purchase`)
      .send({ qty: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  it('should restock sweet', async () => {
    const res = await request(app)
      .post(`/sweets/${sweetId}/restock`)
      .send({ qty: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(8);
  });

  it('should delete sweet by id', async () => {
    const res = await request(app).delete(`/sweets/${sweetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(sweetId);
  });

  it('should return 404 when deleting non-existent sweet', async () => {
    const res = await request(app).delete(`/sweets/non-existent-id`);
    expect(res.statusCode).toBe(404);
  });
});
