import {DSLoop} from '../lib/ds'
export const DSLoopServer = (()=>{
    class DSLoopServer extends DSLoop{
        constructor(args){
            super(args)
        }
        runLoop(){
        }
    }
    return DSLoopServer
})()
