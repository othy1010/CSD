import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChangeComponentsPage, ChangeDeleteDialog, ChangeUpdatePage } from './change.page-object';

const expect = chai.expect;

describe('Change e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let changeComponentsPage: ChangeComponentsPage;
  let changeUpdatePage: ChangeUpdatePage;
  let changeDeleteDialog: ChangeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Changes', async () => {
    await navBarPage.goToEntity('change');
    changeComponentsPage = new ChangeComponentsPage();
    await browser.wait(ec.visibilityOf(changeComponentsPage.title), 5000);
    expect(await changeComponentsPage.getTitle()).to.eq('csdApp.change.home.title');
    await browser.wait(ec.or(ec.visibilityOf(changeComponentsPage.entities), ec.visibilityOf(changeComponentsPage.noResult)), 1000);
  });

  it('should load create Change page', async () => {
    await changeComponentsPage.clickOnCreateButton();
    changeUpdatePage = new ChangeUpdatePage();
    expect(await changeUpdatePage.getPageTitle()).to.eq('csdApp.change.home.createOrEditLabel');
    await changeUpdatePage.cancel();
  });

  it('should create and save Changes', async () => {
    const nbButtonsBeforeCreate = await changeComponentsPage.countDeleteButtons();

    await changeComponentsPage.clickOnCreateButton();

    await promise.all([
      changeUpdatePage.typeSelectLastOption(),
      changeUpdatePage.setRefIdInput('refId'),
      changeUpdatePage.proposalSelectLastOption(),
    ]);

    await changeUpdatePage.save();
    expect(await changeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await changeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Change', async () => {
    const nbButtonsBeforeDelete = await changeComponentsPage.countDeleteButtons();
    await changeComponentsPage.clickOnLastDeleteButton();

    changeDeleteDialog = new ChangeDeleteDialog();
    expect(await changeDeleteDialog.getDialogTitle()).to.eq('csdApp.change.delete.question');
    await changeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(changeComponentsPage.title), 5000);

    expect(await changeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
