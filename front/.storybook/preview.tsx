import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../src/app/globals.css'
import { ThemeProvider } from '../src/components/theme-provider'
import { commonTheme, darkUIStorybook, lightUIStorybook } from './theme'

const preview: Preview = {
  parameters: {
    darkMode: {
      classTarget: 'html',
      stylePreview: true,
      darkClass: 'dark',
      lightClass: 'light',
      dark: { ...themes.dark, ...darkUIStorybook, ...commonTheme },
      light: { ...themes.normal, ...lightUIStorybook, ...commonTheme },
      current: 'dark',
    },
    docs: {
      theme: { ...themes.dark, ...darkUIStorybook, ...commonTheme },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
}
export const decorators = [
  (Story) => {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <div>
          <Story />
        </div>
      </ThemeProvider>
    )
  },
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
  }),
]

export default preview
