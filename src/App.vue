<script setup lang="ts">
import { onMounted } from 'vue';
import { TonConnectUI } from '@tonconnect/ui';

onMounted(() => {
  new TonConnectUI({
    manifestUrl: 'https://unserialize.github.io/my_blackhole_frontend/ton-manifest.json',
    buttonRootId: 'tonConnectUIButton',
  });
})
</script>

<template>
  <div>
    <div id="tonConnectUIButton"></div>
  </div>
</template>

