/// Пример смартконтракта

class Contract {

}

class Payable extends Contracts {

    onPayment(payment) {
    }
}

const console = {
    log: function(string) {
        print(string);
    }
}

==============================

'use strict'

class A extends Contract {

    constructor() {
        this.a = 0
    }

    setA(a) {
        this.a = a
    }
    
    getA() {
        return this.a
    }
}

export A

===============================




