import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  SelectionCriteriaComponentsPage,
  SelectionCriteriaDeleteDialog,
  SelectionCriteriaUpdatePage,
} from './selection-criteria.page-object';

const expect = chai.expect;

describe('SelectionCriteria e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let selectionCriteriaComponentsPage: SelectionCriteriaComponentsPage;
  let selectionCriteriaUpdatePage: SelectionCriteriaUpdatePage;
  let selectionCriteriaDeleteDialog: SelectionCriteriaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load SelectionCriteria', async () => {
    await navBarPage.goToEntity('selection-criteria');
    selectionCriteriaComponentsPage = new SelectionCriteriaComponentsPage();
    await browser.wait(ec.visibilityOf(selectionCriteriaComponentsPage.title), 5000);
    expect(await selectionCriteriaComponentsPage.getTitle()).to.eq('csdApp.selectionCriteria.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(selectionCriteriaComponentsPage.entities), ec.visibilityOf(selectionCriteriaComponentsPage.noResult)),
      1000
    );
  });

  it('should load create SelectionCriteria page', async () => {
    await selectionCriteriaComponentsPage.clickOnCreateButton();
    selectionCriteriaUpdatePage = new SelectionCriteriaUpdatePage();
    expect(await selectionCriteriaUpdatePage.getPageTitle()).to.eq('csdApp.selectionCriteria.home.createOrEditLabel');
    await selectionCriteriaUpdatePage.cancel();
  });

  it('should create and save SelectionCriteria', async () => {
    const nbButtonsBeforeCreate = await selectionCriteriaComponentsPage.countDeleteButtons();

    await selectionCriteriaComponentsPage.clickOnCreateButton();

    await promise.all([
      selectionCriteriaUpdatePage.criterionSelectLastOption(),
      selectionCriteriaUpdatePage.participationMethodSelectLastOption(),
    ]);

    await selectionCriteriaUpdatePage.save();
    expect(await selectionCriteriaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await selectionCriteriaComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last SelectionCriteria', async () => {
    const nbButtonsBeforeDelete = await selectionCriteriaComponentsPage.countDeleteButtons();
    await selectionCriteriaComponentsPage.clickOnLastDeleteButton();

    selectionCriteriaDeleteDialog = new SelectionCriteriaDeleteDialog();
    expect(await selectionCriteriaDeleteDialog.getDialogTitle()).to.eq('csdApp.selectionCriteria.delete.question');
    await selectionCriteriaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(selectionCriteriaComponentsPage.title), 5000);

    expect(await selectionCriteriaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
