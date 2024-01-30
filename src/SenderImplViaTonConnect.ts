import { Sender, SenderArguments } from 'ton-core';
import { TonConnectUI } from '@tonconnect/ui';

export class SenderImplViaTonConnect implements Sender {
  constructor(private tonConnect: TonConnectUI) {}

  async send(args: SenderArguments): Promise<void> {
    await this.tonConnect.sendTransaction({
      messages: [
        {
          address: args.to.toString(),
          amount: args.value.toString(),
          payload: args.body?.toBoc().toString('base64'),
        },
      ],
      validUntil: Date.now() + 60 * 1000, // 1 minute for user to approve
    });
  }
}
