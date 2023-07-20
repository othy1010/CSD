import { element, by, ElementFinder } from 'protractor';

export class ProposalComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-proposal div table .btn-danger'));
  title = element.all(by.css('jhi-proposal div h2#page-heading span')).first();
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

export class ProposalUpdatePage {
  pageTitle = element(by.id('jhi-proposal-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));
  creationDateInput = element(by.id('field_creationDate'));
  proposalStateSelect = element(by.id('field_proposalState'));

  userSelect = element(by.id('field_user'));
  riskSelect = element(by.id('field_risk'));
  collaborationSelect = element(by.id('field_collaboration'));

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

  async setCreationDateInput(creationDate: string): Promise<void> {
    await this.creationDateInput.sendKeys(creationDate);
  }

  async getCreationDateInput(): Promise<string> {
    return await this.creationDateInput.getAttribute('value');
  }

  async setProposalStateSelect(proposalState: string): Promise<void> {
    await this.proposalStateSelect.sendKeys(proposalState);
  }

  async getProposalStateSelect(): Promise<string> {
    return await this.proposalStateSelect.element(by.css('option:checked')).getText();
  }

  async proposalStateSelectLastOption(): Promise<void> {
    await this.proposalStateSelect.all(by.tagName('option')).last().click();
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

  async riskSelectLastOption(): Promise<void> {
    await this.riskSelect.all(by.tagName('option')).last().click();
  }

  async riskSelectOption(option: string): Promise<void> {
    await this.riskSelect.sendKeys(option);
  }

  getRiskSelect(): ElementFinder {
    return this.riskSelect;
  }

  async getRiskSelectedOption(): Promise<string> {
    return await this.riskSelect.element(by.css('option:checked')).getText();
  }

  async collaborationSelectLastOption(): Promise<void> {
    await this.collaborationSelect.all(by.tagName('option')).last().click();
  }

  async collaborationSelectOption(option: string): Promise<void> {
    await this.collaborationSelect.sendKeys(option);
  }

  getCollaborationSelect(): ElementFinder {
    return this.collaborationSelect;
  }

  async getCollaborationSelectedOption(): Promise<string> {
    return await this.collaborationSelect.element(by.css('option:checked')).getText();
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

export class ProposalDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-proposal-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-proposal'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
