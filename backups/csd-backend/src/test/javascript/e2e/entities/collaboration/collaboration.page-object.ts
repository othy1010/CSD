import { element, by, ElementFinder } from 'protractor';

export class CollaborationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-collaboration div table .btn-danger'));
  title = element.all(by.css('jhi-collaboration div h2#page-heading span')).first();
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

export class CollaborationUpdatePage {
  pageTitle = element(by.id('jhi-collaboration-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));
  startDateInput = element(by.id('field_startDate'));
  decisionDurationInput = element(by.id('field_decisionDuration'));
  evaluationDurationInput = element(by.id('field_evaluationDuration'));
  collaborationStateSelect = element(by.id('field_collaborationState'));

  decisionPatternSelect = element(by.id('field_decisionPattern'));

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

  async setStartDateInput(startDate: string): Promise<void> {
    await this.startDateInput.sendKeys(startDate);
  }

  async getStartDateInput(): Promise<string> {
    return await this.startDateInput.getAttribute('value');
  }

  async setDecisionDurationInput(decisionDuration: string): Promise<void> {
    await this.decisionDurationInput.sendKeys(decisionDuration);
  }

  async getDecisionDurationInput(): Promise<string> {
    return await this.decisionDurationInput.getAttribute('value');
  }

  async setEvaluationDurationInput(evaluationDuration: string): Promise<void> {
    await this.evaluationDurationInput.sendKeys(evaluationDuration);
  }

  async getEvaluationDurationInput(): Promise<string> {
    return await this.evaluationDurationInput.getAttribute('value');
  }

  async setCollaborationStateSelect(collaborationState: string): Promise<void> {
    await this.collaborationStateSelect.sendKeys(collaborationState);
  }

  async getCollaborationStateSelect(): Promise<string> {
    return await this.collaborationStateSelect.element(by.css('option:checked')).getText();
  }

  async collaborationStateSelectLastOption(): Promise<void> {
    await this.collaborationStateSelect.all(by.tagName('option')).last().click();
  }

  async decisionPatternSelectLastOption(): Promise<void> {
    await this.decisionPatternSelect.all(by.tagName('option')).last().click();
  }

  async decisionPatternSelectOption(option: string): Promise<void> {
    await this.decisionPatternSelect.sendKeys(option);
  }

  getDecisionPatternSelect(): ElementFinder {
    return this.decisionPatternSelect;
  }

  async getDecisionPatternSelectedOption(): Promise<string> {
    return await this.decisionPatternSelect.element(by.css('option:checked')).getText();
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

export class CollaborationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-collaboration-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-collaboration'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
