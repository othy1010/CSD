import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CollaborationComponentsPage, CollaborationDeleteDialog, CollaborationUpdatePage } from './collaboration.page-object';

const expect = chai.expect;

describe('Collaboration e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let collaborationComponentsPage: CollaborationComponentsPage;
  let collaborationUpdatePage: CollaborationUpdatePage;
  let collaborationDeleteDialog: CollaborationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Collaborations', async () => {
    await navBarPage.goToEntity('collaboration');
    collaborationComponentsPage = new CollaborationComponentsPage();
    await browser.wait(ec.visibilityOf(collaborationComponentsPage.title), 5000);
    expect(await collaborationComponentsPage.getTitle()).to.eq('csdApp.collaboration.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(collaborationComponentsPage.entities), ec.visibilityOf(collaborationComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Collaboration page', async () => {
    await collaborationComponentsPage.clickOnCreateButton();
    collaborationUpdatePage = new CollaborationUpdatePage();
    expect(await collaborationUpdatePage.getPageTitle()).to.eq('csdApp.collaboration.home.createOrEditLabel');
    await collaborationUpdatePage.cancel();
  });

  it('should create and save Collaborations', async () => {
    const nbButtonsBeforeCreate = await collaborationComponentsPage.countDeleteButtons();

    await collaborationComponentsPage.clickOnCreateButton();

    await promise.all([
      collaborationUpdatePage.setNameInput('name'),
      collaborationUpdatePage.setDescriptionInput('description'),
      collaborationUpdatePage.setStartDateInput('2000-12-31'),
      collaborationUpdatePage.setDecisionDurationInput('5'),
      collaborationUpdatePage.setEvaluationDurationInput('5'),
      collaborationUpdatePage.collaborationStateSelectLastOption(),
      collaborationUpdatePage.decisionPatternSelectLastOption(),
    ]);

    await collaborationUpdatePage.save();
    expect(await collaborationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await collaborationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Collaboration', async () => {
    const nbButtonsBeforeDelete = await collaborationComponentsPage.countDeleteButtons();
    await collaborationComponentsPage.clickOnLastDeleteButton();

    collaborationDeleteDialog = new CollaborationDeleteDialog();
    expect(await collaborationDeleteDialog.getDialogTitle()).to.eq('csdApp.collaboration.delete.question');
    await collaborationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(collaborationComponentsPage.title), 5000);

    expect(await collaborationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
