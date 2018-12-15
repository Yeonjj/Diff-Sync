import {DSLoop} from '../lib/ds'
export const DSLoopClient = (()=>{
    const _xhr = new WeakMap()

    class DSLoopClient extends DSLoop{
        constructor(args){
            super(args)
            _xhr.set(this, new XMLHttpRequest())
        }
        runLoop(){
        }
    }
    return DSLoopClient
})()
