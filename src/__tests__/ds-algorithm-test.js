'use strict'

let DSObject
let DS

describe('ds-algorithm-test ',() => {
    beforeEach(() => {
        DSObject = require("../ds.js").DSObject
        DS = new DSObject({})
    })

    it('creates the DS text object', ()=>{
        expect(DS.constructor.name).toBe("DSObject")
        expect(DSObject.name).toBe("DSObject")
    })
    it('diffs and patchs two different contents and make result as a string', ()=>{
        const diff_result = [ [ [ { diffs: [ { '0': 1, '1': 'cat' } ],
                                    start1: 0,
                                    start2: 0,
                                    length1: 0,
                                    length2: 3 } ],
                                { client: 0, server: 0 } ] ]

        expect(DS.contentsHasChanged("cat")).toMatchObject(diff_result)
        console.log(`${DS.edits}`)

        expect(DS.edits.constructor.name).toBe("Array")
    })
})
