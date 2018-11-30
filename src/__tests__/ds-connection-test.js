'use strict'

let DSConnection
let content

describe('ds-connection-test', ()=>{
    beforeEach(() => {
        content = "test"
        DSConnection = new (require('../ds.js').DSConnectionComponent)(content, 'http://localhost:3000/coderoom')
    })
    it('should send a ajax request regularly in client-side ', () => {
        DSConnection.startSending()
    })
})
