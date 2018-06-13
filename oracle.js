/// Пример смартконтракта Оракл
'use strict'

import PayableContract from 'GiantContracts'
import {sha3, call} from 'GiantUtils'
import console from 'GiantDebug'

class BTCUSDOracle extends PayableContract {

    constructor() {
        this.invocations = {}
    }
    
    addExec(start, finish, betId, openFn, closeFn) {
        const openId = sha3(start + betId + openFn)
        const closeId = sha3(finish + betId + closeFn)
        
        console.log('openId: ' + openId + ', closeId: ' + closeId)
        
        this.invocations[openId] = {
            time: start,
            contractId: betId,
            fn: openFn
        }
        this.invocations[closeId] = {
            time: finish,
            contractId: betId,
            fn: closeFn
        }
    }
    
    getExecs() {
        return this.invocations
    }
    
    exec(invocationId, rate) {
        const invocation = this.invocations[invocationId]
        
        if (invocation) {
            call(invocation.betId, invocation.fn, rate)
            delete this.invocations[invocationId]
            console.log('all done')
        } else {
            console.log('invocation not found')
        }
    }

}

export BTCUSDOracle

===============================




