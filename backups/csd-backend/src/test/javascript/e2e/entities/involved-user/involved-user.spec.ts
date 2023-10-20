import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  InvolvedUserComponentsPage,
  /* InvolvedUserDeleteDialog, */
  InvolvedUserUpdatePage,
} from './involved-user.page-object';

const expect = chai.expect;

describe('InvolvedUser e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let involvedUserComponentsPage: InvolvedUserComponentsPage;
  let involvedUserUpdatePage: InvolvedUserUpdatePage;
  /* let involvedUserDeleteDialog: InvolvedUserDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load InvolvedUsers', async () => {
    await navBarPage.goToEntity('involved-user');
    involvedUserComponentsPage = new InvolvedUserComponentsPage();
    await browser.wait(ec.visibilityOf(involvedUserComponentsPage.title), 5000);
    expect(await involvedUserComponentsPage.getTitle()).to.eq('csdApp.involvedUser.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(involvedUserComponentsPage.entities), ec.visibilityOf(involvedUserComponentsPage.noResult)),
      1000
    );
  });

  it('should load create InvolvedUser page', async () => {
    await involvedUserComponentsPage.clickOnCreateButton();
    involvedUserUpdatePage = new InvolvedUserUpdatePage();
    expect(await involvedUserUpdatePage.getPageTitle()).to.eq('csdApp.involvedUser.home.createOrEditLabel');
    await involvedUserUpdatePage.cancel();
  });

  /* it('should create and save InvolvedUsers', async () => {
        const nbButtonsBeforeCreate = await involvedUserComponentsPage.countDeleteButtons();

        await involvedUserComponentsPage.clickOnCreateButton();

        await promise.all([
            involvedUserUpdatePage.setExpertiseLevelInput('5'),
            involvedUserUpdatePage.userRoleSelectLastOption(),
            involvedUserUpdatePage.getIsModeratorInput().click(),
            involvedUserUpdatePage.getIsEligibleDMInput().click(),
            involvedUserUpdatePage.userSelectLastOption(),
        ]);

        await involvedUserUpdatePage.save();
        expect(await involvedUserUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await involvedUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last InvolvedUser', async () => {
        const nbButtonsBeforeDelete = await involvedUserComponentsPage.countDeleteButtons();
        await involvedUserComponentsPage.clickOnLastDeleteButton();

        involvedUserDeleteDialog = new InvolvedUserDeleteDialog();
        expect(await involvedUserDeleteDialog.getDialogTitle())
            .to.eq('csdApp.involvedUser.delete.question');
        await involvedUserDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(involvedUserComponentsPage.title), 5000);

        expect(await involvedUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
