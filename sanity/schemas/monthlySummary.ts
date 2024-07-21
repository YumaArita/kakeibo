import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'monthlySummary',
  title: 'Monthly Summary',
  type: 'document',
  fields: [
    defineField({
      name: 'month',
      title: 'Month',
      type: 'string', // format as 'YYYY-MM' to represent the month
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    }),
  ],
})
