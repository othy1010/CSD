import { element, by, ElementFinder } from 'protractor';

export class ParameterComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-parameter div table .btn-danger'));
  title = element.all(by.css('jhi-parameter div h2#page-heading span')).first();
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

export class ParameterUpdatePage {
  pageTitle = element(by.id('jhi-parameter-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  kindSelect = element(by.id('field_kind'));

  participationMethodSelect = element(by.id('field_participationMethod'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setKindSelect(kind: string): Promise<void> {
    await this.kindSelect.sendKeys(kind);
  }

  async getKindSelect(): Promise<string> {
    return await this.kindSelect.element(by.css('option:checked')).getText();
  }

  async kindSelectLastOption(): Promise<void> {
    await this.kindSelect.all(by.tagName('option')).last().click();
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

export class ParameterDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-parameter-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-parameter'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
