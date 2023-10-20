import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  MitigationComponentsPage,
  /* MitigationDeleteDialog, */
  MitigationUpdatePage,
} from './mitigation.page-object';

const expect = chai.expect;

describe('Mitigation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let mitigationComponentsPage: MitigationComponentsPage;
  let mitigationUpdatePage: MitigationUpdatePage;
  /* let mitigationDeleteDialog: MitigationDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Mitigations', async () => {
    await navBarPage.goToEntity('mitigation');
    mitigationComponentsPage = new MitigationComponentsPage();
    await browser.wait(ec.visibilityOf(mitigationComponentsPage.title), 5000);
    expect(await mitigationComponentsPage.getTitle()).to.eq('csdApp.mitigation.home.title');
    await browser.wait(ec.or(ec.visibilityOf(mitigationComponentsPage.entities), ec.visibilityOf(mitigationComponentsPage.noResult)), 1000);
  });

  it('should load create Mitigation page', async () => {
    await mitigationComponentsPage.clickOnCreateButton();
    mitigationUpdatePage = new MitigationUpdatePage();
    expect(await mitigationUpdatePage.getPageTitle()).to.eq('csdApp.mitigation.home.createOrEditLabel');
    await mitigationUpdatePage.cancel();
  });

  /* it('should create and save Mitigations', async () => {
        const nbButtonsBeforeCreate = await mitigationComponentsPage.countDeleteButtons();

        await mitigationComponentsPage.clickOnCreateButton();

        await promise.all([
            // mitigationUpdatePage.vulnerabilitySelectLastOption(),
        ]);

        await mitigationUpdatePage.save();
        expect(await mitigationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await mitigationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Mitigation', async () => {
        const nbButtonsBeforeDelete = await mitigationComponentsPage.countDeleteButtons();
        await mitigationComponentsPage.clickOnLastDeleteButton();

        mitigationDeleteDialog = new MitigationDeleteDialog();
        expect(await mitigationDeleteDialog.getDialogTitle())
            .to.eq('csdApp.mitigation.delete.question');
        await mitigationDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(mitigationComponentsPage.title), 5000);

        expect(await mitigationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
