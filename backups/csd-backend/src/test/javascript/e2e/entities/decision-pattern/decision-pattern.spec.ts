import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  DecisionPatternComponentsPage,
  /* DecisionPatternDeleteDialog, */
  DecisionPatternUpdatePage,
} from './decision-pattern.page-object';

const expect = chai.expect;

describe('DecisionPattern e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let decisionPatternComponentsPage: DecisionPatternComponentsPage;
  let decisionPatternUpdatePage: DecisionPatternUpdatePage;
  /* let decisionPatternDeleteDialog: DecisionPatternDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load DecisionPatterns', async () => {
    await navBarPage.goToEntity('decision-pattern');
    decisionPatternComponentsPage = new DecisionPatternComponentsPage();
    await browser.wait(ec.visibilityOf(decisionPatternComponentsPage.title), 5000);
    expect(await decisionPatternComponentsPage.getTitle()).to.eq('csdApp.decisionPattern.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(decisionPatternComponentsPage.entities), ec.visibilityOf(decisionPatternComponentsPage.noResult)),
      1000
    );
  });

  it('should load create DecisionPattern page', async () => {
    await decisionPatternComponentsPage.clickOnCreateButton();
    decisionPatternUpdatePage = new DecisionPatternUpdatePage();
    expect(await decisionPatternUpdatePage.getPageTitle()).to.eq('csdApp.decisionPattern.home.createOrEditLabel');
    await decisionPatternUpdatePage.cancel();
  });

  /* it('should create and save DecisionPatterns', async () => {
        const nbButtonsBeforeCreate = await decisionPatternComponentsPage.countDeleteButtons();

        await decisionPatternComponentsPage.clickOnCreateButton();

        await promise.all([
            decisionPatternUpdatePage.setNameInput('name'),
            decisionPatternUpdatePage.setDescriptionInput('description'),
            decisionPatternUpdatePage.participationMethodSelectLastOption(),
            decisionPatternUpdatePage.codecisionMethodSelectLastOption(),
            decisionPatternUpdatePage.intentSelectLastOption(),
            decisionPatternUpdatePage.solutionSelectLastOption(),
            decisionPatternUpdatePage.applicationSelectLastOption(),
            decisionPatternUpdatePage.knowuseSelectLastOption(),
        ]);

        await decisionPatternUpdatePage.save();
        expect(await decisionPatternUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await decisionPatternComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last DecisionPattern', async () => {
        const nbButtonsBeforeDelete = await decisionPatternComponentsPage.countDeleteButtons();
        await decisionPatternComponentsPage.clickOnLastDeleteButton();

        decisionPatternDeleteDialog = new DecisionPatternDeleteDialog();
        expect(await decisionPatternDeleteDialog.getDialogTitle())
            .to.eq('csdApp.decisionPattern.delete.question');
        await decisionPatternDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(decisionPatternComponentsPage.title), 5000);

        expect(await decisionPatternComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
