import { make } from 'ts-brand'
import { z } from 'zod'
import type { Evaluation as EvaluationType, Source as SourceType, Why as WhyType } from './index.type'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Evaluation = (value: any) =>
  z
    .object({
      winningOutcome: z.union([z.literal('yes'), z.literal('no')]),
      probabilityToWin: z.number().min(0).max(1),
      why: z.string().nonempty(),
      sources: z.string().array().nonempty(),
    })
    .parse(value) as unknown as EvaluationType

export const Why = make<WhyType>((value) => z.string().nonempty().parse(value))
export const Source = make<SourceType>((value) => z.string().nonempty().parse(value))
