'use strict'
import {diff_match_patch} from '../util/diff-match-patch.js'
const __dev__ = true

/*
   setOperation() should always have to be called after the available Types are set.
   After DSObject are created, you can add a diff-patch operation for a new type of content
   by addNewoperation() method.
   setOperation() sets which type of content operation you are going to use.
 */
export const DSOperation = (()=>{

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
export const DSLoop = (()=>{

    const _url = new WeakMap()
    const _myVer = new WeakMap()
    const _yourVer = new WeakMap()
    const _edits = new WeakMap()
    const _content = new WeakMap()
    const _shadow = new WeakMap()
    const _backup = new WeakMap()
    const _dsOperation = new WeakMap() 

    class DSLoop {
        constructor({url = "http://localhost:8080/", DSlocation = "client", defaultContent = ""}){
            _url.set(this, url)
            _myVer.set(this, 0)
            _yourVer.set(this, 0)
            _edits.set(this, new Map())
            _content.set(this, defaultContent)
            _shadow.set(this, "")
            _backup.set(this, "")
            _dsOperation.set(this, new DSOperation())
        }

        runLoop(){
            throw new SyntaxError(`runLoop is not implemented`)
        }

        _makeEdits(content){
            if(content){
                _content.set(this, content)
            }
            _edits.get(this).set("yourVer",_yourVer.get(this))

            const delta = _dsOperation.get(this).diff(_shadow.get(this), _content.get(this))

            if (delta.length ==! 0){
                _edits.get(this).set(_myVer.get(this), delta)
                _shadow.set(this, _content.get(this))
                _myVer.set(this, _myVer.get(this) + 1)
            }
            else {

            }

            return _edits.get(this)
        }

        // TODO: 계산된 프로퍼티 이름 computed property names로 바꾸기
        _receivedEdits(responceEdits){
            if(responceEdits.get("yourVer") == _myVer.get(this)){
                this._deleteEdits(responceEdits.get("yourVer"))
                for(let responceEdit of responceEdits){
                    if(responceEdit[0] >= _yourVer.get(this){
                        _shadow.set(this, _dsOperation.get(this).patch(_shadow.get(this), responceEdit[1]))
                        _yourVer.set(this, _yourVer.get(this) + 1)
                        _backup.get(this), _shadow.get(this)
                        _backupVer.set(this, _myVer.get(this))
                        // we do this because before this function starts this._content might have been changed
                        _content.set(this, _dsOperation.get(this).patch(_content.get(this), responceEdit[1])
                    }
                }
            }
            else{
                _edits.set(this, new Map())
                _shadow.set(this, _backup.get(this))
                _myVer.set(this, _backupVer.get(this))
                this._receivedEdits(responceEdits)
            }
        }

        _deleteEdits(ver){
            for (let edit of _edits.get(this)){
                if(edit[0] < ver)
                    _edits.get(this).delete(edit[0])
            }
        }
    }
    return DSLoop
})()

