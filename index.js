const UportSubprovider = require('./lib/uportsubprovider.js');
const MsgServer = require('./lib/msgServer.js');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');
const QRDisplay = require('./util/qrdisplay.js');
const isMobile = require('is-mobile');

const CHASQUI_URL = 'https://chasqui.uport.me/';
// these are consensysnet constants, replace with mainnet before release!
const INFURA_CONSENSYSNET = 'https://consensysnet.infura.io:8545';
const UPORT_REGISTRY_ADDRESS = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c';

module.exports = Uport;

function Uport(dappName, opts) {
  this.dappName = dappName;
  this.qrdisplay = opts.qrDisplay || new QRDisplay()
  this.uportRegistryAddress = opts.registryAddress || UPORT_REGISTRY_ADDRESS
  this.ipfsProvider = opts.ipfsProvider
  this.isOnMobile = isMobile(navigator.userAgent);
  const chasquiUrl = opts.chasquiUrl || CHASQUI_URL
  this.msgServer = new MsgServer(chasquiUrl, this.isOnMobile)
  this.subprovider = this.createUportSubprovider();
}

Uport.prototype.getUportProvider = function(rpcUrl) {
  this.web3Provider = new ProviderEngine();
  this.web3Provider.addProvider(this.subprovider);

  // data source
  var rpcSubprovider = new RpcSubprovider({
    rpcUrl: rpcUrl || INFURA_CONSENSYSNET
  });
  this.web3Provider.addProvider(rpcSubprovider);

  // start polling
  this.web3Provider.start();
  this.web3Provider.stop();
  return this.web3Provider;
}

Uport.prototype.getUportSubprovider = function() {
    return self.subprovider;
}

Uport.prototype.createUportSubprovider = function(chasquiUrl) {
  const self = this
  var opts = {
    msgServer: self.msgServer,
    uportConnectHandler: self.handleURI.bind(self),
    ethUriHandler: self.handleURI.bind(self),
    closeQR: self.qrdisplay.closeQr.bind(self.qrdisplay)
  };
  return new UportSubprovider(opts);
}

Uport.prototype.handleURI = function(uri) {
  const self = this;
  uri += "&label=" + encodeURI(self.dappName);
  if (self.isOnMobile) {
    location.assign(uri);
  } else {
    self.qrdisplay.openQr(uri);
  }
}

Uport.prototype.setProviders = function(ipfsProvider, web3Provider) {
  if (ipfsProvider) {
    this.ipfsProvider = ipfsProvider;
  }
  if (web3Provider) {
    if (self.web3Provider) {
      throw new Error("Web3 provider already set.")
    } else {
      this.web3Provider = web3Provider;
    }
  }
}

Uport.prototype.getUserPersona = function() {
  const self = this;
  if (!self.ipfsProvider) throw new Error("ipfs not set");
  if (!self.web3Provider) throw new Error("web3Provider not set");
  return new Promise((accept, reject) => {
    self.subprovider.getAddress((err, address) => {
      if (err) { reject(err); }
      // TODO - user should be able to specify registry address
      let persona = new MutablePersona(address, self.ipfsProvider, self.web3Provider, self.uportRegistryAddress);
      //let persona = new RemoteMutablePersona(address, self.ipfsProvider, self.web3Provider,
                                             //self.handleURI, self.msgServer, self.uportRegistryAddress);
      persona.load().then(() => { accept(persona) });
    });
  });
}
