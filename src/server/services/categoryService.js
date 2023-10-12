const { mongoose } = require('mongoose');
const { Category, Product } = require('../db');

class categoryService {
    static async addCategory(name, parentCategoryId) {
        const parentCategory = await this.findCategory(parentCategoryId);
        if (!parentCategory) {
            const error = new Error('부모 카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }
        const newCategory = { depth: 2, name, parentCategory: parentCategoryId };
        return await Category.create(newCategory);
    }

    static async addParentCategory(name) {
        const newCategory = { name };
        return await Category.create(newCategory);
    }

    static async findAllCategories() {
        return await Category.find({}).populate('parentCategory');
    }

    static async findCategoriesWithProductCountByDepth(depth) {
        const categories = await this.findCategoriesByDepth(depth);

        const result = [];
        for (const category of categories) {
            const products = await Product.find({ category: category._id });
            const productCount = products.length;

            result.push({
                category: category,
                productCount: productCount,
            });
        }
        return result;
    }

    static async findCategoriesByDepth(depth) {
        return await Category.find({ depth: depth }).populate('parentCategory');
    }

    static async findCategoriesByParent(parentCategoryId) {
        const parentCategory = await this.findCategory(parentCategoryId);
        if (!parentCategory) {
            const error = new Error('부모 카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }

        return await Category.find({ parentCategory: parentCategoryId }).populate('parentCategory');
    }

    static async findCategory(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Category.findById(id);
    }

    static async modifyCategory(id, useYn) {
        const category = await this.findCategory(id);
        if (!category) {
            const error = new Error('카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }
        category.useYn = useYn;
        await category.save();
        return category;
    }

    static async removeCategory(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = { categoryService };
