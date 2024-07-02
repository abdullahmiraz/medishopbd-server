const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories with subcategories and primary categories populated
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('primaryCategory', 'name') // Populate only the name field of primaryCategory
      .populate('subCategories'); // Populate subCategories
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single category by ID with subcategories and primary category populated
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('primaryCategory', 'name') // Populate only the name field of primaryCategory
      .populate('subCategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
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
    })
      .populate('primaryCategory', 'name') // Populate only the name field of primaryCategory
      .populate('subCategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
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
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a subcategory to a specific category
exports.addSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const newSubCategory = {
      name: req.body.name,
      description: req.body.description,
      categoryImage: req.body.categoryImage,
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
      { _id: categoryId, 'subCategories._id': subCategoryId },
      {
        $set: {
          'subCategories.$.name': req.body.name,
          'subCategories.$.description': req.body.description,
          'subCategories.$.categoryImage': req.body.categoryImage,
        },
      },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific subcategory from a category
exports.deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.subCategories.id(subCategoryId).remove();
    await category.save();
    res.status(200).json({ message: 'SubCategory deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the name of a category by its ID
exports.getCategoryNameById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('name');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ name: category.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
