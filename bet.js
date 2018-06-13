/// Пример смартконтракта Оракл
'use strict'

import PayableContract from 'GiantContracts'
// sha3 - вернет хеш sha3 
// call - вызов метода внешнего смартконтракта
// send - отправка денег на определенный адрес
// getAddress - вернет адрес текущего смартконтракта
// getCallerAddress - вернет адрес пользователя кто деплоит/вызывает метод смартконтракта
// getAmount - вернет сумму из транзакции
// getTime - вернет время транзакции (время блока)
import {sha3, call, send, getAddress, getCallerAddress, getAmount, getTime} from 'GiantUtils'
import console from 'GiantDebug'

// Пример смартконтракта пари (разовое с фиксированной ставкой)
class BTCUSDBet extends PayableContract {

    constructor(start, finish, amount, oracleId, oracleAddress, oracleFee, ownerAddress, ownerFee) {
        this.start = start
        this.finish = finish        
        // проверка finish > start
        this.amount = amount
        this.oracleId = oracleId
        this.oracleAddress = oracleAddress
        this.oracleFee = oracleFee
        this.ownerAddress = ownerAddress
        this.ownerFee = ownerFee
        this.bets = []
                
        this.rateOpen = 0
        this.rateClose = 0        
        
        call(this.oracleId, 'addExec', this.start, this.finish, getAddress(), 'open', 'close')        
    }
    
    addBet(more) {
        const betAddress = getCallerAddress()
        const betAmount = getAmount()
        
        if (betAmount != this.amount) {
            send(betAddress, betAmount)
            return
        }
        
        // TODO остальные проверки, например что один адрес - одна ставка, время размещения не позже start и fininsh и т.д.
        
        this.bets.push({
            address: address,
            amount: betAmount,
            more: more,
            time: getTime()
        })
    }
    
    open(rate) {
        this.rateOpen = rate
    }
    
    close(rate) {
        this.rateClose = rate
                
        // FIXME если rateClose === rateOpen - то делаем возврат, комиссия только сети и оракулу        
                
        // Закрываем пари - рассылаем бабло   
        let winAmount = 0;
        let loseAmount = 0;
        const winners = [];    
        
        this.bets.forEach(bet => {
            if (bet.more) {
                if (this.rateClose > this.rateOpen) {
                    winAmount += bet.amount;
                    winners.push(bet.address)
                } else {
                    loseAmount += bet.amount;
                }
            } else {
                if (this.rateClose < this.rateOpen) {
                    winAmount += bet.amount;
                    winners.push(bet.address)
                } else {
                    loseAmount += bet.amount;
                }
            }
        })
        
        const oracleAmount = this.oracleFee * (winAmount + loseAmount)
        const oracleOwner = this.ownerFee * (winAmount + loseAmount)
        
        send(this.oracleAddress, this.oracleAmount)
        send(this.ownerAddress, this.ownerAmount)
        
        loseAmount -= (oracleAmount + oracleOwner)
        const reward = this.amount + loseAmount / winners.length    
        
        winners.forEach(address => {
            send(address, reward)
        })
    }
}

export BTCUSDOracle

===============================




