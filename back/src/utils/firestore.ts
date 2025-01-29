import type { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore'

export const genericDataConverter = <Type extends DocumentData>(): FirestoreDataConverter<Type> => ({
  toFirestore: (data: Type) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => toDate(snapshot.data())! as Type,
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const toDate = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== null && typeof obj[k] === 'object') {
      if (obj[k].toDate) {
        obj[k] = obj[k].toDate()
        return
      }
      toDate(obj[k])
    }
  })
  return obj
}
