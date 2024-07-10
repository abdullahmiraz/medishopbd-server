const Category = require("../models/Category");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, code } = req.body;
    const newCategory = new Category({
      name,
      description,
      image,
      code,
    });
    console.log(newCategory);
    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories with subcategories populated
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subCategories");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single category by ID with subcategories populated
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "subCategories"
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("subCategories");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a subcategory to a specific category
exports.addSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const { name, description, image, code } = req.body;
    const newSubCategory = {
      name,
      description,
      image,
      code,
    };
    category.subCategories.push(newSubCategory);
    await category.save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a specific subcategory under a category
exports.updateSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, "subCategories._id": subCategoryId },
      {
        $set: {
          "subCategories.$.name": req.body.name,
          "subCategories.$.description": req.body.description,
          "subCategories.$.image": req.body.image,
          "subCategories.$.code": req.body.code,
        },
      },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    const updatedSubCategory = category.subCategories.id(subCategoryId);
    res.status(200).json(updatedSubCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific subcategory from a category
exports.deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $pull: { subCategories: { _id: subCategoryId } } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "SubCategory deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
