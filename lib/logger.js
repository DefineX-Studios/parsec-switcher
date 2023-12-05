let isDev = false;

try {
    const electronApp = require('electron').app || require('@electron/remote').app;
    isDev = !electronApp.isPackaged;
} catch (e) {
    console.error("Couldn't set isDev properly for logger");
    console.error(e);
}

const logger = {
    isDev : isDev,

    info(message){
        console.log(message)
    },
    debug(message){
        if(this.isDev) console.log(message)
    }

}

module.exports = {
    logger
}