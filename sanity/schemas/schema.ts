import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import user from './user'
import transaction from './transaction'
import purchase from './purchase'
import dailySummary from './dailySummary'
import monthlySummary from './monthlySummary'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([user, transaction, purchase, dailySummary, monthlySummary]),
})
