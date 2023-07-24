import { element, by, ElementFinder } from 'protractor';

export class MitigationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-mitigation div table .btn-danger'));
  title = element.all(by.css('jhi-mitigation div h2#page-heading span')).first();
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

export class MitigationUpdatePage {
  pageTitle = element(by.id('jhi-mitigation-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));

  vulnerabilitySelect = element(by.id('field_vulnerability'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async vulnerabilitySelectLastOption(): Promise<void> {
    await this.vulnerabilitySelect.all(by.tagName('option')).last().click();
  }

  async vulnerabilitySelectOption(option: string): Promise<void> {
    await this.vulnerabilitySelect.sendKeys(option);
  }

  getVulnerabilitySelect(): ElementFinder {
    return this.vulnerabilitySelect;
  }

  async getVulnerabilitySelectedOption(): Promise<string> {
    return await this.vulnerabilitySelect.element(by.css('option:checked')).getText();
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

export class MitigationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-mitigation-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-mitigation'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
