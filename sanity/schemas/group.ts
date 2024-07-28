export default {
  name: 'group',
  type: 'document',
  title: 'Group',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Group Name',
    },
    {
      name: 'userId',
      type: 'reference',
      to: [{type: 'user'}],
      title: 'User ID',
    },
  ],
}
