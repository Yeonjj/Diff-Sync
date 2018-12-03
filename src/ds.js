'use strict'
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
            if(typeof(newTypes)==!"sring")
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
 * @param {DSlocation} A location the DSobject are at
 */
const DSObject = (()=>{
    const _url = new WeakMap()
    const _edits = new WeakMap()
    const _ver = new WeakMap()
    const _content = new WeakMap()
    const _DSOperation = new WeakMap()
    const _DSPiplineMng = new WeakMap()
    const _xhr = new WeakMap()

    class DSObject {

        /*
           edits
           [
              delta,
              {
                 my : 0,
                 your : 0
              }
           ]
        */

        constructor({url, DSlocation, defaultContent : "" }){
            _url.set(this, url)
            _ver.set(this,{client : 0 , server : 0})
            _edits.set(this, [])
            _content.set(this, defaultContent)
            _DSOperation.set(this, new DSOperation())
            _DSPiplineMng.set(this, new DSPipelineManager(DSlocation))
            //only client side
            //_xhr.set(this, new XMLHttpRequest())
        }

        // there is no need this method to be public.
        get edits(){
            return _edits.get(this)
        }

        contentsHasChanged(changedContent){
            const delta = _DSOperation.get(this).diff(_content.get(this), changedContent)
            _edits.get(this).push([delta, _ver.get(this)])
            _ver.get(this).client++;
            return _edits.get(this)
        }

        receivedEdits(edits){
            if(edits[1].my == _edits.get(this)[1].your){

            }
        }

        run(){
            //setInterval(,1000)
        }
        sendEditsWithVersionNumber(url, edits){
            // axjs send date [edits, my_ver, your_ver]
            throw new SyntaxError(`sendEditswithversionnumber is not implemented!`)
        }
    }
    return DSObject
})()

// client ds
const DSObjectClient = (()=>{
    class DSObjectClient {
        constructor(){
        }
    }
    return DSObjectClient
})()

// server ds
const DSObjectServer = (()=>{

    class DSObjectServer {
        constructor(){
        }
    }
    return DSObjectServer
})()

// pipeline structure, DSObject is  middleware
const DSPipelineManager = (()=>{
    class DSPipelineManager {
    }

    return DSPipelineManager
})()

module.exports = {
    DSObject,
    DSOperation
}


