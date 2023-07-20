import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CodecisionMethodComponentsPage, CodecisionMethodDeleteDialog, CodecisionMethodUpdatePage } from './codecision-method.page-object';

const expect = chai.expect;

describe('CodecisionMethod e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let codecisionMethodComponentsPage: CodecisionMethodComponentsPage;
  let codecisionMethodUpdatePage: CodecisionMethodUpdatePage;
  let codecisionMethodDeleteDialog: CodecisionMethodDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load CodecisionMethods', async () => {
    await navBarPage.goToEntity('codecision-method');
    codecisionMethodComponentsPage = new CodecisionMethodComponentsPage();
    await browser.wait(ec.visibilityOf(codecisionMethodComponentsPage.title), 5000);
    expect(await codecisionMethodComponentsPage.getTitle()).to.eq('csdApp.codecisionMethod.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(codecisionMethodComponentsPage.entities), ec.visibilityOf(codecisionMethodComponentsPage.noResult)),
      1000
    );
  });

  it('should load create CodecisionMethod page', async () => {
    await codecisionMethodComponentsPage.clickOnCreateButton();
    codecisionMethodUpdatePage = new CodecisionMethodUpdatePage();
    expect(await codecisionMethodUpdatePage.getPageTitle()).to.eq('csdApp.codecisionMethod.home.createOrEditLabel');
    await codecisionMethodUpdatePage.cancel();
  });

  it('should create and save CodecisionMethods', async () => {
    const nbButtonsBeforeCreate = await codecisionMethodComponentsPage.countDeleteButtons();

    await codecisionMethodComponentsPage.clickOnCreateButton();

    await promise.all([
      codecisionMethodUpdatePage.processKindSelectLastOption(),
      codecisionMethodUpdatePage.evaluationKindSelectLastOption(),
      codecisionMethodUpdatePage.agreementThresholdSelectLastOption(),
    ]);

    await codecisionMethodUpdatePage.save();
    expect(await codecisionMethodUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await codecisionMethodComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last CodecisionMethod', async () => {
    const nbButtonsBeforeDelete = await codecisionMethodComponentsPage.countDeleteButtons();
    await codecisionMethodComponentsPage.clickOnLastDeleteButton();

    codecisionMethodDeleteDialog = new CodecisionMethodDeleteDialog();
    expect(await codecisionMethodDeleteDialog.getDialogTitle()).to.eq('csdApp.codecisionMethod.delete.question');
    await codecisionMethodDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(codecisionMethodComponentsPage.title), 5000);

    expect(await codecisionMethodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
