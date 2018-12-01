'use strict'
const __dev__ = true

const DSOperation = (()=>{

    const _diff = new WeakMap()
    const _patch = new WeakMap()

    class DSOperation {
        constructor(diff, patch){
            if(!_diff)
                throw new SyntaxError(`diff is not implemented! you should pass it as constructor param`)
            _diff.set(this, diff)

            if(!_patch)
                throw new SyntaxError(`patch is not implemented! you should pass it as constructor param`)
            _patch.set(this, patch)
        }
        diff(oldContent, newContent) {
            return _diff.get(this)(oldContent, newContent)
        }
        patch(oldContent, edits) {
            return _patch.get(this)(oldContent, edits)
        }
    }
    return DSOperation
})()

// pipeline
const DSPipeline = (()=>{
    // assume that content is always HETML element
    const _edits = new WeakMap()
    const _myVer = new WeakMap()
    const _yourVer = new WeakMap()
    const _content = new WeakMap()
    const _DSOperation = new WeakMap()
    const _xhr = new WeakMap()
    class DSPipeline {
        constructor(contentType, url){
            _url.set(this, url)
            _xhr.set(this, new XMLHttpRequest())
            this.createOperation(contentType)
        }
        //start pipline
        run(){
            setInterval(,1000)
        }
        sendEditsWithVersionNumber(url, edits){
            // axjs send date [edits, my_ver, your_ver]
            throw new SyntaxError(`sendEditswithversionnumber is not implemented!`)
        }
        createOperation(type){
            if(type == "text"){
                const dsText = new DSTextOperation()
                _DSOperation.set(this, new DSOperation(dsText.diff, dsText.patch))
            }
        }
    }
    return DSPipelineComponent
})()

// client ds
const DSPipelineClient = (()=>{
    class DSPipelineClient extends DSPipeline{
        constructor(){
        }
        sendEditsWithVersionNumber(url, edits){
        }
    }
    return DSPipelineClient
})()

// server ds
const DSPipelineServer = (()=>{
    const _
    class DSPipelineServer {
        constructor(){
        }
        sendEditsWithVersionNumber(url, edits){

        }
    }
    return DSPipelineClient
})()

// pipeline structure, DSObject is  middleware
const DSObject = (()=>{
    class DSObject {
    }

    return DSObject
})()

if(__dev__){
    exports.DSOperation = DSOperation
    exports.DSPipelineComponent = DSPipelineComponent
}
exports.DSObject = DSObject


// This is an user side code.
// TODO: should make this be coded on user side as an inheritance class of DSOperation
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
