const os = require('os')
const CHROME_PATH_LINUX = '/usr/bin/google-chrome'
const CHROME_PATH_WIN = 'C:\\Users\\mingluo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const CHROME_PATH = os.platform() == 'linux' ? CHROME_PATH_LINUX : CHROME_PATH_WIN
let CONST_VAR = {
    RULE_TARGET_TYPE: ['HTML', 'DOM', 'TXT', 'JS', 'API', 'TAG']
};
enum RULE_TARGET_TYPE {
    'HTML' = 0,
    'DOM' = 1,
    'TXT' = 2,
    'JS' = 3,
    'API' = 4,
    'TAG' = 5
}
console.log(CHROME_PATH)
export {
    CHROME_PATH,
    RULE_TARGET_TYPE
}