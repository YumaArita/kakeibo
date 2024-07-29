export default {
  name: 'user',
  type: 'document',
  title: 'User',
  fields: [
    {
      name: 'userId',
      type: 'string',
      title: 'User ID',
    },
    {
      name: 'username',
      type: 'string',
      title: 'Username',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'password',
      type: 'string',
      title: 'Password',
    },
    {
      name: 'isVerified',
      type: 'boolean',
      title: 'Is Verified',
    },
  ],
}
