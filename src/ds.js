'use strict'
const __dev__ = true

// every constructor should have roro pattern param, so that facntory can send args
/*
   setOperation() should always have to be called after the available Types are set.
   After DSObject are created, you can add a diff-patch operation for a new type of content
   by addNewoperation() method.
   setOperation() sets which type of content operation you are going to use.
 */
const DSOperation = (()=>{

    const _diff = new WeakMap()
    const _patch = new WeakMap()
    const _availableTypeOperations = new WeakMap()

    class DSOperation {

        constructor(){
            _availableTypeOperations.set(this,new Map())
            _availableTypeOperations.get(this).set("text", new DSTextOperation())
            //_availableTypeOperations.get(this).set("vector", new DSTextOperation())
            this.setOperation("text")
        }

        addNewOperation(newOperation, newType){
            if(typeof newTypes ==! "sring")
                throw SyntaxError(`newTypes are should be string name of name`)
            _availableTypeOperations.get(this).set(newType, newOperation)
            this.setOperation(newType)
        }

        setOperation(contentType){
            for(const typeOperation of _availableTypeOperations.get(this)){
                if(typeOperation[0] == contentType){
                    _diff.set(this,typeOperation[1].diff)
                    if(!_diff.get(this))
                        throw new SyntaxError(`diff is not implemented! you should pass it as constructor param`)

                    _patch.set(this,typeOperation[1].patch)
                    if(!_patch.get(this))
                        throw new SyntaxError(`patch is not implemented! you should pass it as constructor param`)
                }
            }
        }

        diff(oldContent, newContent) {
            // should return edit_list data.
            // edit_list data is a form of specitication of data which is going to be patched
            return _diff.get(this)(oldContent, newContent)
        }

        patch(oldContent, edits) {
            // should return result data
            return _patch.get(this)(oldContent, edits)
        }
    }
    return DSOperation
})()

// Dependency injection to DSoperation class
const diff_match_patch = require('./diff-match-patch.js')

const DSTextOperation = function() {
    const _dmp = new diff_match_patch()
    return {
        diff : function (oldText, newText){
            const diff = _dmp.diff_main(oldText, newText)

            if (diff.length > 2) {
                _dmp.diff_cleanupSemantic(diff);
            }
            const edit_list = _dmp.patch_make(oldText, newText, diff)
            return edit_list
        },
        patch : function (oldText, edits){
            let result = ''
            for(const edit of edits){
                if (result)
                    result = _dmp.patch_apply(edit, result[0])
                else
                    result = _dmp.patch_apply(edit, oldText)

                return result[0]
            }
        }
    }
}

/*

 */
const DSLoop = (()=>{
    class DSLoop {

        constructor({url = "http://localhost:8080/", DSlocation = "client", defaultContent = ""}){
            this._url = url
            this._myVer = 0
            this._yourVer = 0
            this._edits = new Map()
            this._content = defaultContent
            this._shadow = ""
            this._backup = ""
            this._dsOperation = new DSOperation()
            //only client side

        }

        runLoop(){
            throw new SyntaxError(`runLoop is not implemented`)
        }

        _contentHasChanged(content){
            this._content = content

            if(this._edits.get("yourVer") == undefined){
                this._edits.set("yourVer",this._yourVer)
            }

            // 1a, 1b
            const delta = this._dsOperation.diff(this._shadow, this._content)

            if (delta.length =! 0){
                // 2
                this._edits.set(this._myVer, delta)
            }
            else {
                //nothing has changed
            }

            // 3
            this._shadow = this._content
            this._myVer++;

            return this._edits
        }

        // 질문!! javascript에서는 connection timeout 이 발 생했을 때 어떻게 하는가.
        // when ajax call has succecfully return
        // TODO: 계산된 프로퍼티 이름 computed property names로 바꾸기
        _receivedEdits(responceEdits){
            if(responceEdits.get("yourVer") == this._myVer){
                this._deleteEdits(responceEdits.get("yourVer"))
                for(let responceEdit of responceEdits){
                    if(responceEdit[0] >= this._yourVer){
                        this._shadow = this._dsOperation.patch(this._shadow, responceEdit[1])
                        this._yourVer++;
                        this._backup = this._shadow
                        this._backupVer = this._myVer
                        // we do this because before this function starts this._content might have been changed
                        this._content = this._dsOperation.patch(this._content, responceEdit[1])
                    }
                }
            }
            else{
                //previuse sending was faild
                //backup rutine
                this._edits = []
                this._shadow = this._backup
                this._myVer = this._backupVer
                this._receivedEdits(responceEdits)
            }
        }

        _deleteEdits(ver){
            for (let edit of this._edits){
                if(edit[0] < ver)
                    this._edits.delete(edit[0])
            }
        }
    }
    return DSLoop
})()

const DSLoopClient = (()=>{
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


// server ds
const DSLoopServer = (()=>{
    class DSLoopServer extends DSLoop{
        constructor(args){
            super(args)
        }
    }
    return DSLoopServer
})()

// pipeline structure, DSLoop is  middleware
const Pipeline = (()=>{
//    const _locationFactroy = new WeakMap()
    const _pipes = new WeakMap()

//    const addLocation = ()=>{
//        const locationFactory = _pipefactroy.get(this)
//        locationFactory.addProductSchema(DSLoopClient)
//        locationFactory.addProductSchema(DSLoopServer)
//    }

    class Pipeline {
        constructor(){
//            _localFactroy.set(this, new Factory())
//            _actionPipe.set(this, new Factory())
//            addLocation()

            _pipes.set(this, new Array())
        }
        addNextPipe(action, args){
            const pipes = _pipes.get(this)
            pipes.push([action, args])
        }
        runPipeline(){
            const pipes = _pipes.get(this)
            for(let key in pipes){
                if(pipes[key].constructor.name == "Array")
                    pipes[key]()
                pipes[key]
            }
        }
    }
    return Pipeline
})()


const Factory = (()=>{
    const _objects = new WeakMap()

    class Factory {
        constructor(){
            _objects.set(this, new Map())
        }
        addProductSchema(product){
            if(typeof product == "object")
                _objects.get(this).set(product.constructor.name, product)
            if(typeof product == "function")
                _objects.get(this).set(product.prototype.constructor.name, product)
        }
        produce(productName, args = {}){
            return new (_objects.get(this).get(productName))(args)
        }
    }
    return Factory
})()

const DSObject = (()=>{
    const _dsLocationfactory = new WeakMap()


    class DSObject {
        constructor(){
            _dsLocationfactory.set(this, new Factory())
            _dsLocationfactory.get(this).set("client", new DSLoopClient())
            _dsLocationfactory.get(this).set("server", new DSLoopServer())
        }

        setDS(location, url){

        }

        run(){
            DSLocation.runLoop()
        }
    }
    return DSObject
})()

module.exports = {
    DSLoop,
    DSOperation
}


