<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fromNano, TonClient } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { Address, OpenedContract } from 'ton-core';
import { MyBlackholeContract, MyBlackholeContractRespBalance, MyBlackholeContractRespFullState } from '../contracts/MyBlackholeContract';

const props = defineProps<{
  contract_address: string
}>()

const balance = ref<MyBlackholeContractRespBalance>()
const fullState = ref<MyBlackholeContractRespFullState>()

async function createMyBlackholeContract(contractAddress: string): Promise<OpenedContract<MyBlackholeContract>> {
  const client = new TonClient({
    endpoint: await getHttpEndpoint({ network: 'testnet' }),
  })

  return client.open(MyBlackholeContract.createFromAddress(Address.parse(contractAddress)))
}

async function loadBalance(contract: OpenedContract<MyBlackholeContract>) {
  balance.value = await contract.getBalance()
}

async function loadFullState(contract: OpenedContract<MyBlackholeContract>) {
  fullState.value = await contract.getFullState()
}

onMounted(async () => {
  const contract = await createMyBlackholeContract(props.contract_address)
  await Promise.all([
    loadBalance(contract),
    loadFullState(contract),
  ])
})
</script>

<template>
  <table class="contract-state">
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
      <td>{{ fullState.owner_addr.toString() }}</td>
    </tr>
  </table>
</template>

<style scoped>
table.contract-state {
  text-align: left;
}

.loading {
  opacity: 0.5;
}
</style>
