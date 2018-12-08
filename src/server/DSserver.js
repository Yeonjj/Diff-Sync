const DSLoop = require('../lib/ds.js')
const DSLoopServer = (()=>{
    class DSLoopServer extends DSLoop{
        constructor(args){
            super(args)
        }
    }
    return DSLoopServer
})()

module.exports = DSLoopServer

