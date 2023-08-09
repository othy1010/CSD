export const typeDefs = `#graphql
    scalar Date
    type Collaboration {
        id: ID!
        name: String!   
        description: String
        startDate: String
        decisionDuration: String
        evaluationDuration: String
        status: String
        decisionPattern: DecisionPattern!
        members: [User!]
        proposals: [Proposal!]
    }

    type DecisionPattern {
        id: ID!
        name: String
        description: String
        participationMethod: ParticipationMethod
        codecisionMethod: CodecisionMethod
        intent: Intent
        solution: Solution
        application: Application
        knowuse: Knowuse
    }

    type ParticipationMethod{
        id: ID!
        type: ParticipationType
    }

    enum ParticipationType{
        INDIVIDUAL
        GROUP
        COLLABORATIVE
    }

    type CodecisionMethod{
        id: ID!
        processKind: ProcessKind
        evaluationKind: EvaluationKind
        agreementThreshold: AgreementThreshold
    }
    enum ProcessKind {
        LINEAR
        CYCLIC
        ITERATIVE
    }
    enum EvaluationKind {
        QUANTITATIVE
        QUALITATIVE
    }
    enum AgreementThreshold {
        MAJORITY
        UNANIMITY
        CONSENSUS
    }

    type Intent {
        id: ID!
        name: String
        description: String
    }
    type Solution {
        id: ID!
        name: String
        description: String
    }
    type Application{
        id: ID!
        name: String
        description: String
    }
    type Knowuse {
        id: ID!
        name: String
        description: String
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        expertise: String
        userRole: UserRole
        isModerator: Boolean
        active: Boolean
        collaborations: [Collaboration!]
        proposals: [Proposal!] 
        decisions: [Decision!]
    }

    enum UserRole {
        DEVELOPER
        ARCHITECT
        SECURITYEXPERT
        MANAGER
    }

    type Proposal {
        id: ID!
        name: String!
        author: User!
        description: String
        date: Date
        status: String
        collaboration: Collaboration
        decisions: [Decision!]
        changes: [Change!]
    }

    type Decision {
        id: ID!
        proposal: Proposal!
        agreements: Boolean!
        user: User!
        comment: String
        date: String
    }

    type Change {
        id: ID!
        proposal: Proposal!
        changetype: ChangeType!
        comment: String
    }

    enum ChangeType {
        ADD
        EDIT
        DELETE
    }

    type Vulnerability {
        id: ID!
        name: String!
        description: String
        reference: VulnerabilityReference
        refid: String
        date: String    
    }

    enum VulnerabilityReference {
        CVE
        CWE
        CAPEC
        NIST
        OWASP
    }
        
    type Threat {
        id: ID!
        name: String!
        description: String
        reference: ThreatReference
        refid: String
        impactseverity: ImpactSeverity
        date: String
    }
            
    enum ThreatReference {
        ATTACK
        CAPEC
    }

    enum ImpactSeverity {   
        LOW 
        MEDIUM
        HIGH
    }

    type Risk {
        id: ID! 
        name: String!
        description: String 
        reference: RiskReference
        refid: String
        impactseverity: ImpactSeverity
    }

    enum RiskReference {
        NIST
        OWASP
    }

    type Mitigation {
        id: ID!
        name: String!
        description: String
        reference: MitigationReference
        refid: String
    }

    enum MitigationReference {
        NIST
        OWASP
        ATTACK
        CAPEC
        CVE
        CWE
    }

# ---------------------------------

    type Query {
        collaborations: [Collaboration]
        collaboration(id: ID!): Collaboration
        decisionPatterns: [DecisionPattern]
        decisionPattern(id: ID!): DecisionPattern
        participationMethods: [ParticipationMethod]
        participationMethod(id: ID!): ParticipationMethod
        codecisionMethods: [CodecisionMethod]
        codecisionMethod(id: ID!): CodecisionMethod
        intents: [Intent]
        intent(id: ID!): Intent
        solutions: [Solution]
        solution(id: ID!): Solution
        applications: [Application]
        application(id: ID!): Application
        knowuses: [Knowuse]
        knowuse(id: ID!): Knowuse
        users: [User]
        user(id: ID!): User
        proposals: [Proposal]
        proposal(id: ID!): Proposal
        decisions: [Decision]
        decision(id: ID!): Decision
        changes: [Change]
        change(id: ID!): Change
        vulnerabilities: [Vulnerability]
        vulnerability(id: ID!): Vulnerability
        threats: [Threat]   
        threat(id: ID!): Threat
        risks: [Risk]   
        risk(id: ID!): Risk
        mitigations: [Mitigation]
        mitigation(id: ID!): Mitigation

        
    }


# ---------------------------------

    type Mutation {
        addCollaboration(collaboration: AddCollaborationInput!): Collaboration
        updateCollaboration(id: ID!, edits: EditCollaborationInput!): [Collaboration]
        deleteCollaboration(id: ID!): [Collaboration]
        addDecisionPattern(decisionPattern: AddDecisionPatternInput!): DecisionPattern
        updateDecisionPattern(id: ID!, edits: EditDecisionPatternInput!): [DecisionPattern]
        deleteDecisionPattern(id: ID!): [DecisionPattern]
        addParticipationMethod(participationMethod: AddParticipationMethodInput!): ParticipationMethod
        updateParticipationMethod(id: ID!, edits: EditParticipationMethodInput!): [ParticipationMethod]
        deleteParticipationMethod(id: ID!): [ParticipationMethod]
        addCodecisionMethod(codecisionMethod: AddCodecisionMethodInput!): CodecisionMethod
        updateCodecisionMethod(id: ID!, edits: EditCodecisionMethodInput!): [CodecisionMethod]
        deleteCodecisionMethod(id: ID!): [CodecisionMethod]
        addIntent(intent: AddIntentInput!): Intent
        updateIntent(id: ID!, edits: EditIntentInput!): [Intent]
        deleteIntent(id: ID!): [Intent]
        addSolution(solution: AddSolutionInput!): Solution
        updateSolution(id: ID!, edits: EditSolutionInput!): [Solution]
        deleteSolution(id: ID!): [Solution]
        addApplication(application: AddApplicationInput!): Application
        updateApplication(id: ID!, edits: EditApplicationInput!): [Application]
        deleteApplication(id: ID!): [Application]
        addKnowuse(knowuse: AddKnowuseInput!): Knowuse
        updateKnowuse(id: ID!, edits: EditKnowuseInput!): [Knowuse]
        deleteKnowuse(id: ID!): [Knowuse]
        addUser(user: AddUserInput!): User
        updateUser(id: ID!, edits: EditUserInput!): [User]
        deleteUser(id: ID!): [User]
        addProposal(proposal: AddProposalInput!): Proposal
        updateProposal(id: ID!, edits: EditProposalInput!): [Proposal]
        deleteProposal(id: ID!): [Proposal]
        addDecision(decision: AddDecisionInput!): Decision
        updateDecision(id: ID!, edits: EditDecisionInput!): [Decision]
        deleteDecision(id: ID!): [Decision]
        addChange(change: AddChangeInput!): Change
        updateChange(id: ID!, edits: EditChangeInput!): [Change]
        deleteChange(id: ID!): [Change]
        addVulnerability(vulnerability: AddVulnerabilityInput!): Vulnerability
        updateVulnerability(id: ID!, edits: EditVulnerabilityInput!): [Vulnerability]
        deleteVulnerability(id: ID!): [Vulnerability]
        addThreat(threat: AddThreatInput!): Threat
        updateThreat(id: ID!, edits: EditThreatInput!): [Threat]
        deleteThreat(id: ID!): [Threat]
        addRisk(risk: AddRiskInput!): Risk
        updateRisk(id: ID!, edits: EditRiskInput!): [Risk]
        deleteRisk(id: ID!): [Risk]
        addMitigation(mitigation: AddMitigationInput!): Mitigation
        updateMitigation(id: ID!, edits: EditMitigationInput!): [Mitigation]
        deleteMitigation(id: ID!): [Mitigation]

        


    }   

# ---------------------------------

    input AddCollaborationInput {
        name: String!
        # decisionPattern: DecisionPattern!   
        description: String
        startDate: String
        decisionDuration: String
        evaluationDuration: String
        status: String
    }

    input AddDecisionPatternInput {
        name: String
        description: String
    }

    input AddParticipationMethodInput {
        type: ParticipationType
    }

    input AddCodecisionMethodInput {
        processKind: ProcessKind
        evaluationKind: EvaluationKind
        agreementThreshold: AgreementThreshold
    }

    input AddIntentInput {
        name: String
        description: String
    }

    input AddSolutionInput {
        name: String
        description: String
    }

    input AddApplicationInput {
        name: String
        description: String
    }

    input AddKnowuseInput {
        name: String
        description: String
    }

    input AddUserInput {
        name: String!
        email: String!
        password: String!
        expertise: String,
        userRole: UserRole,
        isModerator: Boolean,
        active: Boolean,
       
    }
    
    input AddProposalInput {
        name: String!
        description: String
        date: String
        status: String
    }

    input AddDecisionInput {
        # proposal: Proposal!
        agreements: Boolean!
        comment: String
        date: String
    }

    input AddChangeInput {
        # proposal: Proposal!
        changetype: ChangeType!
        comment: String
    }

    input AddVulnerabilityInput {
        name: String!
        description: String
        reference: VulnerabilityReference
        refid: String
        date: String
    }

    input AddThreatInput {
        name: String!
        description: String
        reference: ThreatReference
        refid: String
        impactseverity: ImpactSeverity
        date: String
    }

    input AddRiskInput {
        name: String!
        description: String
        reference: RiskReference
        refid: String
        impactseverity: ImpactSeverity
    }

    input AddMitigationInput {
        name: String!
        description: String
        reference: MitigationReference
        refid: String
    }

# ---------------------------------

    input EditCollaborationInput {
        name: String
        description: String
        date: String
        status: String
    }

    input EditDecisionPatternInput {
        name: String
        description: String
    }

    input EditParticipationMethodInput {
        type: ParticipationType
    }

    input EditCodecisionMethodInput {
        processKind: ProcessKind
        evaluationKind: EvaluationKind
        agreementThreshold: AgreementThreshold
    }

    input EditIntentInput {
        name: String
        description: String
    }

    input EditSolutionInput {
        name: String
        description: String
    }

    input EditApplicationInput {
        name: String
        description: String
    }

    input EditKnowuseInput {
        name: String
        description: String
    }
    input EditDecisionPatternInput {
        name: String
        description: String
    }

    input EditParticipationMethodInput {
        type: ParticipationType
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

    input EditDecisionInput {
        # proposal: Proposal!
        agreements: Boolean!
        comment: String
        date: String
    }

    input EditChangeInput {
        # proposal: Proposal!
        changetype: ChangeType!
        comment: String
    }

    input EditVulnerabilityInput {
        name: String!
        description: String
        reference: VulnerabilityReference
        refid: String
        date: String
    }

    input EditThreatInput {
        name: String!
        description: String
        reference: ThreatReference
        refid: String
        impactseverity: ImpactSeverity
        date: String
    }

    input EditRiskInput {
        name: String!
        description: String
        reference: RiskReference
        refid: String
        impactseverity: ImpactSeverity
    }

    input EditMitigationInput {
        name: String!
        description: String
        reference: MitigationReference
        refid: String
    }

`;
