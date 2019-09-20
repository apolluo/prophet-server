const os = require('os')
const CHROME_PATH_LINUX = '/usr/bin/google-chrome'
const CHROME_PATH_WIN = 'C:\\Users\\mingluo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const CHROME_PATH = os.platform() == 'linux' ? CHROME_PATH_LINUX : CHROME_PATH_WIN
console.log(CHROME_PATH)
export {
    CHROME_PATH
}