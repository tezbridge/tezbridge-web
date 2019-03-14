// @flow

declare var RTCPeerConnection
declare var RTCSessionDescription
declare var RTCIceCandidate
declare var RTCIceCandidate

export class Connection {
  conn : RTCPeerConnection
  channel : any
  my_ice_candidates : Set<Object>
  offer : Object
  answer : Object
  
  prepared : Promise<void>
  connected : Promise<void>

  constructor(conn_info? : string) {
    this.prepared = Promise.resolve()

    if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
      alert('For remote signer connection\nmicrophone premission needs to be allowed\nit will only be active for 1 second.')
      this.prepared = this.prepared.then(() => 
        navigator.mediaDevices 
          ? navigator.mediaDevices.getUserMedia({audio: true}).then(x => x.getAudioTracks()[0].stop())
          : Promise.resolve())
    }

    this.connected = new Promise<void>(connected_resolve => {
      this.prepared = this.prepared.then(() => new Promise<void>(prepared_resolve => {
        this._constructor(conn_info, prepared_resolve, connected_resolve)
      }))
    })
  }

  _constructor(conn_info? : string, prepared_resolve : void => void, connected_resolve : void => void) {
    this.my_ice_candidates = new Set()

    this.conn = new RTCPeerConnection()

    this.conn.onicecandidate = e => {
      if (e.candidate) {
        this.my_ice_candidates.add(e.candidate)
        prepared_resolve()
      }
    }
    if (conn_info) {

      this.setRemoteConnInfo(conn_info)
      .then(() => this.conn.createAnswer())
      .then(answer => {
        this.answer = answer
        return this.conn.setLocalDescription(answer)
      })

      this.conn.ondatachannel = e => {
        this.channel = e.channel

        e.channel.onmessage = event => {
          console.log(2, event)
        } 
        e.channel.onopen = event => {
          connected_resolve()
        } 
        e.channel.onclose = () => {} 
      }

    } else {

      this.channel = this.conn.createDataChannel('TezBridge-WebRTC-Connection')

      this.channel.onmessage = event => {
        console.log(1, event)
      } 
      this.channel.onopen = event => {
        connected_resolve()
      } 

      this.channel.onclose = () => {} 
      this.conn.createOffer()
      .then(offer => {
        this.offer = offer
        return this.conn.setLocalDescription(offer)
      })

    }
  }

  genMyInfo() {
    return JSON.stringify([this.offer || this.answer].concat([...this.my_ice_candidates]))
  }

  setRemoteConnInfo(other_info : string) {
    const [desc, ...ice_candidates] = JSON.parse(other_info)

    return this.conn.setRemoteDescription(new RTCSessionDescription(desc))
      .then(() => {
        ice_candidates.forEach(x => {
          x && this.conn.addIceCandidate(new RTCIceCandidate(x))
        })
      })
  }

  addIceCandidates(ice_candidates : Set<Object>) {
    ice_candidates.forEach(x => {
      x && this.conn.addIceCandidate(new RTCIceCandidate(x))
    })
  }

  setRemoteDescription(sdp : Object) {
    return this.conn.setRemoteDescription(new RTCSessionDescription(sdp))
  }

}