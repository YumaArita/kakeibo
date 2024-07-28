export default {
  name: 'transaction',
  type: 'document',
  title: 'Transaction',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'amount',
      type: 'number',
      title: 'Amount',
    },
    {
      name: 'date',
      type: 'datetime',
      title: 'Date',
    },
    {
      name: 'userId',
      type: 'reference',
      to: [{type: 'user'}],
      title: 'User',
    },
  ],
}
