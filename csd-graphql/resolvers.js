import {
  Collaboration,
  DecisionPattern,
  Intent,
  Solution,
  Application,
  Knowuse,
  ParticipationMethod,
  CodecisionMethod,
  User,
  Proposal,
  Decision,
  Change,
  Risk,
  Mitigation,
  Vulnerability,
  Threat,
} from "./db.js";
import { dateScalar } from "./datescalar.js";
export const resolvers = {
  Date: dateScalar,
  Query: {
    async collaborations() {
      return await Collaboration.findAll();
    },
    async collaboration(_, args) {
      return await Collaboration.findByPk(args.id);
    },
    async decisionPatterns() {
      return await DecisionPattern.findAll();
    },
    async decisionPattern(_, args) {
      return await DecisionPattern.findByPk(args.id);
    },
    async participationMethods() {
      return await ParticipationMethod.findAll();
    },
    async participationMethod(_, args) {
      return await ParticipationMethod.findByPk(args.id);
    },
    async codecisionMethods() {
      return await CodecisionMethod.findAll();
    },
    async codecisionMethod(_, args) {
      return await CodecisionMethod.findByPk(args.id);
    },
    async intents() {
      return await Intent.findAll();
    },
    async intent(_, args) {
      return await Intent.findByPk(args.id);
    },
    async solutions() {
      return await Solution.findAll();
    },
    async solution(_, args) {
      return await Solution.findByPk(args.id);
    },
    async applications() {
      return await Application.findAll();
    },
    async application(_, args) {
      return await Application.findByPk(args.id);
    },
    async knowuses() {
      return await Knowuse.findAll();
    },
    async knowuse(_, args) {
      return await Knowuse.findByPk(args.id);
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
    },
    async decisions() {
      return await Decision.findAll();
    },
    async decision(_, args) {
      return await Decision.findByPk(args.id);
    },
    async changes() {
      return await Change.findAll();
    },
    async change(_, args) {
      return await Change.findByPk(args.id);
    },
    async risks() {
      return await Risk.findAll();
    },
    async risk(_, args) {
      return await Risk.findByPk(args.id);
    },
    async mitigations() {
      return await Mitigation.findAll();
    },
    async mitigation(_, args) {
      return await Mitigation.findByPk(args.id);
    },
    async vulnerabilities() {
      return await Vulnerability.findAll();
    },
    async vulnerability(_, args) {
      return await Vulnerability.findByPk(args.id);
    },
    async threats() {
      return await Threat.findAll();
    },
    async threat(_, args) {
      return await Threat.findByPk(args.id);
    },
  },
  Collaboration: {
    async members(collaboration) {
      return await collaboration.getUsers();
    },
    async proposals(collaboration) {
      return await collaboration.getProposals();
    },
    async decisionPattern(collaboration) {
      return await collaboration.getDecisionPatterns();
    },
  },

  DecisionPattern: {
    async intent(decisionPattern) {
      return await decisionPattern.getIntents();
    },
    async solution(decisionPattern) {
      return await decisionPattern.getSolutions();
    },
    async application(decisionPattern) {
      return await decisionPattern.getApplications();
    },
    async knowuse(decisionPattern) {
      return await decisionPattern.getKnowuses();
    },
    async participationMethod(decisionPattern) {
      return await decisionPattern.getParticipationMethod();
    },
  },

  User: {
    async collaborations(user) {
      return await user.getCollaborations();
    },
    async proposals(user) {
      return await user.getProposals();
    },
    async decisions(user) {
      return await user.getDecisions();
    },
  },
  Proposal: {
    async collaboration(proposal) {
      return await proposal.getCollaboration();
    },
    async author(proposal) {
      return await proposal.getAuthor();
    },
    async decisions(proposal) {
      return await proposal.getDecisions();
    },
    async changes(proposal) {
      return await proposal.getChanges();
    },
  },
  Decision: {
    async proposal(decision) {
      return await decision.getProposal();
    },
    async user(decision) {
      return await decision.getUser();
    },
  },
  Change: {
    async proposal(change) {
      return await change.getProposal();
    },
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
    async addDecisionPattern(_, { decisionPattern }) {
      const newDecisionPattern = await DecisionPattern.create(decisionPattern);
      return newDecisionPattern;
    },
    async updateDecisionPattern(_, { id, edits }) {
      await DecisionPattern.update(edits, { where: { id } });
      return await DecisionPattern.findByPk(id);
    },
    async deleteDecisionPattern(_, { id }) {
      const deletedDecisionPattern = await DecisionPattern.findByPk(id);
      await DecisionPattern.destroy({ where: { id } });
      return deletedDecisionPattern;
    },
    async addIntent(_, { intent }) {
      const newIntent = await Intent.create(intent);
      return newIntent;
    },
    async updateIntent(_, { id, edits }) {
      await Intent.update(edits, { where: { id } });
      return await Intent.findByPk(id);
    },
    async deleteIntent(_, { id }) {
      const deletedIntent = await Intent.findByPk(id);
      await Intent.destroy({ where: { id } });
      return deletedIntent;
    },
    async addSolution(_, { solution }) {
      const newSolution = await Solution.create(solution);
      return newSolution;
    },
    async updateSolution(_, { id, edits }) {
      await Solution.update(edits, { where: { id } });
      return await Solution.findByPk(id);
    },
    async deleteSolution(_, { id }) {
      const deletedSolution = await Solution.findByPk(id);
      await Solution.destroy({ where: { id } });
      return deletedSolution;
    },
    async addApplication(_, { application }) {
      const newApplication = await Application.create(application);
      return newApplication;
    },
    async updateApplication(_, { id, edits }) {
      await Application.update(edits, { where: { id } });
      return await Application.findByPk(id);
    },
    async deleteApplication(_, { id }) {
      const deletedApplication = await Application.findByPk(id);
      await Application.destroy({ where: { id } });
      return deletedApplication;
    },
    async addKnowuse(_, { knowuse }) {
      const newKnowuse = await Knowuse.create(knowuse);
      return newKnowuse;
    },
    async updateKnowuse(_, { id, edits }) {
      await Knowuse.update(edits, { where: { id } });
      return await Knowuse.findByPk(id);
    },
    async deleteKnowuse(_, { id }) {
      const deletedKnowuse = await Knowuse.findByPk(id);
      await Knowuse.destroy({ where: { id } });
      return deletedKnowuse;
    },
    async addParticipationMethod(_, { participationMethod }) {
      const newParticipationMethod = await ParticipationMethod.create(
        participationMethod
      );
      return newParticipationMethod;
    },
    async updateParticipationMethod(_, { id, edits }) {
      await ParticipationMethod.update(edits, { where: { id } });
      return await ParticipationMethod.findByPk(id);
    },
    async deleteParticipationMethod(_, { id }) {
      const deletedParticipationMethod = await ParticipationMethod.findByPk(id);
      await ParticipationMethod.destroy({ where: { id } });
      return deletedParticipationMethod;
    },
    async addCodecisionMethod(_, { codecisionMethod }) {
      const newCodecisionMethod = await CodecisionMethod.create(
        codecisionMethod
      );
      return newCodecisionMethod;
    },
    async updateCodecisionMethod(_, { id, edits }) {
      await CodecisionMethod.update(edits, { where: { id } });
      return await CodecisionMethod.findByPk(id);
    },
    async deleteCodecisionMethod(_, { id }) {
      const deletedCodecisionMethod = await CodecisionMethod.findByPk(id);
      await CodecisionMethod.destroy({ where: { id } });
      return deletedCodecisionMethod;
    },
    async addUser(_, { user }) {
      console.log("Received user input:", user);

      try {
        const newUser = await User.create(user);
        console.log("New user created:", newUser);
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error; // Rethrow the error to be caught by Apollo Server
      }
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
    },
    async addDecision(_, { decision }) {
      const newDecision = await Decision.create(decision);
      return newDecision;
    },
    async updateDecision(_, { id, edits }) {
      await Decision.update(edits, { where: { id } });
      return await Decision.findByPk(id);
    },
    async deleteDecision(_, { id }) {
      const deletedDecision = await Decision.findByPk(id);
      await Decision.destroy({ where: { id } });
      return deletedDecision;
    },
    async addChange(_, { change }) {
      const newChange = await Change.create(change);
      return newChange;
    },
    async updateChange(_, { id, edits }) {
      await Change.update(edits, { where: { id } });
      return await Change.findByPk(id);
    },
    async deleteChange(_, { id }) {
      const deletedChange = await Change.findByPk(id);
      await Change.destroy({ where: { id } });
      return deletedChange;
    },
    async addRisk(_, { risk }) {
      const newRisk = await Risk.create(risk);
      return newRisk;
    },
    async updateRisk(_, { id, edits }) {
      await Risk.update(edits, { where: { id } });
      return await Risk.findByPk(id);
    },
    async deleteRisk(_, { id }) {
      const deletedRisk = await Risk.findByPk(id);
      await Risk.destroy({ where: { id } });
      return deletedRisk;
    },
    async addMitigation(_, { mitigation }) {
      const newMitigation = await Mitigation.create(mitigation);
      return newMitigation;
    },
    async updateMitigation(_, { id, edits }) {
      await Mitigation.update(edits, { where: { id } });
      return await Mitigation.findByPk(id);
    },
    async deleteMitigation(_, { id }) {
      const deletedMitigation = await Mitigation.findByPk(id);
      await Mitigation.destroy({ where: { id } });
      return deletedMitigation;
    },
    async addVulnerability(_, { vulnerability }) {
      const newVulnerability = await Vulnerability.create(vulnerability);
      return newVulnerability;
    },
    async updateVulnerability(_, { id, edits }) {
      await Vulnerability.update(edits, { where: { id } });
      return await Vulnerability.findByPk(id);
    },
    async deleteVulnerability(_, { id }) {
      const deletedVulnerability = await Vulnerability.findByPk(id);
      await Vulnerability.destroy({ where: { id } });
      return deletedVulnerability;
    },
    async addThreat(_, { threat }) {
      const newThreat = await Threat.create(threat);
      return newThreat;
    },
    async updateThreat(_, { id, edits }) {
      await Threat.update(edits, { where: { id } });
      return await Threat.findByPk(id);
    },
    async deleteThreat(_, { id }) {
      const deletedThreat = await Threat.findByPk(id);
      await Threat.destroy({ where: { id } });
      return deletedThreat;
    },
  },
};
