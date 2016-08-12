const UportSubprovider = require('./lib/uportsubprovider.js');
const MsgServer = require('./lib/msgServer.js');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');
const Persona = require('uport-persona');
const QRDisplay = require('./util/qrdisplay.js');
const isMobile = require('is-mobile');
const ipfs = require('ipfs-js');

const CHASQUI_URL = 'https://chasqui.uport.me/';

// these are consensysnet constants, replace with mainnet before release!
const INFURA_CONSENSYSNET = 'https://consensysnet.infura.io:8545';
const UPORT_REGISTRY_ADDRESS = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c';

module.exports = Uport;

function Uport(dappName, qrDisplay, chasquiUrl) {
  this.dappName = dappName;
  this.qrdisplay = qrDisplay ? qrDisplay : new QRDisplay();
  this.isOnMobile = isMobile(navigator.userAgent);
  this.msgServer = new MsgServer(chasquiUrl, this.isOnMobile);
  this.subprovider = this.createUportSubprovider(chasquiUrl);
}

Uport.prototype.setProviders = function(ipfsProvider, web3Provider) {
  if (ipfsProvider) {
    this.ipfsProvider = ipfsProvider;
    ipfs.setProvider(this.ipfsProvider);
  }
  if (web3Provider) {
    this.web3Provider = web3Provider;
  }
}

Uport.prototype.getUportProvider = function(rpcUrl) {
  this.web3Provider = new ProviderEngine();

  this.web3Provider.addProvider(this.subprovider);

  // default url for now
  if (!rpcUrl) rpcUrl = INFURA_CONSENSYSNET;
  // data source
  let rpcSubprovider = new RpcSubprovider({
    rpcUrl: rpcUrl
  });
  this.web3Provider.addProvider(rpcSubprovider);

  // start polling
  this.web3Provider.start();
  return this.web3Provider;
}

Uport.prototype.getUportSubprovider = function() {
    return self.subprovider;
}

Uport.prototype.createUportSubprovider = function(chasquiUrl) {
  let self = this

  if (!chasquiUrl) chasquiUrl = CHASQUI_URL;

  var opts = {
    msgServer: self.msgServer,
    uportConnectHandler: self.handleURI.bind(self),
    ethUriHandler: self.handleURI.bind(self),
    closeQR: self.qrdisplay.closeQr.bind(self.qrdisplay)
  };
  return new UportSubprovider(opts);
}

Uport.prototype.handleURI = function(uri) {
  let self = this;
  uri += "&label=" + encodeURI(self.dappName);
  if (self.isOnMobile) {
    location.assign(uri);
  } else {
    self.qrdisplay.openQr(uri);
  }
}

Uport.prototype.getMyPersona = function() {
  let self = this;
  if (!self.ipfsProvider) throw new Error("ipfsProvider not set");
  if (!self.web3Provider) throw new Error("web3Provider not set");
  return new Promise((accept, reject) => {
    self.subprovider.getAddress((err, address) => {
      if (err) { reject(err); }
      // TODO - user should be able to specify registry address
      let persona = new Persona(address, UPORT_REGISTRY_ADDRESS);
      persona.setProviders(self.ipfsProvider, self.web3Provider);
      persona = this._replaceMutabilityInPersona(persona);
      persona.load().then(() => { accept(persona) });
    });
  });
}

Uport.prototype._replaceMutabilityInPersona = function(persona) {
  let self = this;
  // we don't really need to implement setProfile
  persona.setProfile = () => {}
  persona.addClaims = (claims) => {
    self._pushPersonaEdit(true, true, claims);
  }
  persona.addClaim = (claim) => { persona.addClaims([claim]) }
  persona.addAttribute = (attribute) => {
    self._pushPersonaEdit(true, false, [attribute]);
  }
  // will probably rename delete to remove in uport-persona in the future
  persona.deleteAttribute = (attribute) => {
    self._pushPersonaEdit(false, false, [attribute]);
  }
  persona.replaceAttribute = (attributeName) => {
    throw new Error("Not implement yet");
  }
  return persona;
}

Uport.prototype._pushPersonaEdit = function(isAdd, isClaim, list) {
  let self = this;
  return self._createUpdateObject(isAdd, isClaim, list)
    .then((err, ipfsHash) => {
      self._pushToMobile(ipfsHash);
    });
}

Uport.prototype._createUpdateObject = function(isAdd, isClaim, list) {
  let self = this;
  return new Promise((accept, reject) => {
    let addOrRemove = isAdd ? "add" : "remove";
    let claimOrAttr = isClaim ? "claims" : "attributes";
    let obj = {};
    obj[addOrRemove] = {};
    obj[addOrRemove][claimOrAttr] = list;
    // add to ipfs
    ipfs.addJson(obj, (err, ipfsHash) => {
      if (err) {
        reject(err);
      } else {
        accept(ipfsHash);
      }
    });
  });
}

Uport.prototype._pushToMobile = function(hash) {
  let self = this;
  return new Promise((accept, reject) => {
    // we use the tx topic for now
    let topic = self.msgServer.newTopic('tx');
    let uri = "me.uport:claim?data=" + hash;
    self.handleURI(uri);
    self.msgServer.waitForResult(topic, (err, tx) => {
        self.qrdisplay.closeQr();
        if (err) {
          reject(err);
        } else {
          accept(tx);
        }
    });
  });
}
