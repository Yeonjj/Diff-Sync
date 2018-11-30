'use strict'

let diff_match_patch
let dmp
let DS

describe('ds-algorithm-test ',() => {
    beforeEach(() => {
        diff_match_patch = require("../diff-match-patch.js")
        dmp = new diff_match_patch()
        DS = require("../ds.js")
    })

    it('creates the DS text object', ()=>{
        expect(Object.keys(DS)).toEqual(['textComponent', 'DSConnectionComponent', 'DSObject'])
        expect(typeof(DS.textComponent)).toBe("object")
        expect(typeof(diff_match_patch)).toBe("function")
        expect(typeof(dmp)).toBe("object")
    })
    it('diffs and patchs two different contents and make result as a string', ()=>{
        DS.textComponent.diff("cat","cats")
        expect(DS.textComponent.patch("Cat")).toBe("Cats")
    })
})
