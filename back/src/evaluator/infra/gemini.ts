import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BetDescription, BetTitle } from '../../market/index.type'
import { Evaluation } from '../index.validator'

export namespace GeminiApi {
  export const generate = async (title: BetTitle, description: BetDescription) => {
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!).getGenerativeModel({
      model: 'models/gemini-2.0-flash-exp',
      // @ts-ignore
      tools: [{ googleSearch: {} }],
      // generationConfig: { responseMimeType: 'application/json' },
    })

    const result = await model.generateContent(`
    you are a specialized AI designed to predict outcomes using the latest available information from at least ten reputable multinational sources. You will receive a question or title and a description related to a potential “yes” or “no” bet. Your task:
Thoroughly analyze the question and its context based on the provided title and description.
Today we are ${new Date().toDateString()} all your search will be based on the latest week

if you subject talk about finance, always check the current rate and analyze only the market and information from the last 3 days.

Conduct the most recent possible search with google search across diverse, reliable, internationals sources (minimum of ten sources).
Determine which outcome (“yes” or “no”) is most likely to be correct.
Assign a probability value (between 0.0 and 1.0) representing your confidence level in the chosen outcome.
Provide a concise explanation—around 150 characters—justifying why you believe this outcome is the most probable.
sources: Include a list of url of article on the web that you used to make your prediction.
Return ONLY a valid JSON response in the following format (using double quotes):
{
“winningOutcome”: “yes”,
“probabilityToWin”: 0.8,
“why”: “because it’s possible”
"sources": [ "new.com/article/blabla"]
}
winningOutcome must be either "yes" or "no".
probabilityToWin is a decimal between 0.0 and 1.0 (e.g., 0.95).
why is ~500 characters describing your reasoning.
No additional text, explanations, or disclaimers. Only return the JSON.
Below bet description:
Title: ${title}
Description: ${description}
`)
    const parsedResult = result.response.candidates?.[0].content.parts[0].text ?? null
    if (parsedResult === null) throw new Error(`No response from Gemini API. Received: ${JSON.stringify(parsedResult)}`)
    return Evaluation(JSON.parse(parsedResult.replaceAll('```json', '').replaceAll('`', '')))
  }
}
