import { element, by, ElementFinder } from 'protractor';

export class RiskComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-risk div table .btn-danger'));
  title = element.all(by.css('jhi-risk div h2#page-heading span')).first();
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

export class RiskUpdatePage {
  pageTitle = element(by.id('jhi-risk-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));
  probabilityInput = element(by.id('field_probability'));
  impactSeveritySelect = element(by.id('field_impactSeverity'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setProbabilityInput(probability: string): Promise<void> {
    await this.probabilityInput.sendKeys(probability);
  }

  async getProbabilityInput(): Promise<string> {
    return await this.probabilityInput.getAttribute('value');
  }

  async setImpactSeveritySelect(impactSeverity: string): Promise<void> {
    await this.impactSeveritySelect.sendKeys(impactSeverity);
  }

  async getImpactSeveritySelect(): Promise<string> {
    return await this.impactSeveritySelect.element(by.css('option:checked')).getText();
  }

  async impactSeveritySelectLastOption(): Promise<void> {
    await this.impactSeveritySelect.all(by.tagName('option')).last().click();
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

export class RiskDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-risk-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-risk'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
