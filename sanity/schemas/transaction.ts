import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'transaction', // スキーマ名
  title: 'Transaction', // 表示名
  type: 'document', // ドキュメントタイプ
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string', // 文字列タイプ
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number', // 数値タイプ
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime', // 日時タイプ
    }),
  ],
})
