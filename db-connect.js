require('dotenv').config();
const mongoose = require('mongoose');

module.exports = async function connectToMongoDB() {
    const mongo_uri = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongo_uri);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
