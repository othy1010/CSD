import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ThreatComponentsPage, ThreatDeleteDialog, ThreatUpdatePage } from './threat.page-object';

const expect = chai.expect;

describe('Threat e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let threatComponentsPage: ThreatComponentsPage;
  let threatUpdatePage: ThreatUpdatePage;
  let threatDeleteDialog: ThreatDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Threats', async () => {
    await navBarPage.goToEntity('threat');
    threatComponentsPage = new ThreatComponentsPage();
    await browser.wait(ec.visibilityOf(threatComponentsPage.title), 5000);
    expect(await threatComponentsPage.getTitle()).to.eq('csdApp.threat.home.title');
    await browser.wait(ec.or(ec.visibilityOf(threatComponentsPage.entities), ec.visibilityOf(threatComponentsPage.noResult)), 1000);
  });

  it('should load create Threat page', async () => {
    await threatComponentsPage.clickOnCreateButton();
    threatUpdatePage = new ThreatUpdatePage();
    expect(await threatUpdatePage.getPageTitle()).to.eq('csdApp.threat.home.createOrEditLabel');
    await threatUpdatePage.cancel();
  });

  it('should create and save Threats', async () => {
    const nbButtonsBeforeCreate = await threatComponentsPage.countDeleteButtons();

    await threatComponentsPage.clickOnCreateButton();

    await promise.all([
      threatUpdatePage.setNameInput('name'),
      threatUpdatePage.setDescriptionInput('description'),
      threatUpdatePage.setProbabilityInput('5'),
      threatUpdatePage.referenceSelectLastOption(),
      threatUpdatePage.setRefIdInput('refId'),
      // threatUpdatePage.vulnerabilitySelectLastOption(),
    ]);

    await threatUpdatePage.save();
    expect(await threatUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await threatComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Threat', async () => {
    const nbButtonsBeforeDelete = await threatComponentsPage.countDeleteButtons();
    await threatComponentsPage.clickOnLastDeleteButton();

    threatDeleteDialog = new ThreatDeleteDialog();
    expect(await threatDeleteDialog.getDialogTitle()).to.eq('csdApp.threat.delete.question');
    await threatDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(threatComponentsPage.title), 5000);

    expect(await threatComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
