<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn color="secondary" @click="join" v-if="!disableJoin">加入视频</q-btn>
      <q-btn
        v-if="disableJoin"
        icon="phone"
        stack glossy
        color="purple"
        @click="leave"
      >
        離開视频
      </q-btn>
    </div>
    <div v-if="disableJoin" class="q-gutter-md">
      <action-fab
        @unmuteVideo="unmuteVideo"
        @muteVideo="muteVideo"
        @unmuteAudio="unmuteAudio"
        @muteAudio="muteAudio"
      />
    </div>
    <div class="agora-view">
      <div class="agora-video">
        <stream-player :stream="localStream" :domId="localStream.getId()" v-if="localStream" />
      </div>
      <div class="agora-video" :key="index" v-for="(remoteStream, index) in remoteStreams">
        <stream-player :stream="remoteStream" :domId="remoteStream.getId()" />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.agora-view {
  display: flex;
  flex-wrap: wrap;
  margin: 20px;
}
.agora-video {
  width: 320px;
  height: 240px;
  margin: 20px;
}
</style>

<script>
import RTCClient from './RTCClient'

import ActionFab from './ActionFab'
import StreamPlayer from './StreamPlayer'

export default {
  name: 'PageHome',
  components: {
    ActionFab,
    StreamPlayer
  },
  data () {
    return {
      isShowActionFab: true,
      disableJoin: false,
      rtc: null,
      localStream: null,
      remoteStreams: []
    }
  },
  created () {
    this.rtc = new RTCClient()
    this.rtc.on('stream-added', (evt) => {
      const { stream } = evt
      console.log('[agora] [stream-added] stream-added', stream.getId())
      this.rtc.client.subscribe(stream)
    })
    this.rtc.on('stream-subscribed', (evt) => {
      const { stream } = evt
      console.log('[agora] [stream-subscribed] stream-added', stream.getId())
      if (!this.remoteStreams.find((it) => it.getId() === stream.getId())) {
        this.remoteStreams.push(stream)
      }
    })
    this.rtc.on('stream-removed', (evt) => {
      const { stream } = evt
      console.log('[agora] [stream-removed] stream-removed', stream.getId())
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== stream.getId())
    })
    this.rtc.on('peer-online', (evt) => {
      console.log(`Peer ${evt.uid} is online`)
    })
    this.rtc.on('peer-leave', (evt) => {
      console.log(`Peer ${evt.uid} already leave`)
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== evt.uid)
    })
  },
  methods: {
    async join () {
      try {
        // 加入频道
        await this.rtc.joinChannel()
        // 发布本地流
        const localStream = await this.rtc.publishStream()
        this.localStream = localStream
        this.disableJoin = true
      } catch (error) {
        console.log(error)
      }
    },
    async leave () {
      this.disableJoin = false
      try {
        await this.rtc.leaveChannel()
        console.log('Leave Success')
      } catch (error) {
        console.log('Leave Failure')
        console.log(error)
      }
      this.localStream = null
      this.remoteStreams = []
    },
    async unmuteVideo () {
      try {
        await this.localStream.unmuteVideo()
        console.log('unmute success')
      } catch (error) {
        console.log('unmute error')
      }
    },
    async muteVideo () {
      try {
        await this.localStream.muteVideo()
        console.log('mute Video success')
      } catch (error) {
        console.log('mute Video error')
      }
    },
    async unmuteAudio () {
      try {
        await this.localStream.unmuteAudio()
        console.log('unmute Audio success')
      } catch (error) {
        console.log('unmute Audio error')
      }
    },
    async muteAudio () {
      try {
        await this.localStream.muteAudio()
        console.log('mute Audio success')
      } catch (error) {
        console.log('mute Audio error')
      }
    }
  }
}
</script>
