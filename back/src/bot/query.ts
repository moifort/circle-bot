export namespace Bot {
  export const run = async () => {
    console.info('[BOT] run() ')
    // const [{ id, title, yes, no }] = await Market.latestPoliticalBets()
    // const action = Evaluator.evaluate(yes, no, await Wallet.balance())
    // if (action === 'do-nothing') {
    //   console.info('[BOT] run() => Do nothing')
    //   return
    // }
    // Bettor.placeBet(id, action.outcome, action.amountToBet)
    // Wallet.withdraw(action.amountToBet, TransactionDescription({ betId: id, betTitle: title, action }))
  }
}
