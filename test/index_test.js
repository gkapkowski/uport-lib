import { assert } from 'chai'
import Web3 from 'web3'
import Uport from '../lib/index.js'
import Autosigner from '../util/autosigner.js'

let rpcUrl = 'http://localhost:8545'
let web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

// create random address
let chars = '0123456789abcdef'
let addr1 = '0x'
for (let i = 40; i > 0; --i) addr1 += chars[Math.floor(Math.random() * chars.length)]
let autosinger
let status

describe('uport-lib integration tests', function () {
  this.timeout(10000)

  before((done) => {
    global.navigator = {}

    // Create Autosigner
    Autosigner.load(rpcUrl, (err, as) => {
      if (err) { throw err }
      autosinger = as

      web3.eth.getAccounts((err, accounts) => {
        if (err) { throw err }

        // Create status contract
        let statusContractABI = web3.eth.contract([
          {
            'constant': false,
            'inputs': [
              {
                'name': 'status',
                'type': 'string'
              }
            ],
            'name': 'updateStatus',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'getStatus',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          }
        ])

        status = statusContractABI.new({
          data: '0x6060604052610253806100126000396000f3606060' +
                '405260e060020a60003504632c215998811461002657' +
                '806330ccebb5146100ed575b005b6020600480358082' +
                '0135601f810184900490930260809081016040526060' +
                '84815261002494602493919291840191819083828082' +
                '8437509496505050505050503373ffffffffffffffff' +
                'ffffffffffffffffffffffff16600090815260208181' +
                '52604082208351815482855293839020919360026001' +
                '821615610100026000190190911604601f9081019390' +
                '93048201929091906080908390106101e857805160ff' +
                '19168380011785555b506101e39291505b8082111561' +
                '021857600081556001016100d9565b61017560043560' +
                '00606081815273ffffffffffffffffffffffffffffff' +
                'ffffffffff8316825260208281526040928390208054' +
                '60a0601f600260001961010060018616150201909316' +
                '92909204918201849004909302830190945260808481' +
                '5292939091828280156102475780601f1061021c5761' +
                '0100808354040283529160200191610247565b604051' +
                '80806020018281038252838181518152602001915080' +
                '519060200190808383829060006004602084601f0104' +
                '600f02600301f150905090810190601f1680156101d5' +
                '5780820380516001836020036101000a031916815260' +
                '200191505b509250505060405180910390f35b505050' +
                '565b828001600101855582156100d1579182015b8281' +
                '11156100d15782518260005055916020019190600101' +
                '906101fa565b5090565b820191906000526020600020' +
                '905b81548152906001019060200180831161022a5782' +
                '9003601f168201915b5050505050905091905056',
          from: accounts[0]
        })

        // Send ether to Autosigner
        web3.eth.sendTransaction({from: accounts[0], to: autosinger.address, value: web3.toWei(1000)}, () => {
          // Change provider
          // Autosigner is a qrDisplay that automatically signs transactions
          let uport = new Uport('Integration Tests', autosinger)
          let uportProvider = uport.getUportProvider(rpcUrl)

          web3.setProvider(uportProvider)
          done()
        })
      })
    })
  })

  it('getCoinbase', (done) => {
    web3.eth.getCoinbase((err, address) => {
      if (err) { throw err }
      assert.equal(address, autosinger.address)
      // set the default account
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
    var coolStatus = 'Writing some tests!'
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
