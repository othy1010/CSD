import { element, by, ElementFinder } from 'protractor';

export class DecisionComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-decision div table .btn-danger'));
  title = element.all(by.css('jhi-decision div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class DecisionUpdatePage {
  pageTitle = element(by.id('jhi-decision-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  agreementSelect = element(by.id('field_agreement'));
  commentInput = element(by.id('field_comment'));

  proposalSelect = element(by.id('field_proposal'));
  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAgreementSelect(agreement: string): Promise<void> {
    await this.agreementSelect.sendKeys(agreement);
  }

  async getAgreementSelect(): Promise<string> {
    return await this.agreementSelect.element(by.css('option:checked')).getText();
  }

  async agreementSelectLastOption(): Promise<void> {
    await this.agreementSelect.all(by.tagName('option')).last().click();
  }

  async setCommentInput(comment: string): Promise<void> {
    await this.commentInput.sendKeys(comment);
  }

  async getCommentInput(): Promise<string> {
    return await this.commentInput.getAttribute('value');
  }

  async proposalSelectLastOption(): Promise<void> {
    await this.proposalSelect.all(by.tagName('option')).last().click();
  }

  async proposalSelectOption(option: string): Promise<void> {
    await this.proposalSelect.sendKeys(option);
  }

  getProposalSelect(): ElementFinder {
    return this.proposalSelect;
  }

  async getProposalSelectedOption(): Promise<string> {
    return await this.proposalSelect.element(by.css('option:checked')).getText();
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class DecisionDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-decision-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-decision'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
