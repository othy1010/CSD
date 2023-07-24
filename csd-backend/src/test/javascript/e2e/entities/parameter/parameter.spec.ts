import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ParameterComponentsPage, ParameterDeleteDialog, ParameterUpdatePage } from './parameter.page-object';

const expect = chai.expect;

describe('Parameter e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let parameterComponentsPage: ParameterComponentsPage;
  let parameterUpdatePage: ParameterUpdatePage;
  let parameterDeleteDialog: ParameterDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Parameters', async () => {
    await navBarPage.goToEntity('parameter');
    parameterComponentsPage = new ParameterComponentsPage();
    await browser.wait(ec.visibilityOf(parameterComponentsPage.title), 5000);
    expect(await parameterComponentsPage.getTitle()).to.eq('csdApp.parameter.home.title');
    await browser.wait(ec.or(ec.visibilityOf(parameterComponentsPage.entities), ec.visibilityOf(parameterComponentsPage.noResult)), 1000);
  });

  it('should load create Parameter page', async () => {
    await parameterComponentsPage.clickOnCreateButton();
    parameterUpdatePage = new ParameterUpdatePage();
    expect(await parameterUpdatePage.getPageTitle()).to.eq('csdApp.parameter.home.createOrEditLabel');
    await parameterUpdatePage.cancel();
  });

  it('should create and save Parameters', async () => {
    const nbButtonsBeforeCreate = await parameterComponentsPage.countDeleteButtons();

    await parameterComponentsPage.clickOnCreateButton();

    await promise.all([parameterUpdatePage.kindSelectLastOption(), parameterUpdatePage.participationMethodSelectLastOption()]);

    await parameterUpdatePage.save();
    expect(await parameterUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await parameterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Parameter', async () => {
    const nbButtonsBeforeDelete = await parameterComponentsPage.countDeleteButtons();
    await parameterComponentsPage.clickOnLastDeleteButton();

    parameterDeleteDialog = new ParameterDeleteDialog();
    expect(await parameterDeleteDialog.getDialogTitle()).to.eq('csdApp.parameter.delete.question');
    await parameterDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(parameterComponentsPage.title), 5000);

    expect(await parameterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
