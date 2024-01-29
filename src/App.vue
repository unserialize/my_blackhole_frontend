<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ConnectedWallet, TonConnectUI } from '@tonconnect/ui';
import MyBlackholeContractInfo from './components/MyBlackholeContractInfo.vue';

const walletConnected = ref(false)
const contractAddress = ref("EQD4Nu_attpQdAHKaSOKSUwAfpJUrXIstF5yGqZvYr-RJT6e")

onMounted(async () => {
  const tonConnect = new TonConnectUI({
    manifestUrl: 'https://unserialize.github.io/my_blackhole_frontend/ton-manifest.json',
    buttonRootId: 'tonConnectUIButton',
  });
  tonConnect.onStatusChange((wallet: ConnectedWallet | null) => {
    walletConnected.value = wallet !== null
  })
})
</script>

<template>
  <div>
    <div id="tonConnectUIButton"></div>
    <MyBlackholeContractInfo v-if="walletConnected" :contract_address=contractAddress />
  </div>
</template>

