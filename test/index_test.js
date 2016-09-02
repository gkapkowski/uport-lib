import { assert } from 'chai'
import Web3 from 'web3'
import { Uport } from '../lib/index'
import Autosigner from '../utils/autosigner'
import startProviders from './providerUtil'

import testData from './testData.json'

// create random address
const chars = '0123456789abcdef'
let addr1 = '0x'

for (let i = 40; i > 0; --i) addr1 += chars[Math.floor(Math.random() * chars.length)]

describe('uport-lib integration tests', function () {
  this.timeout(30000)

  let autosinger, status, web3Provider, web3

  before((done) => {
    global.navigator = {}

    startProviders((err, provs) => {
      if (err) { throw err }
      web3Provider = provs.web3Provider
      web3 = new Web3(web3Provider)
      // Create Autosigner
      Autosigner.load(web3Provider, (err, as) => {
        if (err) { throw err }
        autosinger = as

        web3.eth.getAccounts((err, accounts) => {
          if (err) { throw err }

          // Create status contract
          let statusContractABI = web3.eth.contract(testData.statusContractAbiData)
          status = statusContractABI.new({
            data: testData.statusContractBin,
            from: accounts[0]
          }, () => {})
          // Send ether to Autosigner
          web3.eth.sendTransaction({from: accounts[0], to: autosinger.address, value: web3.toWei(90)}, (e, r) => {
            // Change provider
            // Autosigner is a qrDisplay
            // that automatically signs transactions
            let uport = new Uport('Integration Tests', { qrDisplay: autosinger })
            let uportProvider = uport.getUportProvider(web3Provider.host)

            web3.setProvider(uportProvider)
            done()
          })
        })
      })
    })
  })

  it('getCoinbase', (done) => {
    web3.eth.getCoinbase((err, address) => {
      if (err) { throw err }
      assert.equal(address, autosinger.address)
      web3.eth.defaultAccount = address
      done()
    })
  })

  it('getAccounts', (done) => {
    web3.eth.getAccounts((err, addressList) => {
      if (err) { throw err }
      assert.equal(addressList.length, 1, 'there should be just one address')
      assert.equal(addressList[0], autosinger.address)
      done()
    })
  })

  it('sendTransaction', (done) => {
    web3.eth.sendTransaction({value: web3.toWei(2), to: addr1}, (err, txHash) => {
      if (err) { throw err }
      web3.eth.getBalance(addr1, (err, balance) => {
        if (err) { throw err }
        assert.equal(balance.toNumber(), web3.toWei(2))
        done()
      })
    })
  })

  it('use contract', (done) => {
    let coolStatus = 'Writing some tests!'
    status.updateStatus(coolStatus, (err, res) => {
      assert.isNull(err)
      status.getStatus.call(web3.eth.defaultAccount, (err, myStatus) => {
        assert.isNull(err)
        assert.equal(myStatus, coolStatus)
        done()
      })
    })
  })
})
