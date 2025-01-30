import type { Firestore } from 'firebase-admin/firestore'
import { genericDataConverter } from '../../utils/firestore'
import type { PartialEntity } from '../../utils/index.type'
import type { PlacedBet, PlacedBetId, PlacedBetStatus } from '../index.type'

export namespace PlacedBetRepository {
  export const save = (db: Firestore) => async (placedBet: PlacedBet) => update(db)(placedBet)
  export const update = (db: Firestore) => async (placedBet: PartialEntity<PlacedBet>) => {
    await collection(db).doc(placedBet.id).set(placedBet, { merge: true })
  }

  export const findAll = (db: Firestore) => async (filterBy?: PlacedBetStatus) => {
    let query = collection(db).orderBy('placedAt', 'asc')
    if (filterBy) query = query.where('status', '==', filterBy)
    const data = await query.get()
    return data.docs.map((doc) => doc.data())
  }

  export const exist = (db: Firestore) => async (id: PlacedBetId) => {
    const data = await collection(db).doc(id).get()
    return data.exists
  }

  const collection = (db: Firestore) =>
    db.collection('bettor-placed-bets').withConverter(genericDataConverter<PlacedBet>())
}
