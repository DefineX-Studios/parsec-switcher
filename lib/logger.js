const isDev = require('electron-is-dev');


const logger = {
    isDev : isDev,

    info(message){
        console.log(message)
    },
    debug(message){
        if(this.isDev){
            console.log(message)
        }
    }

}

module.exports = {
    logger
}