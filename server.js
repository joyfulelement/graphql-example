/**
 * Express server
 * Forwards the request asking for GraphQl
 * 
 * Created by kevinc 
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