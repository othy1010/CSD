import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InvolvedUserFormService } from './involved-user-form.service';
import { InvolvedUserService } from '../service/involved-user.service';
import { IInvolvedUser } from '../involved-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { InvolvedUserUpdateComponent } from './involved-user-update.component';

describe('InvolvedUser Management Update Component', () => {
  let comp: InvolvedUserUpdateComponent;
  let fixture: ComponentFixture<InvolvedUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let involvedUserFormService: InvolvedUserFormService;
  let involvedUserService: InvolvedUserService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InvolvedUserUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InvolvedUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvolvedUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    involvedUserFormService = TestBed.inject(InvolvedUserFormService);
    involvedUserService = TestBed.inject(InvolvedUserService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const involvedUser: IInvolvedUser = { id: 456 };
      const user: IUser = { id: 29037 };
      involvedUser.user = user;

      const userCollection: IUser[] = [{ id: 16220 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ involvedUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const involvedUser: IInvolvedUser = { id: 456 };
      const user: IUser = { id: 41526 };
      involvedUser.user = user;

      activatedRoute.data = of({ involvedUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.involvedUser).toEqual(involvedUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvolvedUser>>();
      const involvedUser = { id: 123 };
      jest.spyOn(involvedUserFormService, 'getInvolvedUser').mockReturnValue(involvedUser);
      jest.spyOn(involvedUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ involvedUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: involvedUser }));
      saveSubject.complete();

      // THEN
      expect(involvedUserFormService.getInvolvedUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(involvedUserService.update).toHaveBeenCalledWith(expect.objectContaining(involvedUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvolvedUser>>();
      const involvedUser = { id: 123 };
      jest.spyOn(involvedUserFormService, 'getInvolvedUser').mockReturnValue({ id: null });
      jest.spyOn(involvedUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ involvedUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: involvedUser }));
      saveSubject.complete();

      // THEN
      expect(involvedUserFormService.getInvolvedUser).toHaveBeenCalled();
      expect(involvedUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvolvedUser>>();
      const involvedUser = { id: 123 };
      jest.spyOn(involvedUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ involvedUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(involvedUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
