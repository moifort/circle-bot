import { describe, expect, it } from 'bun:test'
import { Amount } from '../utils/index.validator'
import { TransactionDescription, WalletId } from './index.validator'
import { Wallet } from './query'

describe('Wallet', () => {
  it('should make transaction', async () => {
    // Given
    await Wallet.deposit(WalletId('wallet-id'))(Amount(100), TransactionDescription('Initial deposit'))
    await Wallet.withdraw(WalletId('wallet-id'))(Amount(10), TransactionDescription('Supermarket'))

    // When
    const balance = await Wallet.balance(WalletId('wallet-id'))()

    // Then
    expect(balance).toEqual(Amount(90))
    expect(await Wallet.history(WalletId('wallet-id'))()).toHaveLength(2)
  })

  it('should have insufficient funds when withdrawal greater than balance', async () => {
    // Given
    await Wallet.deposit(WalletId('wallet-id'))(Amount(10), TransactionDescription('Initial deposit'))

    // When
    const result = await Wallet.withdraw(WalletId('wallet-id'))(Amount(100), TransactionDescription('Big purchase'))

    // Then
    expect(result.isError()).toBe(true)
    expect(result.error).toEqual('insufficient-funds')
    expect(await Wallet.history(WalletId('wallet-id'))()).toHaveLength(1)
  })
})
