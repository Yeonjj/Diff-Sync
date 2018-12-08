'use strict'
const diff_match_patch = require('../../util/diff-match-patch.js')
const __dev__ = true

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
                    result = _dmp.patch_apply(edits, oldText)
            }
            return result[0]
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
        }

        runLoop(){
            throw new SyntaxError(`runLoop is not implemented`)
        }

        _makeEdits(content){
            if(content){
                this._content = content
            }
            this._edits.set("yourVer",this._yourVer)

            const delta = this._dsOperation.diff(this._shadow, this._content)

            if (delta.length ==! 0){
                this._edits.set(this._myVer, delta)
                this._shadow = this._content
                this._myVer++
            }
            else {

            }

            return this._edits
        }

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
                this._edits = new Map()
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

module.exports = DSLoop
