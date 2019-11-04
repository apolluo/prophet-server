const os = require('os')
const CHROME_PATH_LINUX = '/usr/bin/google-chrome'
const CHROME_PATH_WIN = 'C:\\Users\\mingluo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const CHROME_PATH_WIN_COM=  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const CHROME_PATH = os.platform() == 'linux' ? CHROME_PATH_LINUX : os.hostname()==='mingluo-PC2'?CHROME_PATH_WIN_COM: CHROME_PATH_WIN
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
const DB_LIST={
    DEVNET:{
        DATABASE_PATH:'9.134.2.47:27017',
        username : 'root',
        password : '123456',
    },
    LOCAL:{
        DATABASE_PATH:'localhost:27017',
        username : 'root',
        password : '123456',
    },
    MONEY:{
        DATABASE_PATH:'139.155.53.64:27017',
        username : 'apolluo',
        password : 'xingxuan@1983',
    }
}
const DB_CONFIG=os.platform() == 'linux' ?DB_LIST.LOCAL:DB_LIST.MONEY
const DATABASE_URI=`mongodb://${DB_CONFIG.username}:${encodeURIComponent(DB_CONFIG.password)}@${DB_CONFIG.DATABASE_PATH}/nest?authSource=admin`
export {
    CHROME_PATH,
    RULE_TARGET_TYPE,
    DATABASE_URI
}