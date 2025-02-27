import type { BetId, BetTitle } from '../market/index.type'

export type AuditId = BetId
export type Audit =
  | { id: AuditId; title: BetTitle; action: 'do-nothing'; createdAt: Date }
  | { id: AuditId; title: BetTitle; action: 'placed'; createdAt: Date }
