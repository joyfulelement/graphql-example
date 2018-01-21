//Defines what Application Data looks like.
//1. Define what properties each object has
//2. How each object is related to each other

const graphql = require('graphql')
const axios = require('axios')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({ //JS closure ( to resolve circular reference - UserType) - defined first but does not get executed until after the entire file gets executed
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType), //multiple users associated with the company
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
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
    })
})

// Allow GraphQL to jump and land on very specific node of our data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        user:{
            type: UserType,
            args: {id:{type: GraphQLString}},
            resolve(parentValue, args) {
                //Go to any data store and find tha actual data we are looking for
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data) //to access the data property return from axios library
            }
        },
        company: {
            type: CompanyType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addUser:{
            type: UserType,
            args: {
                firstName:{type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}){
                return axios.post('http://localhost:3000/users', {firstName, age})
                    .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})