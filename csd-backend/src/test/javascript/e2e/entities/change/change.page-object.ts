import { element, by, ElementFinder } from 'protractor';

export class ChangeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-change div table .btn-danger'));
  title = element.all(by.css('jhi-change div h2#page-heading span')).first();
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

export class ChangeUpdatePage {
  pageTitle = element(by.id('jhi-change-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  typeSelect = element(by.id('field_type'));
  refIdInput = element(by.id('field_refId'));

  proposalSelect = element(by.id('field_proposal'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setTypeSelect(type: string): Promise<void> {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }

  async setRefIdInput(refId: string): Promise<void> {
    await this.refIdInput.sendKeys(refId);
  }

  async getRefIdInput(): Promise<string> {
    return await this.refIdInput.getAttribute('value');
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

export class ChangeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-change-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-change'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
