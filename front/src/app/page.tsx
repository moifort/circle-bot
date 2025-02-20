import { Avatar, AvatarFallback } from '@/components/atoms/avatar'
import { SidebarInset, SidebarProvider } from '@/components/atoms/sidebar'
import { Bets } from '@/components/molecules/Bets'

export default function Dashboard() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-start justify-between space-y-2 my-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Your automated strategist for mastering Polymarket bets!</p>
            </div>
            <div>
              <Avatar>
                <AvatarFallback className="text-2xl">🤖</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="grid auto-rows-min gap-4 sm:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Bets />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
