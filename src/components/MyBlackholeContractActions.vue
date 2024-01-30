<script setup lang="ts">
import { OpenedContract, toNano } from 'ton-core';
import { MyBlackholeContract } from '../contracts/MyBlackholeContract';
import { SenderImplViaTonConnect } from '../SenderImplViaTonConnect';

const props = defineProps<{
  contract_address: string,
  opened_contract: OpenedContract<MyBlackholeContract>,
  sender: SenderImplViaTonConnect,
}>()

function sendIncrement(incrementBy: number) {
  const gas = toNano("0.05")
  props.opened_contract.sendIncrement(props.sender, gas, incrementBy)
}

function sendDeposit(depositTons: number) {
  props.opened_contract.sendDeposit(props.sender, toNano(depositTons))
}

function sendWithdraw(withdrawTons: number) {
  const gas = toNano("0.02")
  props.opened_contract.sendWithdraw(props.sender, gas, toNano(withdrawTons))
}
</script>

<template>
  <h3>Actions</h3>
  <div>
    <button @click="sendIncrement(2)">Increment by 2</button>
  </div>
  <div>
    <button @click="sendDeposit(1)">Deposit by 1 TON</button>
  </div>
  <div>
    <button @click="sendWithdraw(0.7)">Withdraw 0.7 TON (owner only)</button>
  </div>
</template>

<style scoped>

</style>
