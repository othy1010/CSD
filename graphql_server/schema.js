export const typeDefs = `#graphql
    type Collaboration {
        id: ID!
        name: String!   
        description: String
        date: String
        status: String
        members: [User!]
        proposals: [Proposal!]
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        active: Boolean
        collaborations: [Collaboration!]
    }

    type Proposal {
        id: ID!
        name: String!
        description: String
        date: String
        status: String
        collaboration: Collaboration
    }

    type Query {
        collaborations: [Collaboration]
        collaboration(id: ID!): Collaboration
        users: [User]
        user(id: ID!): User
        proposals: [Proposal]
        proposal(id: ID!): Proposal
    }
    type Mutation {
        addCollaboration(collaboration: AddCollaborationInput!): Collaboration
        updateCollaboration(id: ID!, edits: EditCollaborationInput!): [Collaboration]
        deleteCollaboration(id: ID!): [Collaboration]
        addUser(user: AddUserInput!): User
        updateUser(id: ID!, edits: EditUserInput!): [User]
        deleteUser(id: ID!): [User]
        addProposal(proposal: AddProposalInput!): Proposal
        updateProposal(id: ID!, edits: EditProposalInput!): [Proposal]
        deleteProposal(id: ID!): [Proposal]
    }   

    input AddCollaborationInput {
        name: String!
        description: String
        date: String
        status: String
    }

    input AddUserInput {
        name: String!
        email: String!
        password: String!
    }
    
    input AddProposalInput {
        name: String!
        description: String
        date: String
        status: String
    }

    input EditCollaborationInput {
        name: String
        description: String
        date: String
        status: String
    }

    input EditUserInput {
        name: String
        email: String
        password: String
    }
    
    input EditProposalInput {
        name: String
        description: String
        date: String
        status: String
    }



`
