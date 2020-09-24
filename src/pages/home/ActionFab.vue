<template>
  <q-btn-group push class="action-fab">
    <q-btn push @click="$emit('unmuteVideo')">開啟視訊</q-btn>
    <q-btn push @click="$emit('muteVideo')">關閉視訊</q-btn>
    <q-btn push @click="$emit('unmuteAudio')">開啟聲音</q-btn>
    <q-btn push @click="$emit('muteAudio')">關閉聲音</q-btn>
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
  name: 'action-fab'
}
</script>
