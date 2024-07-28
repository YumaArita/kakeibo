export default {
  name: 'groupInvitation',
  type: 'document',
  title: 'Group Invitation',
  fields: [
    {
      name: 'groupId',
      type: 'reference',
      to: [{type: 'group'}],
      title: 'Group',
    },
    {
      name: 'groupName',
      type: 'string',
      title: 'Group Name',
    },
    {
      name: 'invitee',
      type: 'reference',
      to: [{type: 'user'}],
      title: 'Invitee',
    },
    {
      name: 'invitedBy',
      type: 'reference',
      to: [{type: 'user'}],
      title: 'Invited By',
    },
  ],
}
