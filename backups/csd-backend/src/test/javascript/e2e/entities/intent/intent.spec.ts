import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { IntentComponentsPage, IntentDeleteDialog, IntentUpdatePage } from './intent.page-object';

const expect = chai.expect;

describe('Intent e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let intentComponentsPage: IntentComponentsPage;
  let intentUpdatePage: IntentUpdatePage;
  let intentDeleteDialog: IntentDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Intents', async () => {
    await navBarPage.goToEntity('intent');
    intentComponentsPage = new IntentComponentsPage();
    await browser.wait(ec.visibilityOf(intentComponentsPage.title), 5000);
    expect(await intentComponentsPage.getTitle()).to.eq('csdApp.intent.home.title');
    await browser.wait(ec.or(ec.visibilityOf(intentComponentsPage.entities), ec.visibilityOf(intentComponentsPage.noResult)), 1000);
  });

  it('should load create Intent page', async () => {
    await intentComponentsPage.clickOnCreateButton();
    intentUpdatePage = new IntentUpdatePage();
    expect(await intentUpdatePage.getPageTitle()).to.eq('csdApp.intent.home.createOrEditLabel');
    await intentUpdatePage.cancel();
  });

  it('should create and save Intents', async () => {
    const nbButtonsBeforeCreate = await intentComponentsPage.countDeleteButtons();

    await intentComponentsPage.clickOnCreateButton();

    await promise.all([intentUpdatePage.setNameInput('name'), intentUpdatePage.setDescriptionInput('description')]);

    await intentUpdatePage.save();
    expect(await intentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await intentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Intent', async () => {
    const nbButtonsBeforeDelete = await intentComponentsPage.countDeleteButtons();
    await intentComponentsPage.clickOnLastDeleteButton();

    intentDeleteDialog = new IntentDeleteDialog();
    expect(await intentDeleteDialog.getDialogTitle()).to.eq('csdApp.intent.delete.question');
    await intentDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(intentComponentsPage.title), 5000);

    expect(await intentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
