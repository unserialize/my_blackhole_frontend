<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ConnectedWallet, TonConnectUI } from '@tonconnect/ui';
import MyBlackholeContractInfo from './components/MyBlackholeContractInfo.vue';
import MyBlackholeContractActions from './components/MyBlackholeContractActions.vue';
import { Address, OpenedContract } from 'ton-core';
import { MyBlackholeContract } from './contracts/MyBlackholeContract.ts';
import { TonClient } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { SenderImplViaTonConnect } from './SenderImplViaTonConnect.ts';

let tonClient: TonClient | undefined = undefined

const contractAddress = ref("EQD4Nu_attpQdAHKaSOKSUwAfpJUrXIstF5yGqZvYr-RJT6e")
const openedContract = ref<OpenedContract<MyBlackholeContract>>()
const walletAddress = ref<Address>()
const sender = ref<SenderImplViaTonConnect>()

async function createMyBlackholeContract(contractAddress: string): Promise<OpenedContract<MyBlackholeContract>> {
  tonClient = new TonClient({
    endpoint: await getHttpEndpoint({ network: 'testnet' }),
  })

  return tonClient.open(MyBlackholeContract.createFromAddress(Address.parse(contractAddress)))
}

onMounted(async () => {
  const tonConnect = new TonConnectUI({
    manifestUrl: 'https://unserialize.github.io/my_blackhole_frontend/ton-manifest.json',
    buttonRootId: 'tonConnectUIButton',
  });
  tonConnect.onStatusChange(async (wallet: ConnectedWallet | null) => {
    walletAddress.value = wallet !== null
        ? Address.parse(wallet.account.address)
        : undefined
    openedContract.value = wallet !== null
        ? await createMyBlackholeContract(contractAddress.value)
        : undefined
    sender.value = wallet !== null
        ? new SenderImplViaTonConnect(tonConnect)
        : undefined
  })
})
</script>

<template>
  <div>
    <div id="tonConnectUIButton"></div>
    <MyBlackholeContractInfo v-if="openedContract && contractAddress && walletAddress"
        :contract_address="contractAddress" :opened_contract="openedContract" :connected_wallet_address="walletAddress" />
    <MyBlackholeContractActions v-if="openedContract && contractAddress && sender"
        :contract_address="contractAddress" :opened_contract="openedContract" :sender="sender" />
  </div>
</template>

