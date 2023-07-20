import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMitigation } from '../mitigation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mitigation.test-samples';

import { MitigationService } from './mitigation.service';

const requireRestSample: IMitigation = {
  ...sampleWithRequiredData,
};

describe('Mitigation Service', () => {
  let service: MitigationService;
  let httpMock: HttpTestingController;
  let expectedResult: IMitigation | IMitigation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MitigationService);
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

    it('should create a Mitigation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mitigation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mitigation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mitigation', () => {
      const mitigation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mitigation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mitigation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mitigation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mitigation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMitigationToCollectionIfMissing', () => {
      it('should add a Mitigation to an empty array', () => {
        const mitigation: IMitigation = sampleWithRequiredData;
        expectedResult = service.addMitigationToCollectionIfMissing([], mitigation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mitigation);
      });

      it('should not add a Mitigation to an array that contains it', () => {
        const mitigation: IMitigation = sampleWithRequiredData;
        const mitigationCollection: IMitigation[] = [
          {
            ...mitigation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMitigationToCollectionIfMissing(mitigationCollection, mitigation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mitigation to an array that doesn't contain it", () => {
        const mitigation: IMitigation = sampleWithRequiredData;
        const mitigationCollection: IMitigation[] = [sampleWithPartialData];
        expectedResult = service.addMitigationToCollectionIfMissing(mitigationCollection, mitigation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mitigation);
      });

      it('should add only unique Mitigation to an array', () => {
        const mitigationArray: IMitigation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mitigationCollection: IMitigation[] = [sampleWithRequiredData];
        expectedResult = service.addMitigationToCollectionIfMissing(mitigationCollection, ...mitigationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mitigation: IMitigation = sampleWithRequiredData;
        const mitigation2: IMitigation = sampleWithPartialData;
        expectedResult = service.addMitigationToCollectionIfMissing([], mitigation, mitigation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mitigation);
        expect(expectedResult).toContain(mitigation2);
      });

      it('should accept null and undefined values', () => {
        const mitigation: IMitigation = sampleWithRequiredData;
        expectedResult = service.addMitigationToCollectionIfMissing([], null, mitigation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mitigation);
      });

      it('should return initial array if no Mitigation is added', () => {
        const mitigationCollection: IMitigation[] = [sampleWithRequiredData];
        expectedResult = service.addMitigationToCollectionIfMissing(mitigationCollection, undefined, null);
        expect(expectedResult).toEqual(mitigationCollection);
      });
    });

    describe('compareMitigation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMitigation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMitigation(entity1, entity2);
        const compareResult2 = service.compareMitigation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMitigation(entity1, entity2);
        const compareResult2 = service.compareMitigation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMitigation(entity1, entity2);
        const compareResult2 = service.compareMitigation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
