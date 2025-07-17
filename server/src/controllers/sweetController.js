const SweetShop = require('../models/sweetShop');

const shop = new SweetShop();

module.exports = {
  addSweet: (req, res) => {
    try {
      const sweet = shop.addSweet(req.body);
      res.status(201).json(sweet);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  viewSweets: (req, res) => {
    res.json(shop.viewSweets());
  },

  deleteSweet: (req, res) => {
    try {
      const sweet = shop.deleteSweet(req.params.id);
      res.json(sweet);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  deleteSweetsByCategory: (req, res) => {
    try {
      const sweets = shop.deleteSweetsByCategory(req.params.category);
      res.json(sweets);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  searchByName: (req, res) => {
    res.json(shop.searchByName(req.query.name || ''));
  },

  searchByCategory: (req, res) => {
    res.json(shop.searchByCategory(req.query.category || ''));
  },

  searchByPriceRange: (req, res) => {
    const min = Number(req.query.min) || 0;
    const max = Number(req.query.max) || Number.MAX_SAFE_INTEGER;
    res.json(shop.searchByPriceRange(min, max));
  },

   sortSweets: (req, res) => {
    try {
      const asc = req.query.asc !== 'false';
      const sorted = shop.sortByPrice(asc);
      return res.json(sorted);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  purchaseSweet: (req, res) => {
    try {
      const sweet = shop.purchaseSweet(req.params.id, Number(req.body.qty));
      res.json(sweet);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  restockSweet: (req, res) => {
    try {
      const sweet = shop.restockSweet(req.params.id, Number(req.body.qty));
      res.json(sweet);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
