/**
 * Express server
 *
 * Created by kevinc that forwards the request asking for GraphQl
 *
 */
const express = require('express')
const expressGraphQL = require('express-graphql') //compatibility layer between GraphQL & Express
const schema = require('./schema/schema')
const app = express()

//wire up middleware
app.use('/graphql', expressGraphQL({
  schema,
  graphiql:true
}))

app.listen(4000, () => {
  console.log('Listening')
})