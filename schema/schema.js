//Defines what Application Data looks like.
//1. Define what properties each object has
//2. How each object is related to each other

const graphql = require('graphql')
const axios = require('axios')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString}
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName:{type: GraphQLString},
        age:{type: GraphQLInt},
        company:{ //need to resolve since the property name is different from data source
            type: CompanyType, //associate User to Company
            resolve(parentValue, args){
                console.log(parentValue, args)
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        user:{
            type: UserType,
            args: {id:{type: GraphQLString}},
            resolve(pcarentValue, args) {
                //Go to any data store and find tha actual data we are looking for
                // return _.find(users, {id:args.id}) //types handled by GraphQL
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data) //to access the data property return from axios library
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})