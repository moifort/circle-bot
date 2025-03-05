import type { Resolvers } from '../../api/__generated__/type'

export const resolvers: Resolvers = {
  Query: {
    books: () => [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { title: 'Moby', author: 'Herman Melville' },
    ],
  },
}
