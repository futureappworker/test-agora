<template>
  <q-btn-group push class="action-fab">
    <q-btn v-show="videoMuteState === '1'" push @click="$emit('unmuteVideo')">開啟視訊</q-btn>
    <q-btn v-show="videoMuteState === '0'" push @click="$emit('muteVideo')">關閉視訊</q-btn>
    <q-btn v-show="audioMuteState === '1'" push @click="$emit('unmuteAudio')">開啟聲音</q-btn>
    <q-btn v-show="audioMuteState === '0'" push @click="$emit('muteAudio')">關閉聲音</q-btn>
  </q-btn-group>
</template>

<style lang="scss" scoped>
.action-fab {
  position: fixed;
  top: 50px;
  right: 50px;
}
</style>

<script>
export default {
  name: 'action-fab',
  props: {
    videoMuteState: {
      type: String
    },
    audioMuteState: {
      type: String
    }
  }
}
</script>
