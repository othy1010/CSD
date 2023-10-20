import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'codecision-method',
        data: { pageTitle: 'csdApp.codecisionMethod.home.title' },
        loadChildren: () => import('./codecision-method/codecision-method.module').then(m => m.CodecisionMethodModule),
      },
      {
        path: 'selection-criteria',
        data: { pageTitle: 'csdApp.selectionCriteria.home.title' },
        loadChildren: () => import('./selection-criteria/selection-criteria.module').then(m => m.SelectionCriteriaModule),
      },
      {
        path: 'involved-user',
        data: { pageTitle: 'csdApp.involvedUser.home.title' },
        loadChildren: () => import('./involved-user/involved-user.module').then(m => m.InvolvedUserModule),
      },
      {
        path: 'collaboration',
        data: { pageTitle: 'csdApp.collaboration.home.title' },
        loadChildren: () => import('./collaboration/collaboration.module').then(m => m.CollaborationModule),
      },
      {
        path: 'parameter',
        data: { pageTitle: 'csdApp.parameter.home.title' },
        loadChildren: () => import('./parameter/parameter.module').then(m => m.ParameterModule),
      },
      {
        path: 'decision',
        data: { pageTitle: 'csdApp.decision.home.title' },
        loadChildren: () => import('./decision/decision.module').then(m => m.DecisionModule),
      },
      {
        path: 'vulnerability',
        data: { pageTitle: 'csdApp.vulnerability.home.title' },
        loadChildren: () => import('./vulnerability/vulnerability.module').then(m => m.VulnerabilityModule),
      },
      {
        path: 'threat',
        data: { pageTitle: 'csdApp.threat.home.title' },
        loadChildren: () => import('./threat/threat.module').then(m => m.ThreatModule),
      },
      {
        path: 'participation-method',
        data: { pageTitle: 'csdApp.participationMethod.home.title' },
        loadChildren: () => import('./participation-method/participation-method.module').then(m => m.ParticipationMethodModule),
      },
      {
        path: 'risk',
        data: { pageTitle: 'csdApp.risk.home.title' },
        loadChildren: () => import('./risk/risk.module').then(m => m.RiskModule),
      },
      {
        path: 'proposal',
        data: { pageTitle: 'csdApp.proposal.home.title' },
        loadChildren: () => import('./proposal/proposal.module').then(m => m.ProposalModule),
      },
      {
        path: 'change',
        data: { pageTitle: 'csdApp.change.home.title' },
        loadChildren: () => import('./change/change.module').then(m => m.ChangeModule),
      },
      {
        path: 'mitigation',
        data: { pageTitle: 'csdApp.mitigation.home.title' },
        loadChildren: () => import('./mitigation/mitigation.module').then(m => m.MitigationModule),
      },
      {
        path: 'intent',
        data: { pageTitle: 'csdApp.intent.home.title' },
        loadChildren: () => import('./intent/intent.module').then(m => m.IntentModule),
      },
      {
        path: 'application',
        data: { pageTitle: 'csdApp.application.home.title' },
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule),
      },
      {
        path: 'knowuse',
        data: { pageTitle: 'csdApp.knowuse.home.title' },
        loadChildren: () => import('./knowuse/knowuse.module').then(m => m.KnowuseModule),
      },
      {
        path: 'solution',
        data: { pageTitle: 'csdApp.solution.home.title' },
        loadChildren: () => import('./solution/solution.module').then(m => m.SolutionModule),
      },
      {
        path: 'decision-pattern',
        data: { pageTitle: 'csdApp.decisionPattern.home.title' },
        loadChildren: () => import('./decision-pattern/decision-pattern.module').then(m => m.DecisionPatternModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
