import { describe, expect, it } from 'bun:test'
import { Amount } from '../utils/index.validator'
import { TransactionDescription } from './index.validator'
import { Wallet } from './query'

describe('Wallet', () => {
  it('should make transaction', async () => {
    // Given
    await Wallet.deposit(Amount(100), TransactionDescription('Initial deposit'))
    await Wallet.withdraw(Amount(10), TransactionDescription('Kebab land'))

    // When
    const transactions = await Wallet.history()
    const balance = await Wallet.balance()

    // Then
    expect(balance).toEqual(Amount(90))
    expect(transactions).toHaveLength(2)
  })
})
