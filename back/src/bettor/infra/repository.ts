import type { Firestore } from 'firebase-admin/firestore'
import { genericDataConverter } from '../../utils/firestore'
import type { PlacedBet } from '../index.type'

export namespace PlacedBetRepository {
  export const save = (db: Firestore) => async (placedBet: PlacedBet) => {
    await collection(db).doc(placedBet.id).set(placedBet)
  }

  export const findAll = (db: Firestore) => async () => {
    const data = await collection(db).orderBy('placedAt', 'asc').get()
    return data.docs.map((doc) => doc.data())
  }

  const collection = (db: Firestore) =>
    db.collection('bettor-placed-bets').withConverter(genericDataConverter<PlacedBet>())
}
