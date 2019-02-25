// @flow

declare var RTCPeerConnection
declare var RTCSessionDescription
declare var RTCIceCandidate
declare var RTCIceCandidate

export class Connection {
  conn : RTCPeerConnection
  channel : any
  self_ice_candidates : Set<Object>
  offer : Object
  answer : Object
  
  ice_ready : Promise<void>
  channel_ready : Promise<void>

  constructor(conn_info? : string) {
    this.self_ice_candidates = new Set()

    this.conn = new RTCPeerConnection()
    
    if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
      alert('For remote signer connection\nmicrophone premission needs to be allowed\nit will only be active for 0.5 second.')
      if (navigator.mediaDevices)
        navigator.mediaDevices.getUserMedia({audio: true}).then(x => x.getAudioTracks()[0].stop())
    }

    this.ice_ready = new Promise<void>((resolve, rejcet) => {
      this.conn.onicecandidate = e => {
        if (e.candidate) {
          this.self_ice_candidates.add(e.candidate)
          setTimeout(() => {resolve()}, 500)
        }
      }
    })

    if (conn_info) {

      this.setRemoteConnInfo(conn_info)
      .then(() => this.conn.createAnswer())
      .then(answer => {
        this.answer = answer
        return this.conn.setLocalDescription(answer)
      })

      this.channel_ready = new Promise<void>((resolve, reject) => {
        this.conn.ondatachannel = e => {
          this.channel = e.channel

          e.channel.onmessage = event => {
            console.log(2, event)
          } 
          e.channel.onopen = event => {
            resolve()
          } 
          e.channel.onclose = () => {} 
        }
      })

    } else {

      this.channel = this.conn.createDataChannel('TezBridge-WebRTC-Connection')

      this.channel_ready = new Promise<void>((resolve, reject) => {
        this.channel.onmessage = event => {
          console.log(1, event)
        } 
        this.channel.onopen = event => {
          resolve()
        } 
        this.channel.onclose = () => {} 
      })  
      this.conn.createOffer()
      .then(offer => {
        this.offer = offer
        return this.conn.setLocalDescription(offer)
      })

    }
  }

  genMyInfo() {
    return JSON.stringify([this.offer || this.answer].concat([...this.self_ice_candidates]))
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
