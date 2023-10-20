import { element, by, ElementFinder } from 'protractor';

export class InvolvedUserComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-involved-user div table .btn-danger'));
  title = element.all(by.css('jhi-involved-user div h2#page-heading span')).first();
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

export class InvolvedUserUpdatePage {
  pageTitle = element(by.id('jhi-involved-user-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  expertiseLevelInput = element(by.id('field_expertiseLevel'));
  userRoleSelect = element(by.id('field_userRole'));
  isModeratorInput = element(by.id('field_isModerator'));
  isEligibleDMInput = element(by.id('field_isEligibleDM'));

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

  async setExpertiseLevelInput(expertiseLevel: string): Promise<void> {
    await this.expertiseLevelInput.sendKeys(expertiseLevel);
  }

  async getExpertiseLevelInput(): Promise<string> {
    return await this.expertiseLevelInput.getAttribute('value');
  }

  async setUserRoleSelect(userRole: string): Promise<void> {
    await this.userRoleSelect.sendKeys(userRole);
  }

  async getUserRoleSelect(): Promise<string> {
    return await this.userRoleSelect.element(by.css('option:checked')).getText();
  }

  async userRoleSelectLastOption(): Promise<void> {
    await this.userRoleSelect.all(by.tagName('option')).last().click();
  }

  getIsModeratorInput(): ElementFinder {
    return this.isModeratorInput;
  }

  getIsEligibleDMInput(): ElementFinder {
    return this.isEligibleDMInput;
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

export class InvolvedUserDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-involvedUser-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-involvedUser'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
