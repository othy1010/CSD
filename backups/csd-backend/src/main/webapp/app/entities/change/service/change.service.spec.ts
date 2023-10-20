import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChange } from '../change.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../change.test-samples';

import { ChangeService } from './change.service';

const requireRestSample: IChange = {
  ...sampleWithRequiredData,
};

describe('Change Service', () => {
  let service: ChangeService;
  let httpMock: HttpTestingController;
  let expectedResult: IChange | IChange[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChangeService);
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

    it('should create a Change', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const change = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(change).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Change', () => {
      const change = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(change).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Change', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Change', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Change', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChangeToCollectionIfMissing', () => {
      it('should add a Change to an empty array', () => {
        const change: IChange = sampleWithRequiredData;
        expectedResult = service.addChangeToCollectionIfMissing([], change);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(change);
      });

      it('should not add a Change to an array that contains it', () => {
        const change: IChange = sampleWithRequiredData;
        const changeCollection: IChange[] = [
          {
            ...change,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChangeToCollectionIfMissing(changeCollection, change);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Change to an array that doesn't contain it", () => {
        const change: IChange = sampleWithRequiredData;
        const changeCollection: IChange[] = [sampleWithPartialData];
        expectedResult = service.addChangeToCollectionIfMissing(changeCollection, change);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(change);
      });

      it('should add only unique Change to an array', () => {
        const changeArray: IChange[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const changeCollection: IChange[] = [sampleWithRequiredData];
        expectedResult = service.addChangeToCollectionIfMissing(changeCollection, ...changeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const change: IChange = sampleWithRequiredData;
        const change2: IChange = sampleWithPartialData;
        expectedResult = service.addChangeToCollectionIfMissing([], change, change2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(change);
        expect(expectedResult).toContain(change2);
      });

      it('should accept null and undefined values', () => {
        const change: IChange = sampleWithRequiredData;
        expectedResult = service.addChangeToCollectionIfMissing([], null, change, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(change);
      });

      it('should return initial array if no Change is added', () => {
        const changeCollection: IChange[] = [sampleWithRequiredData];
        expectedResult = service.addChangeToCollectionIfMissing(changeCollection, undefined, null);
        expect(expectedResult).toEqual(changeCollection);
      });
    });

    describe('compareChange', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChange(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChange(entity1, entity2);
        const compareResult2 = service.compareChange(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChange(entity1, entity2);
        const compareResult2 = service.compareChange(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChange(entity1, entity2);
        const compareResult2 = service.compareChange(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
