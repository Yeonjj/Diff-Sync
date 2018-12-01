'use strict'
// DS always should be singltone
let DS

describe('ds-pipeline-test ',() => {
    beforeEach(() => {
        DS = require('../ds.js').DSObject()
    })
    it('create DS object')
    it('set content and url')
    it('set shadow of content and backup shadow')
    it('on client side, set DSclient.sendEdits(data) callback in event listener')
    it('on server side, set DSserver.sendEdits(content.data) callback as a respons ajax call')

    describe('DSclient.sendEdits(content) to server or vise versa',()=>{
        it('DSclient.diff() : add edits')
        it('sets edits with(tagging) current version number(my = 0, you = 0)')
        it('set client shadow as client content')
        it('increments my=1')
        it('sends xhr data to privided url')
        it('sets xhr event listener callback')

        describe('xhr-event-listener-callback ', ()=>{
            it('checks received sender my_ver, you_ver is matching local my_ver, you_ver')
            it('patchs backup shadow')
            it('patchs reseived edits only if local you_ver < sender my_ver')
            it('increments you_ver')
            it('iterates edits until both ver are smae')
            it('')
        })
    })




    it('should add conent event handler'. () =>{
    })

    it('should take two different contents', () => {

    })

    it('should make edits and increment version number',() => {
    })
})

// use-case clinet
// ds.startSending(content,serverUrl)
// eventlitsenter('keyup', ds.sendEdits)
// 클라이언트

// use-case server
// ds.startListening('/destination-or-code-room-number')
