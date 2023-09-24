const {global_state} = require("./initialize")

async function beforeQuit(){

    for(const p in global_state.promisesToRun){
           await global_state.promisesToRun[p]
    }
    return 0
}
module.exports ={
    beforeQuit
}