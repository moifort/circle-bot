import { Bets } from '@/components/organisms/Bets'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  component: Bets,
} satisfies Meta<typeof Bets>

export default meta
type Story = StoryObj<typeof meta>

export const Table: Story = {
  args: {},
}
