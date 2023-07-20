import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParticipationMethod } from '../participation-method.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../participation-method.test-samples';

import { ParticipationMethodService } from './participation-method.service';

const requireRestSample: IParticipationMethod = {
  ...sampleWithRequiredData,
};

describe('ParticipationMethod Service', () => {
  let service: ParticipationMethodService;
  let httpMock: HttpTestingController;
  let expectedResult: IParticipationMethod | IParticipationMethod[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParticipationMethodService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ParticipationMethod', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const participationMethod = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(participationMethod).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParticipationMethod', () => {
      const participationMethod = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(participationMethod).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ParticipationMethod', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ParticipationMethod', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ParticipationMethod', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addParticipationMethodToCollectionIfMissing', () => {
      it('should add a ParticipationMethod to an empty array', () => {
        const participationMethod: IParticipationMethod = sampleWithRequiredData;
        expectedResult = service.addParticipationMethodToCollectionIfMissing([], participationMethod);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(participationMethod);
      });

      it('should not add a ParticipationMethod to an array that contains it', () => {
        const participationMethod: IParticipationMethod = sampleWithRequiredData;
        const participationMethodCollection: IParticipationMethod[] = [
          {
            ...participationMethod,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addParticipationMethodToCollectionIfMissing(participationMethodCollection, participationMethod);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParticipationMethod to an array that doesn't contain it", () => {
        const participationMethod: IParticipationMethod = sampleWithRequiredData;
        const participationMethodCollection: IParticipationMethod[] = [sampleWithPartialData];
        expectedResult = service.addParticipationMethodToCollectionIfMissing(participationMethodCollection, participationMethod);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(participationMethod);
      });

      it('should add only unique ParticipationMethod to an array', () => {
        const participationMethodArray: IParticipationMethod[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const participationMethodCollection: IParticipationMethod[] = [sampleWithRequiredData];
        expectedResult = service.addParticipationMethodToCollectionIfMissing(participationMethodCollection, ...participationMethodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const participationMethod: IParticipationMethod = sampleWithRequiredData;
        const participationMethod2: IParticipationMethod = sampleWithPartialData;
        expectedResult = service.addParticipationMethodToCollectionIfMissing([], participationMethod, participationMethod2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(participationMethod);
        expect(expectedResult).toContain(participationMethod2);
      });

      it('should accept null and undefined values', () => {
        const participationMethod: IParticipationMethod = sampleWithRequiredData;
        expectedResult = service.addParticipationMethodToCollectionIfMissing([], null, participationMethod, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(participationMethod);
      });

      it('should return initial array if no ParticipationMethod is added', () => {
        const participationMethodCollection: IParticipationMethod[] = [sampleWithRequiredData];
        expectedResult = service.addParticipationMethodToCollectionIfMissing(participationMethodCollection, undefined, null);
        expect(expectedResult).toEqual(participationMethodCollection);
      });
    });

    describe('compareParticipationMethod', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareParticipationMethod(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareParticipationMethod(entity1, entity2);
        const compareResult2 = service.compareParticipationMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareParticipationMethod(entity1, entity2);
        const compareResult2 = service.compareParticipationMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareParticipationMethod(entity1, entity2);
        const compareResult2 = service.compareParticipationMethod(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
