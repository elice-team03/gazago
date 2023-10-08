const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

async function uploadFile(file, uploadDirectory) {
    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const serverFileName = `${nanoid()}-${file.name}`;
    const filePath = path.join(uploadDirectory, serverFileName);

    return new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ serverFileName, userFileName: file.name });
            }
        });
    });
}

async function deleteFile(serverFileName, uploadDirectory) {
    const filePath = path.join(uploadDirectory, serverFileName);
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = { uploadFile, deleteFile };
