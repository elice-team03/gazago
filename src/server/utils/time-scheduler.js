const cron = require('node-cron');
const { memoryUsage } = require('node:process');
const { productService } = require('../services/productService');

const mailScheduler = () => {
    const totalMemory = memoryUsage().heapTotal;
    const usedMemory = memoryUsage().heapUsed;
    if (0.7 * totalMemory < usedMemory) {
        return;
    }
    let count = 0;
    cron.schedule('* * * * * *', async () => {
        if (count < 1) {
            try {
                // await productService.findBest3Product();
                count += 1;
            } catch {
                throw Object.assign(new Error('카탈로그 메일발송을 실패하였습니다'), { status: 400 });
            }
        }
        return;
    });

    return;
};

module.exports = mailScheduler;
