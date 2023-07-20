import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ApplicationComponentsPage, ApplicationDeleteDialog, ApplicationUpdatePage } from './application.page-object';

const expect = chai.expect;

describe('Application e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let applicationComponentsPage: ApplicationComponentsPage;
  let applicationUpdatePage: ApplicationUpdatePage;
  let applicationDeleteDialog: ApplicationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Applications', async () => {
    await navBarPage.goToEntity('application');
    applicationComponentsPage = new ApplicationComponentsPage();
    await browser.wait(ec.visibilityOf(applicationComponentsPage.title), 5000);
    expect(await applicationComponentsPage.getTitle()).to.eq('csdApp.application.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(applicationComponentsPage.entities), ec.visibilityOf(applicationComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Application page', async () => {
    await applicationComponentsPage.clickOnCreateButton();
    applicationUpdatePage = new ApplicationUpdatePage();
    expect(await applicationUpdatePage.getPageTitle()).to.eq('csdApp.application.home.createOrEditLabel');
    await applicationUpdatePage.cancel();
  });

  it('should create and save Applications', async () => {
    const nbButtonsBeforeCreate = await applicationComponentsPage.countDeleteButtons();

    await applicationComponentsPage.clickOnCreateButton();

    await promise.all([applicationUpdatePage.setNameInput('name'), applicationUpdatePage.setDescriptionInput('description')]);

    await applicationUpdatePage.save();
    expect(await applicationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await applicationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Application', async () => {
    const nbButtonsBeforeDelete = await applicationComponentsPage.countDeleteButtons();
    await applicationComponentsPage.clickOnLastDeleteButton();

    applicationDeleteDialog = new ApplicationDeleteDialog();
    expect(await applicationDeleteDialog.getDialogTitle()).to.eq('csdApp.application.delete.question');
    await applicationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(applicationComponentsPage.title), 5000);

    expect(await applicationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
