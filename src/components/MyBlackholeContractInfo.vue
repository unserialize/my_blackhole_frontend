<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fromNano } from 'ton';
import { Address, OpenedContract } from 'ton-core';
import { MyBlackholeContract, MyBlackholeContractRespBalance, MyBlackholeContractRespFullState } from '../contracts/MyBlackholeContract';

const props = defineProps<{
  contract_address: string,
  connected_wallet_address: Address,
  opened_contract: OpenedContract<MyBlackholeContract>,
}>()

const balance = ref<MyBlackholeContractRespBalance>()
const fullState = ref<MyBlackholeContractRespFullState>()
const isConnectedWalletOwner = computed(() => fullState.value?.owner_addr.equals(props.connected_wallet_address))

let refreshUITimeout: number | undefined = undefined

function refreshUI() {
  const contract = props.opened_contract
  contract.getBalance().then(v => balance.value = v)
  contract.getFullState().then(v => fullState.value = v)

  refreshUITimeout = setTimeout(refreshUI, 5000)
}

onMounted(() => {
  refreshUI()
})
onUnmounted(() => {
  clearTimeout(refreshUITimeout)
})
</script>

<template>
  <table class="contract-state contract-state--important">
    <tr>
      <td><b>Contract</b></td>
      <td>{{ contract_address }}</td>
    </tr>
    <tr>
      <td><b>Balance</b></td>
      <td v-if="balance === undefined">Loading...</td>
      <td v-else>{{ fromNano(balance) }} TON</td>
    </tr>
  </table>

  <div v-if="fullState === undefined" class="loading">Loading full state...</div>
  <table v-if="fullState !== undefined" class="contract-state">
    <tr>
      <td><b>counter_value</b></td>
      <td>{{ fullState.counter_value }}</td>
    </tr>
    <tr>
      <td><b>recent_incr_addr</b></td>
      <td v-if="fullState.recent_inc_addr === null">-</td>
      <td v-else>{{ fullState.recent_inc_addr.toString() }}</td>
    </tr>
    <tr>
      <td><b>recent_deposit_addr</b></td>
      <td v-if="fullState.recent_deposit_addr === null">-</td>
      <td v-else>{{ fullState.recent_deposit_addr.toString() }}</td>
    </tr>
    <tr>
      <td><b>owner_addr</b></td>
      <td>
        {{ fullState.owner_addr.toString() }}
        <span v-if="isConnectedWalletOwner" class="label-i-am-owner">Logined as owner</span>
      </td>
    </tr>
  </table>
</template>

<style scoped>
table.contract-state {
  text-align: left;
}

table.contract-state--important td:first-child {
  color: silver;
}

@media (prefers-color-scheme: light) {
  table.contract-state--important td:first-child {
    color: #0000cc;
  }
}

@media (max-width: 600px) {
  table.contract-state td {
    display: table-row;
    vertical-align: top;
    word-break: break-all;
  }
}

.loading {
  opacity: 0.5;
}

.label-i-am-owner {
  color: #44cc55;
  font-weight: 600;
}
</style>
