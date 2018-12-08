'use strict'

let test_client
let test_server

describe('ds-client-server-loop-test ',() => {
    beforeEach(() => {
        test_client = new (require("../ds.js"))({})
    })

    it('creates client DS object', ()=>{
        expect(test_client.constructor.name).toBe("DSLoop")
    })
    describe('when client side content changed', ()=> {
        it('should diff when a client content is changed and increment version', ()=>{
            const diff_result = [ { diffs: [ { '0': 1, '1': 'cat' } ],
                                    start1: 0,
                                    start2: 0,
                                    length1: 0,
                                    length2: 3 } ]

            expect(test_client._makeEdits("cat").get(0)).toMatchObject(diff_result)
            expect(test_client._myVer).toBe(1)
            expect(test_client._edits.get("yourVer")).toBe(0)
        })

        describe('after it receive responce', ()=>{
            beforeEach(()=>{
                test_server = new (require("../ds.js"))({})
            })
            it('dose nothing if client-side was not changed', ()=>{
                test_client._makeEdits()
                test_server._receivedEdits(test_client._edits)
                test_server._makeEdits(test_server._content)
                test_client._receivedEdits(test_server._edits)
                expect(test_client._content).toBe("")
                expect(test_client._myVer).toBe(0)
                expect(test_server._content).toBe("")
                expect(test_server._yourVer).toBe(0)

            })
            describe('if client has chagned', ()=>{
                beforeEach(()=>{
                    test_client._makeEdits("cat")
                    test_server._receivedEdits(test_client._edits)
                    test_server._makeEdits(test_server._content)
                    test_client._receivedEdits(test_server._edits)
                })
                it('should receive same edits if server-side are not changed', ()=>{
                    expect(test_client._content).toBe("cat")
                    expect(test_client._myVer).toBe(1)
                    expect(test_server._content).toBe("cat")
                    expect(test_server._yourVer).toBe(1)
                })
                describe('when server and client has content', ()=>{
                    beforeEach(()=>{
                        test_client._makeEdits("cats")
                        test_server._content = "my cat"
                        test_server._receivedEdits(test_client._edits)
                        test_server._makeEdits()
                    })
                    it('should patch from server edits', ()=>{
                        test_client._receivedEdits(test_server._edits)
                        expect(test_client._content).toBe("my cats")
                        expect(test_client._myVer).toBe(2)
                        expect(test_server._content).toBe("my cats")
                        expect(test_server._myVer).toBe(1)
                    })
                    it('should patch from the backup if previous edits are lost', ()=>{
                        test_client._makeEdits("cats!")
                        test_server._receivedEdits(test_client._edits)
                        test_server._makeEdits()
                        test_client._receivedEdits(test_server._edits)
                        expect(test_client._content).toBe("my cats!")
                        expect(test_client._myVer).toBe(3)
                        expect(test_server._content).toBe("my cats!")
                        expect(test_server._myVer).toBe(1)
                    })
                })
            })
        })
    })
})

