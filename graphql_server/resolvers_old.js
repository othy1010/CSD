import db from "./_db.js";

export const resolvers = {
  Query: {
    collaborations() {
      return db.Collaborations;
    },
    collaboration(_, args) {
      return db.Collaborations.find(
        (collaboration) => collaboration.id === args.id
      );
    },
    users() {
      return db.Users;
    },
    user(_, args) {
      return db.Users.find((user) => user.id === args.id);
    },
    proposals() {
      return db.Proposals;
    },

    proposal(_, args) {
      return db.Proposals.find((proposal) => proposal.id === args.id);
    },
  },
  Collaboration: {
    members(collaboration) {
      return db.Users.filter((user) => collaboration.members.includes(user.id));
    },
    proposals(collaboration) {
      return db.Proposals.filter((proposal) =>
        collaboration.proposals.includes(proposal.id)
      );
    },
  },
  User: {
    collaborations(user) {
      return db.Collaborations.filter((collaboration) =>
        user.collaborations.includes(collaboration.id)
      );
    },
  },
  Proposal: {
    collaboration(proposal) {
      return db.Collaborations.find(
        (collaboration) => collaboration.id === proposal.collaboration
      );
    },
  },
  Mutation: {
    addCollaboration(_, args) {
      let collaboration = {
        ...args.collaboration,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.Collaborations.push(collaboration);
      return db.Collaborations;
    },
    updateCollaboration(_, args) {
      db.Collaborations = db.Collaborations.map((collaboration) => {
        if (collaboration.id === args.id) {
          return { ...collaboration, ...args.edits };
        }
        return collaboration;
      });
      return db.Collaborations.filter(
        (collaboration) => collaboration.id === args.id
      );
    },
    deleteCollaboration(_, args) {
      db.Collaborations = db.Collaborations.filter(
        (collaboration) => collaboration.id !== args.id
      );
      return db.Collaborations;
    },
    addUser(_, args) {
      const newUser = {
        ...args.user,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.Users.push(newUser);
      return db.Users;
    },
    updateUser(_, args) {
      db.Users = db.Users.map((user) => {
        if (user.id === args.id) {
          return { ...user, ...args.edits };
        }
        return user;
      });
      return db.Users.filter((user) => user.id === args.id);
    },
    deleteUser(_, args) {
      db.Users = db.Users.filter((user) => user.id !== args.id);
      return db.Users;
    },
    addProposal(_, args) {
      const newProposal = {
        ...args.proposal,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      console.log(newProposal);
      db.Proposals.push(newProposal);
      return db.Proposals;
    },
    updateProposal(_, args) {
      db.Proposals = db.Proposals.map((proposal) => {
        if (proposal.id === args.id) {
          return { ...proposal, ...args.edits };
        }
        return proposal;
      });
      return db.Proposals.filter((proposal) => proposal.id === args.id);
    },
    deleteProposal(_, args) {
      db.Proposals = db.Proposals.filter((proposal) => proposal.id !== args.id);
      return db.Proposals;
    },
  },
};
