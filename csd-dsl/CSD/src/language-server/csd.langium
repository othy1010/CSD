grammar Csd

entry Model:

Collaboration:
  'Collaboration'	'ID' Id=STRING
	'{'
		('description' description=STRING )?
		('startDate' startDate=EDate)?
		('DecisionDuration' DecisionDuration=EInt)?
		('evaluationDuration' evaluationDuration=EInt)?
		('collaborationState' collaborationState=CollabState)?
		'involvedusers' '(' involvedusers+=[InvolvedUser:Id] ( "," involvedusers+=[InvolvedUser:Id])* ')' 
		'decisionpattern' decisionpattern=DecisionPattern
		('proposals' '{' proposal+=Proposal ( "," proposal+=Proposal)* '}' )?
	;

InvolvedUser :
	
	'InvolvedUser' Id=STRING
	'{'
		('email' email=STRING)?
		('password' password=STRING)?
		('isModerator' isModerator?=boolean)?
		('IsEligibleDM' IsEligibleDM?=boolean)?
		('expertiseLevel' expertiseLevel=EInt)?
		('userRole' userRole=UserRole)?
		('decision' '(' decision+=[Decision|STRING] ( "," decision+=[Decision|STRING])* ')' )?
		('proposal' '(' proposal+=[Proposals::Proposal|STRING] ( "," proposal+=[Proposals::Proposal|STRING])* ')' )?
	'}';

Proposal returns Proposals::Proposal:
	'Proposal'
	Id=STRING
	'{'
		('description' description=STRING)?
		('creationDate' creationDate=EDate)?
		('Vulnerability' '(' Vulnerability+=[ThreatModeling::Vulnerability|STRING] ( "," Vulnerability+=[ThreatModeling::Vulnerability|STRING])* ')' )?
		'decision' '(' decision+=[Evaluation::Decision|STRING] ( "," decision+=[Evaluation::Decision|STRING])* ')' 
		'involveduser' involveduser=[Actors::InvolvedUser|STRING]
		('Proposalobservers' '{' Proposalobservers+=ProposalObserver ( "," Proposalobservers+=ProposalObserver)* '}' )?
		'proposalstate' proposalstate=ProposalState
		('change' '{' change+=Change ( "," change+=Change)* '}' )?
	'}';

DecisionPattern returns DecisionMaking::DecisionPattern:
	'DecisionPattern'
	'{'
		'collaboration' '(' collaboration+=[Collaboration::Collaboration|STRING] ( "," collaboration+=[Collaboration::Collaboration|STRING])* ')' 
		'intent' intent=Intent
		'application' '{' application+=Application ( "," application+=Application)* '}' 
		'knowuse' '{' knowuse+=Knowuse ( "," knowuse+=Knowuse)* '}' 
		'solution' solution=Solution
		'participationmethod' participationmethod=ParticipationMethod
		'codecisionmethod' codecisionmethod=CodecisionMethod
	'}';



EBoolean returns ecore::EBoolean:
	'true' | 'false';

Decision returns Evaluation::Decision:
	'Decision'
	'{'
		('agreement' agreement=AgreementType)?
		('comment' comment=STRING)?
		'involveduser' involveduser=[Actors::InvolvedUser|STRING]
		'proposal' proposal=[Proposals::Proposal|STRING]
	'}';


Change returns Proposals::Change:
	{Proposals::Change}
	'Change'
	'{'
		('type' type=ChangeType)?
		('refId' refId=STRING)?
	'}';

Vulnerability returns ThreatModeling::Vulnerability:
	'Vulnerability'
	name=STRING
	'{'
		('description' description=STRING)?
		('reference' reference=VulnerabilityReference)?
		('refId' refId=STRING)?
		('proposal' '(' proposal+=[Proposals::Proposal|STRING] ( "," proposal+=[Proposals::Proposal|STRING])* ')' )?
		('threat' '(' threat+=[ThreatModeling::Threat|STRING] ( "," threat+=[ThreatModeling::Threat|STRING])* ')' )?
		'risk' '(' risk+=[Proposals::Risk|STRING] ( "," risk+=[Proposals::Risk|STRING])* ')' 
		('mitigation' '(' mitigation+=[Mitigation|STRING] ( "," mitigation+=[Mitigation|STRING])* ')' )?
	'}';

PendingProposalState returns Proposals::PendingProposalState:
	{Proposals::PendingProposalState}
	'PendingProposalState'
	;

AcceptedProposalState returns Proposals::AcceptedProposalState:
	{Proposals::AcceptedProposalState}
	'AcceptedProposalState'
	;

RejectedProposalState returns Proposals::RejectedProposalState:
	{Proposals::RejectedProposalState}
	'RejectedProposalState'
	;


Threat returns ThreatModeling::Threat:
	'Threat'
	name=STRING
	'{'
		('description' description=STRING)?
		('impactSeverity' impactSeverity=Severity)?
		('reference' reference=ThreatReference)?
		'vulnerability' '(' vulnerability+=[ThreatModeling::Vulnerability|STRING] ( "," vulnerability+=[ThreatModeling::Vulnerability|STRING])* ')' 
	'}';

Risk returns Proposals::Risk:
	'Risk'
	name=STRING
	'{'
		('description' description=STRING)?
		('Frenquency' Frenquency=EInt)?
		('impactSeverity' impactSeverity=Severity)?
		'vulnerability' '(' vulnerability+=[ThreatModeling::Vulnerability|STRING] ( "," vulnerability+=[ThreatModeling::Vulnerability|STRING])* ')' 
	'}';


Mitigation returns Mitigation:
	'Mitigation'
	'{'
		'vulnerability' '(' vulnerability+=[ThreatModeling::Vulnerability|STRING] ( "," vulnerability+=[ThreatModeling::Vulnerability|STRING])* ')' 
	'}';



Intent returns DecisionMaking::Intent:
	{DecisionMaking::Intent}
	'Intent'
	;

Application returns DecisionMaking::Application:
	{DecisionMaking::Application}
	'Application'
	;

Knowuse returns DecisionMaking::Knowuse:
	{DecisionMaking::Knowuse}
	'Knowuse'
	;

Solution returns DecisionMaking::Solution:
	{DecisionMaking::Solution}
	'Solution'
	;

ParticipationMethod returns DecisionMaking::ParticipationMethod:
	{DecisionMaking::ParticipationMethod}
	'ParticipationMethod'
	'{'
		('type' type=ParticipationType)?
		('parameter' '(' parameter+=[DecisionMaking::Parameter|STRING] ( "," parameter+=[DecisionMaking::Parameter|STRING])* ')' )?
		('selectioncriteria' '(' selectioncriteria+=[DecisionMaking::SelectionCriteria|STRING] ( "," selectioncriteria+=[DecisionMaking::SelectionCriteria|STRING])* ')' )?
	'}';

CodecisionMethod returns DecisionMaking::CodecisionMethod:
	{DecisionMaking::CodecisionMethod}
	'CodecisionMethod'
	'{'
		('processKind' processKind=ProcessKind)?
		('evaluationType' evaluationType=EvaluationKind)?
		('agreementThreshold' agreementThreshold=AgreementThreshold)?
	'}';


Parameter returns DecisionMaking::Parameter:
	'Parameter'
	'{'
		('kind' kind=ParameterKind)?
		'participationmethod' participationmethod=[DecisionMaking::ParticipationMethod|STRING]
	'}';

SelectionCriteria returns DecisionMaking::SelectionCriteria:
	'SelectionCriteria'
	'{'
		('criterion' criterion=SelectionCriteriaType)?
		'participationmethod' participationmethod=[DecisionMaking::ParticipationMethod|STRING]
	'}';



hidden terminal WS: /\s+/;

terminal CollabState :
				 'ACTIVE' |  'TERMINATED' | 'SUSPENDED';

terminal ParticipationType :
			 'RESTRICTED' | 'DEMOCRATIC' | 'DELEGATED';

terminal UserRole :
				 'DEVELOPER' |  'ARCHITECT' |  'SECURITYEXPERT' | 'SYSADMINISTRATOR' | 'MANAGER' |  'OTHER';
terminal ProposalState :
	'PendingProposalState' | 'AcceptedProposalState' | 'RejectedProposalState';

terminal ParameterKind :
				 'ANONYMOUS' |  'VISIBLE';

terminal SelectionCriteriaType :
				'EXPERTISELEVEL' |  'EXPERTISEDOMAIN' | 'INVOLVEMENT';

terminal ProcessKind :
			 'CONSENSUS' |  'MAJORITY' |  'VOTING';

terminal EvaluationKind :
			 'YESNO' |  'RATING' |  'RANKING';

terminal AgreementThreshold :
				 'LOW' |  'MEDIUM' |  'HIGH' | 'CUSTOM';
terminal Severity :
			'LOW' |  'MEDIUM' | 'HIGH';

terminal VulnerabilityReference :
				'CVE' |'CWE' |'NIST' | 'OWASP' | 'OTHER';

terminal ThreatReference :
			 'CAPEC' | 'ATTACK' | 'OTHER';

terminal AgreementType :
			'APPROVED' |'REJECTED' |  'TOBEREVISED';

terminal ChangeType:
			'ADDEDELT' |  'DELETEDELT' |  'MODIFIEDELT';
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;