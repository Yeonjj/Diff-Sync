import {DSLoop} from '../lib/ds.js'
export const DSLoopClient = (()=>{

    class DSLoopClient extends DSLoop{
        constructor(args){
            super(args)
        }
        runLoop(){
        }
    }
    return DSLoopClient
})()

const testLoop = new DSLoopClient({})
