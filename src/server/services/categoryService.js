const { mongoose } = require('mongoose');
const { Category } = require('../db');

class categoryService {
    static async addCategory(name) {
        let sequence = 1;

        const existingCategory = await Category.findOne();
        if (existingCategory) {
            const maxSequenceCategory = await this.findCategoryMaxSequence();
            sequence = maxSequenceCategory.sequence + 1;
        }

        const newCategory = { name, sequence };
        return await Category.create(newCategory);
    }

    static async findCategoryMaxSequence() {
        return await Category.findOne().sort({ sequence: -1 }).limit(1);
    }

    static async findAllCategories() {
        return await Category.find({});
    }

    static async findCategory(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.statusCode = 400;
            throw error;
        }
        return await Category.findById(id);
    }

    static async removeCategory(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('카테고리 Id 값이 유효하지 않습니다.');
            error.statusCode = 400;
            throw error;
        }
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = { categoryService };
