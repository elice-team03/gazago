const cron = require('node-cron');
const { memoryUsage } = require('node:process');
const { productService } = require('../services/productService');

const mailScheduler = () => {
    const totalMemory = memoryUsage().heapTotal;
    const usedMemory = memoryUsage().heapUsed;
    // if (usedMemory < totalMemory * 0.7) {
    cron.schedule('1 55 13 * * *', async () => {
        try {
            console.log('scheduler start...');
            // await productService.findBest3ProductsAndSendEmailToAllUsers();
            console.log('scheduler ended...');
        } catch (e) {
            console.log(e);
        }
    });
    // }
};

module.exports = mailScheduler;
