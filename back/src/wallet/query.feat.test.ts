import { describe, expect, it } from 'bun:test'
import { Amount } from '../utils/index.validator'
import { TransactionDescription } from './index.validator'
import { Wallet } from './query'

// biome-ignore lint/suspicious/noFocusedTests: <explanation>
describe.only('Wallet', () => {
  it('should make transaction', async () => {
    // Given
    await Wallet.deposit(Amount(100), TransactionDescription('Initial deposit'))
    await Wallet.withdraw(Amount(10), TransactionDescription('Supermarket'))

    // When
    const balance = await Wallet.balance()

    // Then
    expect(balance).toEqual(Amount(90))
    expect(await Wallet.history()).toHaveLength(2)
  })

  it('should have insufficient funds when withdrawal greater than balance', async () => {
    // Given
    await Wallet.deposit(Amount(10), TransactionDescription('Initial deposit'))

    // When
    const result = await Wallet.withdraw(Amount(100), TransactionDescription('Big purchase'))

    // Then
    expect(result.isError()).toBe(true)
    expect(result.error).toEqual('insufficient-funds')
    expect(await Wallet.history()).toHaveLength(1)
  })
})
