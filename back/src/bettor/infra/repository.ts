import type { Firestore } from 'firebase-admin/firestore'
import { genericDataConverter } from '../../utils/firestore'
import type { PartialEntity } from '../../utils/index.type'
import type { BettorId, PlacedBet, PlacedBetId, PlacedBetStatus, PlacedBets } from '../index.type'

export namespace PlacedBetRepository {
  export const save = (db: Firestore) => async (pendingBet: PlacedBet) => update(db)(pendingBet)

  export const update = (db: Firestore) => async (pendingBet: PartialEntity<PlacedBet>) => {
    await collection(db).doc(pendingBet.id).set(pendingBet, { merge: true })
  }

  export const findAll =
    (db: Firestore, bettorId: BettorId) =>
    async <STATUS extends PlacedBetStatus | 'no-filter'>(filterBy: STATUS): Promise<PlacedBets<STATUS>> => {
      let query = collection(db).orderBy('betEndAt', 'asc').where('bettorId', '==', bettorId)
      if (filterBy !== 'no-filter') query = query.where('status', '==', filterBy)
      const data = await query.get()
      return data.docs.map((doc) => doc.data()) as PlacedBets<STATUS>
    }

  export const exist = (db: Firestore, bettorId: BettorId) => async (id: PlacedBetId) => {
    const data = await collection(db).doc(id).get()
    return data.exists
  }

  const collection = (db: Firestore) =>
    db.collection('bettor-placed-bets').withConverter(genericDataConverter<PlacedBet>())
}
