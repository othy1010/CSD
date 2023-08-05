import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISelectionCriteria } from '../selection-criteria.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../selection-criteria.test-samples';

import { SelectionCriteriaService } from './selection-criteria.service';

const requireRestSample: ISelectionCriteria = {
  ...sampleWithRequiredData,
};

describe('SelectionCriteria Service', () => {
  let service: SelectionCriteriaService;
  let httpMock: HttpTestingController;
  let expectedResult: ISelectionCriteria | ISelectionCriteria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SelectionCriteriaService);
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

    it('should create a SelectionCriteria', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const selectionCriteria = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(selectionCriteria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SelectionCriteria', () => {
      const selectionCriteria = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(selectionCriteria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SelectionCriteria', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SelectionCriteria', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SelectionCriteria', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSelectionCriteriaToCollectionIfMissing', () => {
      it('should add a SelectionCriteria to an empty array', () => {
        const selectionCriteria: ISelectionCriteria = sampleWithRequiredData;
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing([], selectionCriteria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(selectionCriteria);
      });

      it('should not add a SelectionCriteria to an array that contains it', () => {
        const selectionCriteria: ISelectionCriteria = sampleWithRequiredData;
        const selectionCriteriaCollection: ISelectionCriteria[] = [
          {
            ...selectionCriteria,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing(selectionCriteriaCollection, selectionCriteria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SelectionCriteria to an array that doesn't contain it", () => {
        const selectionCriteria: ISelectionCriteria = sampleWithRequiredData;
        const selectionCriteriaCollection: ISelectionCriteria[] = [sampleWithPartialData];
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing(selectionCriteriaCollection, selectionCriteria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(selectionCriteria);
      });

      it('should add only unique SelectionCriteria to an array', () => {
        const selectionCriteriaArray: ISelectionCriteria[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const selectionCriteriaCollection: ISelectionCriteria[] = [sampleWithRequiredData];
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing(selectionCriteriaCollection, ...selectionCriteriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const selectionCriteria: ISelectionCriteria = sampleWithRequiredData;
        const selectionCriteria2: ISelectionCriteria = sampleWithPartialData;
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing([], selectionCriteria, selectionCriteria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(selectionCriteria);
        expect(expectedResult).toContain(selectionCriteria2);
      });

      it('should accept null and undefined values', () => {
        const selectionCriteria: ISelectionCriteria = sampleWithRequiredData;
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing([], null, selectionCriteria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(selectionCriteria);
      });

      it('should return initial array if no SelectionCriteria is added', () => {
        const selectionCriteriaCollection: ISelectionCriteria[] = [sampleWithRequiredData];
        expectedResult = service.addSelectionCriteriaToCollectionIfMissing(selectionCriteriaCollection, undefined, null);
        expect(expectedResult).toEqual(selectionCriteriaCollection);
      });
    });

    describe('compareSelectionCriteria', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSelectionCriteria(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSelectionCriteria(entity1, entity2);
        const compareResult2 = service.compareSelectionCriteria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSelectionCriteria(entity1, entity2);
        const compareResult2 = service.compareSelectionCriteria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSelectionCriteria(entity1, entity2);
        const compareResult2 = service.compareSelectionCriteria(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
