import WebApp from '@twa-dev/sdk'

export function isInsideTelegram(): boolean {
  return WebApp.initData !== ''
}
