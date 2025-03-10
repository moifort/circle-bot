import type { Firestore } from 'firebase-admin/firestore'
import { genericDataConverter } from '../../utils/firestore'
import type { Transaction, WalletId } from '../index.type'

export namespace TransactionRepository {
  export const save = (db: Firestore) => async (transaction: Transaction) => {
    await collection(db).doc(transaction.id).set(transaction)
  }

  export const findAll = (db: Firestore, walletId: WalletId) => async () => {
    const data = await collection(db).orderBy('createdAt', 'asc').where('walletId', '==', walletId).get()
    return data.docs.map((doc) => doc.data())
  }

  const collection = (db: Firestore) =>
    db.collection('wallet-transactions').withConverter(genericDataConverter<Transaction>())
}
