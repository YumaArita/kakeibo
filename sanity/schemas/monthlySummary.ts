import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'monthlySummary',
  title: 'Monthly Summary',
  type: 'document',
  fields: [
    defineField({
      name: 'month',
      title: 'Month',
      type: 'string',
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    }),
  ],
})
