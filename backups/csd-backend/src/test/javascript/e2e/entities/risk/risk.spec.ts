import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RiskComponentsPage, RiskDeleteDialog, RiskUpdatePage } from './risk.page-object';

const expect = chai.expect;

describe('Risk e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let riskComponentsPage: RiskComponentsPage;
  let riskUpdatePage: RiskUpdatePage;
  let riskDeleteDialog: RiskDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Risks', async () => {
    await navBarPage.goToEntity('risk');
    riskComponentsPage = new RiskComponentsPage();
    await browser.wait(ec.visibilityOf(riskComponentsPage.title), 5000);
    expect(await riskComponentsPage.getTitle()).to.eq('csdApp.risk.home.title');
    await browser.wait(ec.or(ec.visibilityOf(riskComponentsPage.entities), ec.visibilityOf(riskComponentsPage.noResult)), 1000);
  });

  it('should load create Risk page', async () => {
    await riskComponentsPage.clickOnCreateButton();
    riskUpdatePage = new RiskUpdatePage();
    expect(await riskUpdatePage.getPageTitle()).to.eq('csdApp.risk.home.createOrEditLabel');
    await riskUpdatePage.cancel();
  });

  it('should create and save Risks', async () => {
    const nbButtonsBeforeCreate = await riskComponentsPage.countDeleteButtons();

    await riskComponentsPage.clickOnCreateButton();

    await promise.all([
      riskUpdatePage.setNameInput('name'),
      riskUpdatePage.setDescriptionInput('description'),
      riskUpdatePage.setProbabilityInput('5'),
      riskUpdatePage.impactSeveritySelectLastOption(),
    ]);

    await riskUpdatePage.save();
    expect(await riskUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await riskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Risk', async () => {
    const nbButtonsBeforeDelete = await riskComponentsPage.countDeleteButtons();
    await riskComponentsPage.clickOnLastDeleteButton();

    riskDeleteDialog = new RiskDeleteDialog();
    expect(await riskDeleteDialog.getDialogTitle()).to.eq('csdApp.risk.delete.question');
    await riskDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(riskComponentsPage.title), 5000);

    expect(await riskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
