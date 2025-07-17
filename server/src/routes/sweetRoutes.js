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
  sortSweets,
} = require("../controllers/sweetController");

const router = express.Router();

// Add a sweet
router.post("/", addSweet);

// View all sweets
router.get("/", viewSweets);

// Delete 
router.delete("/:id", deleteSweet);
router.delete("/category/:category", deleteSweetsByCategory);

// Search by name
router.get("/search/name", searchByName);
router.get("/search/category", searchByCategory);
router.get("/search/price", searchByPriceRange);

// Sort 
router.get("/sort", sortSweets)

// Purchase sweet
router.post("/:id/purchase", purchaseSweet);

// Restock sweet
router.post("/:id/restock", restockSweet);

module.exports = router;
