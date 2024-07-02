const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategoryById);
router.delete("/:id", categoryController.deleteCategoryById);
router.post("/:categoryId/subcategories", categoryController.addSubCategory);
router.put(
  "/:categoryId/subcategories/:subCategoryId",
  categoryController.updateSubCategory
);
router.delete(
  "/:categoryId/subcategories/:subCategoryId",
  categoryController.deleteSubCategory
);

module.exports = router;
