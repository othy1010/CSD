import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { InvolvedUserFormService, InvolvedUserFormGroup } from './involved-user-form.service';
import { IInvolvedUser } from '../involved-user.model';
import { InvolvedUserService } from '../service/involved-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { UserRole } from 'app/entities/enumerations/user-role.model';

@Component({
  selector: 'csdinvolved-user-update',
  templateUrl: './involved-user-update.component.html',
})
export class InvolvedUserUpdateComponent implements OnInit {
  isSaving = false;
  involvedUser: IInvolvedUser | null = null;
  userRoleValues = Object.keys(UserRole);

  usersSharedCollection: IUser[] = [];

  editForm: InvolvedUserFormGroup = this.involvedUserFormService.createInvolvedUserFormGroup();

  constructor(
    protected involvedUserService: InvolvedUserService,
    protected involvedUserFormService: InvolvedUserFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ involvedUser }) => {
      this.involvedUser = involvedUser;
      if (involvedUser) {
        this.updateForm(involvedUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const involvedUser = this.involvedUserFormService.getInvolvedUser(this.editForm);
    if (involvedUser.id !== null) {
      this.subscribeToSaveResponse(this.involvedUserService.update(involvedUser));
    } else {
      this.subscribeToSaveResponse(this.involvedUserService.create(involvedUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvolvedUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(involvedUser: IInvolvedUser): void {
    this.involvedUser = involvedUser;
    this.involvedUserFormService.resetForm(this.editForm, involvedUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, involvedUser.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.involvedUser?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
