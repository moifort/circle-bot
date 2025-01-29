import type { Firestore } from 'firebase-admin/firestore'
import { genericDataConverter } from '../../utils/firestore'
import type { Audit } from '../index.type'

export namespace AuditRepository {
  export const save = (db: Firestore) => async (audit: Audit) => {
    await collection(db).doc(audit.id).set(audit)
  }

  const collection = (db: Firestore) => db.collection('bot-audit').withConverter(genericDataConverter<Audit>())
}
