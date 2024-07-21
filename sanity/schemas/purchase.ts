import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'purchase',
  title: 'Purchase',
  type: 'document',
  fields: [
    defineField({
      name: 'item',
      title: 'Item',
      type: 'string',
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
    }),
  ],
})
