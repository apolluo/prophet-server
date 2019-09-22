const fs = require('fs');
const path = require('path');
const OUT_DIR = '/root/nginx/www/file';
function generateFileName(url) {
    let now = new Date();
    let file = url.split("/")
    if (file[2]) {
        file = file[2]
    } else {
        return { error: 'URL is not a valid' }
    }
    let path = `${OUT_DIR}/${file}/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}(${file})report`
    return {
        path,
        html: `${path}.html`,
        pdf: `${path}.pdf`,
        png: `${path}.png`
    }
}
function checkAndGenerateDir(filePath: string) {
    let dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
        return true
    }
    this.checkAndGenerateDir(dirname)
    fs.mkdirSync(dirname)
}
export {
    generateFileName,
    checkAndGenerateDir
}