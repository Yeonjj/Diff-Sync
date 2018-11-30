'use strict'
const __dev__ = true

const DPComponent = (()=>{

    const _edits = new WeakMap()
    const _diff = new WeakMap()
    const _patch = new WeakMap()


    class DPComponent {
        constructor(diff, patch){
            _edits.set(this, [])

            if(!_diff)
                throw new SyntaxError(`diff is not implemented! you should pass it as constructor param`)
            _diff.set(this, diff)

            if(!_patch)
                throw new SyntaxError(`patch is not implemented! you should pass it as constructor param`)
            _patch.set(this, patch)
        }

        get edits() {
            return _edits.get(this)
        }

        diff(oldContent, newContent) {
            _diff.get(this).call(this, oldContent, newContent)
        }

        patch(oldContent) {
            return _patch.get(this).call(this, oldContent)
        }
    }

    return DPComponent
})()

// ajax connection
const DSPipelineComponent = (()=>{
    // assume that content is always HETML element
    const _content = new WeakMap()
    const _xhr = new WeakMap()
    class DSPipelineComponent {
        constructor(content, url){
            _content.set(this, content)
            _url.set(this, url)
            _xhr.set(this, new XMLHttpRequest())
        }
        start(){
            setInterval(this.sendEditsWithVersionNumber(url),1000)
            return this
        }
        sendEditsWithVersionNumber(url, edits){
            // axjs send date [edits, my_ver, your_ver]
            throw new SyntaxError(`sendEditswithversionnumber is not implemented!`)
        }
    }
    return DSPipelineComponent
})()

// client ds
const DSPipelineClient = (()=>{
    class DSPipelineClient extends DSPipelineComponent{
        constructor(){
        }
        sendEditsWithVersionNumber(url, edits){

        }
    }
    return DSPipelineClient
})()


const DSPipelineServer = (()=>{
    class DSPipelineClient extends DSPipelineComponent{
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
    exports.DPComponent = DPComponent
    exports.DSPipelineComponent = DSPipelineComponent
}
exports.DSObject = DSObject


// This is an user side code.
// TODO: should make this be coded on user side as an inheritance class of DPComponent
const diff_match_patch = require('./diff-match-patch.js')

const implementDS = function() {
    const _dmp = new diff_match_patch()
    return {
        diff : function (oldText, newText){
            const diff = _dmp.diff_main(oldText, newText)

            if (diff.length > 2) {
                _dmp.diff_cleanupSemantic(diff);
            }

            const edit_list = _dmp.patch_make(oldText, newText, diff)
            this.edits.push(edit_list)
        },
        patch : function (oldText){
            let result = ''
            for(const edit of this.edits){
                if (result)
                    result = _dmp.patch_apply(edit, result[0])
                else
                    result = _dmp.patch_apply(edit, oldText)
            }
            return result[0]
        }
    }
}

const implemented = new implementDS()
exports.textComponent = new DPComponent(implemented.diff, implemented.patch)

