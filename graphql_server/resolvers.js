import { User, Collaboration, Proposal } from './db.js';

export const resolvers = {
    Query: {
        async collaborations() {
            return await Collaboration.findAll();
        },
        async collaboration(_, args) {
            return await Collaboration.findByPk(args.id);
        },
        async users() {
            return await User.findAll();
        },
        async user(_, args) {
            return await User.findByPk(args.id);
        },
        async proposals() {
            return await Proposal.findAll();
        },
        async proposal(_, args) {
            return await Proposal.findByPk(args.id);
        }
    },
    Collaboration: {
        async members(collaboration) {
            return await collaboration.getUsers();
        },
        async proposals(collaboration) {
            return await collaboration.getProposals();
        }
    },
    User: {
        async collaborations(user) {
            return await user.getCollaborations();
        }
    },
    Proposal: {
        async collaboration(proposal) {
            return await proposal.getCollaboration();
        }
    },
    Mutation: {
        async addCollaboration(_, { collaboration }) {
            const newCollaboration = await Collaboration.create(collaboration);
            return newCollaboration;
        },
        async updateCollaboration(_, { id, edits }) {
            await Collaboration.update(edits, { where: { id } });
            return await Collaboration.findByPk(id);
        },
        async deleteCollaboration(_, { id }) {
            const deletedCollaboration = await Collaboration.findByPk(id);
            await Collaboration.destroy({ where: { id } });
            return deletedCollaboration;
        },
        async addUser(_, { user }) {
            const newUser = await User.create(user);
            return newUser;
        },
        async updateUser(_, { id, edits }) {
            await User.update(edits, { where: { id } });
            return await User.findByPk(id);
        },
        async deleteUser(_, { id }) {
            const deletedUser = await User.findByPk(id);
            await User.destroy({ where: { id } });
            return deletedUser;
        },
        async addProposal(_, { proposal }) {
            const newProposal = await Proposal.create(proposal);
            return newProposal;
        },
        async updateProposal(_, { id, edits }) {
            await Proposal.update(edits, { where: { id } });
            return await Proposal.findByPk(id);
        },
        async deleteProposal(_, { id }) {
            const deletedProposal = await Proposal.findByPk(id);
            await Proposal.destroy({ where: { id } });
            return deletedProposal;
        }
    }
};
