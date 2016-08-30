import request from 'request'
import qs from 'qs'
import randomString from '../utils/randomString'

function MsgServer (chasquiUrl, isOnMobile) {
  this.chasquiUrl = chasquiUrl
  this.intervalIds = {}
  this.isOnMobile = isOnMobile
}

MsgServer.prototype.newTopic = function (topicName) {
  var topic = {
    name: topicName,
    id: randomString(16)
  }
  if (this.isOnMobile) {
    topic.url = window.location.href
  } else {
    topic.url = this.chasquiUrl
    if (topicName === 'address') {
      // address url differs from topic
      topic.url += 'addr/' + topic.id
    } else {
      topic.url += topicName + '/' + topic.id
    }
  }
  return topic
}

MsgServer.prototype.waitForResult = function (topic, cb) {
  if (this.isOnMobile) {
    this.waitForHashChange(topic, cb)
  } else {
    this.pollForResult(topic, cb)
  }
}
MsgServer.prototype.waitForHashChange = function (topic, cb) {
  window.onhashchange = function () {
    if (window.location.hash) {
      var params = qs.parse(window.location.hash.slice(1))
      if (params[topic.name]) {
        window.onhashchange = function () {}
        cb(null, params[topic.name])
      } else {
        if (params.error) {
          window.onhashchange = function () {}
          cb(params.error)
        }
      }
    }
  }
}

MsgServer.prototype.pollForResult = function (topic, cb) {
  const self = this

  self.intervalIds[topic.id] = setInterval(
    function () {
      request(topic.url, function (err, response, body) {
        if (err) return cb(err)
        // parse response into raw account
        var data
        try {
          data = JSON.parse(body)
          if (data.error) {
            clearInterval(self.intervalIds[topic.id])
            return cb(data.error)
          }
        } catch (err) {
          console.error(err.stack)
          clearInterval(self.intervalIds[topic.id])
          return cb(err)
        }
        // Check for param, stop polling and callback if present
        if (data[topic.name]) {
          clearInterval(self.intervalIds[topic.id])
          self.intervalIds[topic.id] = null
          self.clearTopic(topic.url)
          return cb(null, data[topic.name])
        }
      })
    }, 2000)
}

MsgServer.prototype.clearTopic = function (url) { request.del(url) }

export default MsgServer
