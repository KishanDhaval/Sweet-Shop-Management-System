const express = require("express");
const {
  addSweet,
  viewSweets,
  deleteSweet,
  deleteSweetsByCategory,
  searchByName,
  searchByCategory,
  searchByPriceRange,
  purchaseSweet,
  restockSweet,
} = require("../controllers/sweetController");

const router = express.Router();

// Add a sweet
router.post("/", addSweet);

// View all sweets
router.get("/", viewSweets);

// Delete sweet by id
router.delete("/:id", deleteSweet);

// Delete sweets by category
router.delete("/category/:category", deleteSweetsByCategory);

// Search by name
router.get("/search/name", searchByName);

// Search by category
router.get("/search/category", searchByCategory);

// Search by price range
router.get("/search/price", searchByPriceRange);

// Purchase sweet
router.post("/:id/purchase", purchaseSweet);

// Restock sweet
router.post("/:id/restock", restockSweet);

module.exports = router;
