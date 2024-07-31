export default {
  name: 'group',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Group Name',
    },
    {
      name: 'owner',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      name: 'members',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'user'}]}],
    },
  ],
}
