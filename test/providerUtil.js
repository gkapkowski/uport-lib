import TestRPC from 'ethereumjs-testrpc'
import ipfsd from 'ipfsd-ctl'
import Web3 from 'web3'

const RPC_PORT = 8545

let web3Provider, ipfsProvider
let server

export default function startProviders (cb) {
  if (!web3Provider && !ipfsProvider && !server) {
    server = TestRPC.server()
    server.listen(RPC_PORT, (err, blockchain) => {
      if (err) {
        cb(err)
      }
      web3Provider = new Web3.providers.HttpProvider('http://localhost:' + RPC_PORT)
      ipfsd.disposableApi((err, ipfsDaemon) => {
        ipfsProvider = ipfsDaemon
        if (err) {
          cb(err)
        }
        cb(null, {web3Provider: web3Provider, ipfsProvider: ipfsProvider})
      })
    })
  } else {
    cb(null, {web3Provider: web3Provider, ipfsProvider: ipfsProvider})
  }
}
