let Web3 = require('web3')
let web3 = new Web3()

let statusContract = web3.eth.contract([{'constant': false, 'inputs': [{'name': 'status', 'type': 'string'}], 'name': 'updateStatus', 'outputs': [], 'type': 'function'}, { 'constant': false, 'inputs': [{ 'name': 'addr', 'type': 'address' }], 'name': 'getStatus', 'outputs': [{ 'name': '', 'type': 'string' }], 'type': 'function' }])
let status = statusContract.at('0x60dd15dec1732d6c8a6125b21f77d039821e5b93')

let Uport = require('../index.js')
let uport = new Uport('Simple example')

let uportProvider = uport.getUportProvider()
web3.setProvider(uportProvider)

web3.eth.getCoinbase(function (err, address) {
  if (err) { throw err }
  web3.eth.defaultAccount = address
  status.updateStatus('lalalalla', function (e, r) {
    waitForMined(r, { blockNumber: null })
  })
})

let waitForMined = function (txHash, res) {
  if (res.blockNumber) {
    status.getStatus.call(web3.eth.defaultAccount, function (e, r) { console.log('hey') })
  } else {
    web3.eth.getTransaction(txHash, function (e, r) {
      if (e) { throw e }
      waitForMined(txHash, r)
    })
  }
}
