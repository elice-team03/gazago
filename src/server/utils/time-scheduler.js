const cron = require('node-cron');
const { memoryUsage } = require('node:process');
const { productService } = require('../services/productService');

const mailScheduler = () => {
    const totalMemory = memoryUsage().heapTotal;
    const usedMemory = memoryUsage().heapUsed;
    if (usedMemory < totalMemory * 0.7) {
        cron.schedule('1 13 * * *', async () => {
            try {
                await productService.findBest3Product();
            } catch {
                throw Object.assign(new Error('카탈로그 메일발송을 실패하였습니다'), { status: 400 });
            }

            return;
        });
    }
    return;
};

module.exports = mailScheduler;
