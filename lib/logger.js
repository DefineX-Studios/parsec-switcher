

const logger = {
    isDev : process.env.PARSEC_SWITCHER_DEBUG,

    setIsDev(isDev) {
        this.isDev = isDev
    },

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