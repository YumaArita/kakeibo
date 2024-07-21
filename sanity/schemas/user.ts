import {defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'username',
      title: 'Username',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
  ],
})
