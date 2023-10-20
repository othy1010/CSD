import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ProposalComponentsPage,
  /* ProposalDeleteDialog, */
  ProposalUpdatePage,
} from './proposal.page-object';

const expect = chai.expect;

describe('Proposal e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let proposalComponentsPage: ProposalComponentsPage;
  let proposalUpdatePage: ProposalUpdatePage;
  /* let proposalDeleteDialog: ProposalDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Proposals', async () => {
    await navBarPage.goToEntity('proposal');
    proposalComponentsPage = new ProposalComponentsPage();
    await browser.wait(ec.visibilityOf(proposalComponentsPage.title), 5000);
    expect(await proposalComponentsPage.getTitle()).to.eq('csdApp.proposal.home.title');
    await browser.wait(ec.or(ec.visibilityOf(proposalComponentsPage.entities), ec.visibilityOf(proposalComponentsPage.noResult)), 1000);
  });

  it('should load create Proposal page', async () => {
    await proposalComponentsPage.clickOnCreateButton();
    proposalUpdatePage = new ProposalUpdatePage();
    expect(await proposalUpdatePage.getPageTitle()).to.eq('csdApp.proposal.home.createOrEditLabel');
    await proposalUpdatePage.cancel();
  });

  /* it('should create and save Proposals', async () => {
        const nbButtonsBeforeCreate = await proposalComponentsPage.countDeleteButtons();

        await proposalComponentsPage.clickOnCreateButton();

        await promise.all([
            proposalUpdatePage.setNameInput('name'),
            proposalUpdatePage.setDescriptionInput('description'),
            proposalUpdatePage.setCreationDateInput('2000-12-31'),
            proposalUpdatePage.proposalStateSelectLastOption(),
            proposalUpdatePage.userSelectLastOption(),
            // proposalUpdatePage.riskSelectLastOption(),
            proposalUpdatePage.collaborationSelectLastOption(),
        ]);

        await proposalUpdatePage.save();
        expect(await proposalUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await proposalComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Proposal', async () => {
        const nbButtonsBeforeDelete = await proposalComponentsPage.countDeleteButtons();
        await proposalComponentsPage.clickOnLastDeleteButton();

        proposalDeleteDialog = new ProposalDeleteDialog();
        expect(await proposalDeleteDialog.getDialogTitle())
            .to.eq('csdApp.proposal.delete.question');
        await proposalDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(proposalComponentsPage.title), 5000);

        expect(await proposalComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
