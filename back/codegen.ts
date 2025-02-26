import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://127.0.0.1:5001/circle-bot-a5808/europe-west3/api',
  generates: {
    'src/api/__generated__/type.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
    'src/api/__generated__/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
