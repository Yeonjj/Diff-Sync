'use strict'

let DSObject
let DS

describe('ds-algorithm-test ',() => {
    beforeEach(() => {
        DSObject = require("../ds.js").DSObject
        DS = new DSObject("server")
    })

    it('creates the DS text object', ()=>{
        expect(DS.constructor.name).toBe("DSObject")
        expect(DSObject.name).toBe("DSObject")
    })
    it('diffs and patchs two different contents and make result as a string', ()=>{
        DS.contentsHasChanged("cat")
        expect(DS.edits.constructor.name).toBe("Array")
        console.log(`${DS.edits}, ${DS.edits[1]}`)
    })
})
