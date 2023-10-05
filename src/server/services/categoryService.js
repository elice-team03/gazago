const { mongoose } = require('mongoose');
const { Category } = require('../db');

class categoryService {
    static async addCategory(name, parentCategoryId) {
        const parentCategory = await this.findCategory(parentCategoryId);
        if (!parentCategory) {
            const error = new Error('부모 카테고리를 찾을 수 없습니다.');
            error.status = 400;
            throw error;
        }
        const newCategory = { depth: 1, name, parentCategory: parentCategoryId };
        return await Category.create(newCategory);
    }

    static async addParentCategory(name) {
        const newCategory = { name };
        return await Category.create(newCategory);
    }

    static async findAllCategories() {
        return await Category.find({});
    }

    static async findCategory(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }
        return await Category.findById(id);
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
