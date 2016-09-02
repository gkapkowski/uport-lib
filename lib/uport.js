import UportSubprovider from './uportsubprovider'
import MsgServer from './msgServer'

import isMobile from 'is-mobile'
import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'

import QRDisplay from '../utils/qrdisplay'

const CHASQUI_URL = 'https://chasqui.uport.me/'
const INFURA_CONSENSYSNET = 'https://consensysnet.infura.io:8545'

class Uport {

  constructor (dappName, qrDisplay, chasquiUrl) {
    this.dappName = dappName
    this.qrdisplay = qrDisplay || new QRDisplay()
    this.isOnMobile = isMobile(navigator.userAgent)
    this.subprovider = this.createUportSubprovider(chasquiUrl)
  }

  getUportProvider (rpcUrl) {
    let engine = new ProviderEngine()

    engine.addProvider(this.subprovider)

    // default url for now
    if (!rpcUrl) rpcUrl = INFURA_CONSENSYSNET

    // data source
    let rpcSubprovider = new RpcSubprovider({rpcUrl: rpcUrl})
    engine.addProvider(rpcSubprovider)

    // start polling
    engine.start()
    engine.stop()
    return engine
  }

  getUportSubprovider () {
    return this.subprovider
  }

  createUportSubprovider (chasquiUrl) {
    const self = this

    if (!chasquiUrl) chasquiUrl = CHASQUI_URL

    let opts = {
      msgServer: new MsgServer(chasquiUrl, self.isOnMobile),
      uportConnectHandler: self.handleURI.bind(self),
      ethUriHandler: self.handleURI.bind(self),
      closeQR: self.qrdisplay.closeQr.bind(self.qrdisplay)
    }
    return new UportSubprovider(opts)
  }

  handleURI (uri) {
    const self = this
    uri += '&label=' + encodeURI(self.dappName)
    if (self.isOnMobile) {
      window.location.assign(uri)
    } else {
      self.qrdisplay.openQr(uri)
    }
  }
}

export default Uport
