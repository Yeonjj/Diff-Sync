const diff_match_patch = require('./diff-match-patch.js')
const __dev__ = true

const DSComponent = ((()=>{

    const _shadow = new WeakMap()
    const _content = new WeakMap()
    const _edits = new WeakMap()

    class DSComponent {
        constructor(){
            _edits.set(this, [])
            _content.set(this, null)
            _showdow.set(this, null)
        }

        diff(oldContent, newContent) {
            throw new SyntaxError(`running from DSComponent : diff is not implemented!`)
        }

        patch() {
            throw new SyntaxError(`running form DSComponent : patch is not implemented`)
        }
    }

    //TDOO: 여기에 DSTextcomponent를 가지고 오면

    return DSComponent
})())

const DSTextComponent = ((()=>{
    const _dmp = new WeakMap()

    class DSTextComponent extends DSComponent {
        constructor(){
            super()
            _dmp.set(this, new diff_match_patch())
        }

        diff(oldText, newText){
            if(__dev__){
                const t0 = performance.now()
                _dmp.get(this).diff_main(oldText, newText)
                const t1 = performance.now()
                console.lot(`${t1-t0} ms`)
            }

            const diff = _dmp.get(this).diff_main(oldText, newText)

            if (edit.length > 2) {
                _dmp.get(this).diff_cleanupSemantic(edit);
            }

            const edit_list = _dmp.get(this).patch_make(oldText, newText, diff)
            super.edits.push(edit_list)
        }

        patch(oldText){
            let result = ''
            for(const edit of super.edits){
                if (result)
                    result = _dmp.get(this).patch_apply(edit, result[0])
                else
                    result = _dmp.get(this).patch_apply(edit, oldText)
            }
            return result[0]
        }
    }
    // DSTextcomponent를 singletone으로 만들기 위해 new로 선언.
    // DScomponent의 edits를 보호하기 위함.
    // DS라이브러리에서 직접 객체를 하나 만들어서 준다.
    return new DSTextComponent()
})())
