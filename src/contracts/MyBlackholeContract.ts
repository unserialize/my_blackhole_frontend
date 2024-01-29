import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, TupleReader } from 'ton-core';

export type MyBlackholeContractRespFullState = {
    counter_value: number
    recent_inc_addr: Address | null
    recent_deposit_addr: Address | null
    owner_addr: Address
}

export type MyBlackholeContractRespBalance = number

export class MyBlackholeContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MyBlackholeContract(address);
    }

    async sendIncrement(provider: ContractProvider, sender: Sender, valueMoney: bigint, incBy: number) {
        let opcode = 1
        return await provider.internal(sender, {
            value: valueMoney,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(opcode, 32).storeUint(incBy, 32).endCell(),
        });
    }

    async sendDeposit(provider: ContractProvider, sender: Sender, valueMoney: bigint) {
        let opcode = 2
        return await provider.internal(sender, {
            value: valueMoney,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(opcode, 32).endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, sender: Sender, valueMoney: bigint, toWithdraw: bigint) {
        let opcode = 3
        return await provider.internal(sender, {
            value: valueMoney,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(opcode, 32).storeCoins(toWithdraw).endCell(),
        });
    }

    async sendPermanentlyDestroy(provider: ContractProvider, sender: Sender, valueMoney: bigint) {
        let opcode = 4
        return await provider.internal(sender, {
            value: valueMoney,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(opcode, 32).endCell(),
        });
    }

    async getFullState(provider: ContractProvider) {
        const { stack } = await provider.get("dump_full_state", []);
        return MyBlackholeContract.parseGetFullState(stack)
    }

    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get('show_balance', [])
        return MyBlackholeContract.parseGetBalance(stack)
    }

    static parseGetFullState(r: TupleReader): MyBlackholeContractRespFullState {
        return {
            counter_value: r.readNumber(),
            recent_inc_addr: r.readAddressOpt(),
            recent_deposit_addr: r.readAddressOpt(),
            owner_addr: r.readAddress(),
        };
    }

    static parseGetBalance(r: TupleReader): MyBlackholeContractRespBalance {
        return r.readNumber()       // in nanotons
    }
}
