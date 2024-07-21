import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dailySummary',
  title: 'Daily Summary',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    }),
  ],
})
