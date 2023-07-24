import { element, by, ElementFinder } from 'protractor';

export class CodecisionMethodComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-codecision-method div table .btn-danger'));
  title = element.all(by.css('jhi-codecision-method div h2#page-heading span')).first();
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

export class CodecisionMethodUpdatePage {
  pageTitle = element(by.id('jhi-codecision-method-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  processKindSelect = element(by.id('field_processKind'));
  evaluationKindSelect = element(by.id('field_evaluationKind'));
  agreementThresholdSelect = element(by.id('field_agreementThreshold'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setProcessKindSelect(processKind: string): Promise<void> {
    await this.processKindSelect.sendKeys(processKind);
  }

  async getProcessKindSelect(): Promise<string> {
    return await this.processKindSelect.element(by.css('option:checked')).getText();
  }

  async processKindSelectLastOption(): Promise<void> {
    await this.processKindSelect.all(by.tagName('option')).last().click();
  }

  async setEvaluationKindSelect(evaluationKind: string): Promise<void> {
    await this.evaluationKindSelect.sendKeys(evaluationKind);
  }

  async getEvaluationKindSelect(): Promise<string> {
    return await this.evaluationKindSelect.element(by.css('option:checked')).getText();
  }

  async evaluationKindSelectLastOption(): Promise<void> {
    await this.evaluationKindSelect.all(by.tagName('option')).last().click();
  }

  async setAgreementThresholdSelect(agreementThreshold: string): Promise<void> {
    await this.agreementThresholdSelect.sendKeys(agreementThreshold);
  }

  async getAgreementThresholdSelect(): Promise<string> {
    return await this.agreementThresholdSelect.element(by.css('option:checked')).getText();
  }

  async agreementThresholdSelectLastOption(): Promise<void> {
    await this.agreementThresholdSelect.all(by.tagName('option')).last().click();
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

export class CodecisionMethodDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-codecisionMethod-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-codecisionMethod'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
