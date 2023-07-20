import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { KnowuseComponentsPage, KnowuseDeleteDialog, KnowuseUpdatePage } from './knowuse.page-object';

const expect = chai.expect;

describe('Knowuse e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let knowuseComponentsPage: KnowuseComponentsPage;
  let knowuseUpdatePage: KnowuseUpdatePage;
  let knowuseDeleteDialog: KnowuseDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Knowuses', async () => {
    await navBarPage.goToEntity('knowuse');
    knowuseComponentsPage = new KnowuseComponentsPage();
    await browser.wait(ec.visibilityOf(knowuseComponentsPage.title), 5000);
    expect(await knowuseComponentsPage.getTitle()).to.eq('csdApp.knowuse.home.title');
    await browser.wait(ec.or(ec.visibilityOf(knowuseComponentsPage.entities), ec.visibilityOf(knowuseComponentsPage.noResult)), 1000);
  });

  it('should load create Knowuse page', async () => {
    await knowuseComponentsPage.clickOnCreateButton();
    knowuseUpdatePage = new KnowuseUpdatePage();
    expect(await knowuseUpdatePage.getPageTitle()).to.eq('csdApp.knowuse.home.createOrEditLabel');
    await knowuseUpdatePage.cancel();
  });

  it('should create and save Knowuses', async () => {
    const nbButtonsBeforeCreate = await knowuseComponentsPage.countDeleteButtons();

    await knowuseComponentsPage.clickOnCreateButton();

    await promise.all([knowuseUpdatePage.setNameInput('name'), knowuseUpdatePage.setDescriptionInput('description')]);

    await knowuseUpdatePage.save();
    expect(await knowuseUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await knowuseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Knowuse', async () => {
    const nbButtonsBeforeDelete = await knowuseComponentsPage.countDeleteButtons();
    await knowuseComponentsPage.clickOnLastDeleteButton();

    knowuseDeleteDialog = new KnowuseDeleteDialog();
    expect(await knowuseDeleteDialog.getDialogTitle()).to.eq('csdApp.knowuse.delete.question');
    await knowuseDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(knowuseComponentsPage.title), 5000);

    expect(await knowuseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
