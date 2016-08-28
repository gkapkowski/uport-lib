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

function Uport(dappName, qrDisplay, chasquiUrl) {
  this.dappName = dappName;
  this.qrdisplay = qrDisplay ? qrDisplay : new QRDisplay();
  this.isOnMobile = isMobile(navigator.userAgent);
  this.subprovider = this.createUportSubprovider(chasquiUrl);
}

Uport.prototype.getUportProvider = function(rpcUrl) {
  var engine = new ProviderEngine();

  engine.addProvider(this.subprovider);

  // default url for now
  if (!rpcUrl) rpcUrl = INFURA_CONSENSYSNET;
  // data source
  var rpcSubprovider = new RpcSubprovider({
    rpcUrl: rpcUrl
  });
  engine.addProvider(rpcSubprovider);

  // start polling
  engine.start();
  engine.stop();
  return engine;
}

Uport.prototype.getUportSubprovider = function() {
    return self.subprovider;
}

Uport.prototype.createUportSubprovider = function(chasquiUrl) {
  const self = this

  if (!chasquiUrl) chasquiUrl = CHASQUI_URL;

  var opts = {
    msgServer: new MsgServer(chasquiUrl, self.isOnMobile),
    uportConnectHandler: self.handleURI.bind(self),
    ethUriHandler: self.handleURI.bind(self),
    closeQR: self.qrdisplay.closeQr.bind(self.qrdisplay)
  };
  return new UportSubprovider(opts);
}

Uport.prototype.handleURI = function(uri) {
  self = this;
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
    this.web3Provider = web3Provider;
  }
}

Uport.prototype.getUserPersona = function() {
  let self = this;
  if (!self.ipfsProvider) throw new Error("ipfs not set");
  if (!self.web3Provider) throw new Error("web3Provider not set");
  return new Promise((accept, reject) => {
    self.subprovider.getAddress((err, address) => {
      if (err) { reject(err); }
      // TODO - user should be able to specify registry address
      let persona = new MutablePersona(address, self.ipfsProvider, web3Provider, UPORT_REGISTRY_ADDRESS);
      let persona = new RemoteMutablePersona(address, self.ipfsProvider, web3Provider,
                                             self.handleURI, self.msgServer, UPORT_REGISTRY_ADDRESS);
      persona.load().then(() => { accept(persona) });
    });
  });
}
