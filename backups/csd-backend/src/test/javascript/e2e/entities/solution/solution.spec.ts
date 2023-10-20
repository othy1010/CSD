import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SolutionComponentsPage, SolutionDeleteDialog, SolutionUpdatePage } from './solution.page-object';

const expect = chai.expect;

describe('Solution e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let solutionComponentsPage: SolutionComponentsPage;
  let solutionUpdatePage: SolutionUpdatePage;
  let solutionDeleteDialog: SolutionDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Solutions', async () => {
    await navBarPage.goToEntity('solution');
    solutionComponentsPage = new SolutionComponentsPage();
    await browser.wait(ec.visibilityOf(solutionComponentsPage.title), 5000);
    expect(await solutionComponentsPage.getTitle()).to.eq('csdApp.solution.home.title');
    await browser.wait(ec.or(ec.visibilityOf(solutionComponentsPage.entities), ec.visibilityOf(solutionComponentsPage.noResult)), 1000);
  });

  it('should load create Solution page', async () => {
    await solutionComponentsPage.clickOnCreateButton();
    solutionUpdatePage = new SolutionUpdatePage();
    expect(await solutionUpdatePage.getPageTitle()).to.eq('csdApp.solution.home.createOrEditLabel');
    await solutionUpdatePage.cancel();
  });

  it('should create and save Solutions', async () => {
    const nbButtonsBeforeCreate = await solutionComponentsPage.countDeleteButtons();

    await solutionComponentsPage.clickOnCreateButton();

    await promise.all([solutionUpdatePage.setNameInput('name'), solutionUpdatePage.setDescriptionInput('description')]);

    await solutionUpdatePage.save();
    expect(await solutionUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await solutionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Solution', async () => {
    const nbButtonsBeforeDelete = await solutionComponentsPage.countDeleteButtons();
    await solutionComponentsPage.clickOnLastDeleteButton();

    solutionDeleteDialog = new SolutionDeleteDialog();
    expect(await solutionDeleteDialog.getDialogTitle()).to.eq('csdApp.solution.delete.question');
    await solutionDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(solutionComponentsPage.title), 5000);

    expect(await solutionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
