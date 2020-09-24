import AgoraRTC from 'agora-rtc-sdk'
import EventEmitter from 'events'

export default class RTCClient {
  constructor () {
    this.option = {
      appId: '33f746cfa9374dd090fbd8746f15e297',
      channel: 'test',
      uid: '',
      token: '00633f746cfa9374dd090fbd8746f15e297IACl/UmKG5HfWs8VOnlwhAedHqeNK41SRMIy502mRmG2mwx+f9gAAAAAEAAB6BGrM5ttXwEAAQAzm21f'
    }
    this.client = null
    this.localStream = null
    this._eventBus = new EventEmitter()
  }

  // init client and Join a channel
  joinChannel () {
    const option = this.option
    return new Promise((resolve, reject) => {
      this.client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      })
      this.client.init(option.appId, () => {
        this.clientListener()
        this.client.join(option.token ? option.token : null, option.channel, null, (uid) => {
          this.option.uid = uid
          console.log(
            `join channel: ${option.channel} success, uid: ${uid}`
          )
          resolve()
        }, (err) => {
          console.log(err)
          console.error('========== client join failed', err)
        })
      }, (err) => {
        reject(err)
        console.error(err)
      })
    })
  }

  leaveChannel () {
    return new Promise((resolve, reject) => {
      // Leave the channel
      this.client.unpublish(this.localStream, (err) => {
        console.log(err)
      })
      this.client.leave(() => {
        this.client = null
        resolve()
        console.log('client leaves channel success')
      }, (err) => {
        reject(err)
        console.log('channel leave failed')
        console.error(err)
      })
    })
  }

  publishStream () {
    return new Promise((resolve, reject) => {
      // Create a local stream
      this.localStream = AgoraRTC.createStream({
        streamID: this.option.uid,
        audio: true,
        video: true,
        screen: false
      })
      // Initialize the local stream
      this.localStream.init(() => {
        console.log('init local stream success')
        resolve(this.localStream)
        // Publish the local stream
        this.client.publish(this.localStream, (err) => {
          console.log('publish failed')
          console.error(err)
        })
      }, (err) => {
        console.log('init local stream failed ', err)
        reject(err)
      })
    })
  }

  clientListener () {
    const client = this.client

    // 当有远端流加入时订阅该流
    client.on('stream-added', (evt) => {
      // The stream is added to the channel but not locally subscribed
      this._eventBus.emit('stream-added', evt)
    })
    client.on('stream-subscribed', (evt) => {
      this._eventBus.emit('stream-subscribed', evt)
    })
    client.on('stream-removed', (evt) => {
      this._eventBus.emit('stream-removed', evt)
    })
    client.on('peer-online', (evt) => {
      this._eventBus.emit('peer-online', evt)
    })
    client.on('peer-leave', (evt) => {
      this._eventBus.emit('peer-leave', evt)
    })
  }

  on (eventName, callback) {
    this._eventBus.on(eventName, callback)
  }
}
