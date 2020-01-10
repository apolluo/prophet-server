const os = require('os')
const CHROME_PATH_LINUX = '/usr/bin/google-chrome'
const CHROME_PATH_WIN = 'C:\\Users\\mingluo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
const CHROME_PATH_WIN_COM = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const CHROME_PATH = os.platform() == 'linux' ? CHROME_PATH_LINUX : os.hostname() === 'mingluo-PC2' ? CHROME_PATH_WIN_COM : CHROME_PATH_WIN
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
const IP_LIST = {
    DEVNET: '9.134.2.47',
    LOCAL: 'localhost',
    MONEY: '139.155.53.64'
}
const getHostName=ip=>{
    if(ip=='9.134.2.47')return 'DEVNET'
    if(ip=='139.155.53.64') return 'MONEY'
    return 'MONEY'
}
const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
let IPAdress = '';
for (var devName in interfaces) {
    //排除桥接网络
    if (devName.indexOf('br') > -1) continue;
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            IPAdress = alias.address;
            break;
        }
    }
}
const HOST_NAME=getHostName(IPAdress)
console.log(IPAdress,HOST_NAME);
console.log(CHROME_PATH)
const DB_LIST = {
    DEVNET: {
        DATABASE_PATH: `${IP_LIST.DEVNET}:27017`,
        username: 'root',
        password: '123456',
    },
    LOCAL: {
        DATABASE_PATH: `${IP_LIST.LOCAL}:27017`,
        username: 'root',
        password: '123456',
    },
    MONEY: {
        DATABASE_PATH: `${IP_LIST.MONEY}:27017`,
        username: 'apolluo',
        password: 'xingxuan@1983',
    }
}
const DB_CONFIG = DB_LIST[HOST_NAME]
const DATABASE_URI = `mongodb://${DB_CONFIG.username}:${encodeURIComponent(DB_CONFIG.password)}@${DB_CONFIG.DATABASE_PATH}/nest?authSource=admin`
const AMQP_URI = `amqp://${IPAdress}`
export {
    CHROME_PATH,
    RULE_TARGET_TYPE,
    DATABASE_URI,
    AMQP_URI
}