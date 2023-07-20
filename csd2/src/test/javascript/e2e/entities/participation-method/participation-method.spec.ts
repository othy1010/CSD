import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ParticipationMethodComponentsPage,
  /* ParticipationMethodDeleteDialog, */
  ParticipationMethodUpdatePage,
} from './participation-method.page-object';

const expect = chai.expect;

describe('ParticipationMethod e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let participationMethodComponentsPage: ParticipationMethodComponentsPage;
  let participationMethodUpdatePage: ParticipationMethodUpdatePage;
  /* let participationMethodDeleteDialog: ParticipationMethodDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ParticipationMethods', async () => {
    await navBarPage.goToEntity('participation-method');
    participationMethodComponentsPage = new ParticipationMethodComponentsPage();
    await browser.wait(ec.visibilityOf(participationMethodComponentsPage.title), 5000);
    expect(await participationMethodComponentsPage.getTitle()).to.eq('csdApp.participationMethod.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(participationMethodComponentsPage.entities), ec.visibilityOf(participationMethodComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ParticipationMethod page', async () => {
    await participationMethodComponentsPage.clickOnCreateButton();
    participationMethodUpdatePage = new ParticipationMethodUpdatePage();
    expect(await participationMethodUpdatePage.getPageTitle()).to.eq('csdApp.participationMethod.home.createOrEditLabel');
    await participationMethodUpdatePage.cancel();
  });

  /* it('should create and save ParticipationMethods', async () => {
        const nbButtonsBeforeCreate = await participationMethodComponentsPage.countDeleteButtons();

        await participationMethodComponentsPage.clickOnCreateButton();

        await promise.all([
            participationMethodUpdatePage.typeSelectLastOption(),
        ]);

        await participationMethodUpdatePage.save();
        expect(await participationMethodUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await participationMethodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last ParticipationMethod', async () => {
        const nbButtonsBeforeDelete = await participationMethodComponentsPage.countDeleteButtons();
        await participationMethodComponentsPage.clickOnLastDeleteButton();

        participationMethodDeleteDialog = new ParticipationMethodDeleteDialog();
        expect(await participationMethodDeleteDialog.getDialogTitle())
            .to.eq('csdApp.participationMethod.delete.question');
        await participationMethodDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(participationMethodComponentsPage.title), 5000);

        expect(await participationMethodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
