import type { BetId, BetTitle } from '../market/index.type'

export type AuditId = BetId
export type Audit =
  | { id: BetId; title: BetTitle; action: 'do-nothing'; createdAt: Date }
  | { id: BetId; title: BetTitle; action: 'placed'; createdAt: Date }
