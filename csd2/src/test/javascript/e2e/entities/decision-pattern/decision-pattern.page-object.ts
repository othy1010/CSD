import { element, by, ElementFinder } from 'protractor';

export class DecisionPatternComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-decision-pattern div table .btn-danger'));
  title = element.all(by.css('jhi-decision-pattern div h2#page-heading span')).first();
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

export class DecisionPatternUpdatePage {
  pageTitle = element(by.id('jhi-decision-pattern-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));

  participationMethodSelect = element(by.id('field_participationMethod'));
  codecisionMethodSelect = element(by.id('field_codecisionMethod'));
  intentSelect = element(by.id('field_intent'));
  solutionSelect = element(by.id('field_solution'));
  applicationSelect = element(by.id('field_application'));
  knowuseSelect = element(by.id('field_knowuse'));

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

  async participationMethodSelectLastOption(): Promise<void> {
    await this.participationMethodSelect.all(by.tagName('option')).last().click();
  }

  async participationMethodSelectOption(option: string): Promise<void> {
    await this.participationMethodSelect.sendKeys(option);
  }

  getParticipationMethodSelect(): ElementFinder {
    return this.participationMethodSelect;
  }

  async getParticipationMethodSelectedOption(): Promise<string> {
    return await this.participationMethodSelect.element(by.css('option:checked')).getText();
  }

  async codecisionMethodSelectLastOption(): Promise<void> {
    await this.codecisionMethodSelect.all(by.tagName('option')).last().click();
  }

  async codecisionMethodSelectOption(option: string): Promise<void> {
    await this.codecisionMethodSelect.sendKeys(option);
  }

  getCodecisionMethodSelect(): ElementFinder {
    return this.codecisionMethodSelect;
  }

  async getCodecisionMethodSelectedOption(): Promise<string> {
    return await this.codecisionMethodSelect.element(by.css('option:checked')).getText();
  }

  async intentSelectLastOption(): Promise<void> {
    await this.intentSelect.all(by.tagName('option')).last().click();
  }

  async intentSelectOption(option: string): Promise<void> {
    await this.intentSelect.sendKeys(option);
  }

  getIntentSelect(): ElementFinder {
    return this.intentSelect;
  }

  async getIntentSelectedOption(): Promise<string> {
    return await this.intentSelect.element(by.css('option:checked')).getText();
  }

  async solutionSelectLastOption(): Promise<void> {
    await this.solutionSelect.all(by.tagName('option')).last().click();
  }

  async solutionSelectOption(option: string): Promise<void> {
    await this.solutionSelect.sendKeys(option);
  }

  getSolutionSelect(): ElementFinder {
    return this.solutionSelect;
  }

  async getSolutionSelectedOption(): Promise<string> {
    return await this.solutionSelect.element(by.css('option:checked')).getText();
  }

  async applicationSelectLastOption(): Promise<void> {
    await this.applicationSelect.all(by.tagName('option')).last().click();
  }

  async applicationSelectOption(option: string): Promise<void> {
    await this.applicationSelect.sendKeys(option);
  }

  getApplicationSelect(): ElementFinder {
    return this.applicationSelect;
  }

  async getApplicationSelectedOption(): Promise<string> {
    return await this.applicationSelect.element(by.css('option:checked')).getText();
  }

  async knowuseSelectLastOption(): Promise<void> {
    await this.knowuseSelect.all(by.tagName('option')).last().click();
  }

  async knowuseSelectOption(option: string): Promise<void> {
    await this.knowuseSelect.sendKeys(option);
  }

  getKnowuseSelect(): ElementFinder {
    return this.knowuseSelect;
  }

  async getKnowuseSelectedOption(): Promise<string> {
    return await this.knowuseSelect.element(by.css('option:checked')).getText();
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

export class DecisionPatternDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-decisionPattern-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-decisionPattern'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
