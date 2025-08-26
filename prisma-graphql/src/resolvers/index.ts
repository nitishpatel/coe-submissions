
import { mergeResolvers } from '@graphql-tools/merge';
import { movieResolvers } from './movie.resolvers';
import { scalarResolvers } from './scalars';

export const resolvers = mergeResolvers([scalarResolvers, movieResolvers]);
