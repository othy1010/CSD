import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIntent } from '../intent.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../intent.test-samples';

import { IntentService } from './intent.service';

const requireRestSample: IIntent = {
  ...sampleWithRequiredData,
};

describe('Intent Service', () => {
  let service: IntentService;
  let httpMock: HttpTestingController;
  let expectedResult: IIntent | IIntent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IntentService);
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

    it('should create a Intent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const intent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(intent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Intent', () => {
      const intent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(intent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Intent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Intent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Intent', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIntentToCollectionIfMissing', () => {
      it('should add a Intent to an empty array', () => {
        const intent: IIntent = sampleWithRequiredData;
        expectedResult = service.addIntentToCollectionIfMissing([], intent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intent);
      });

      it('should not add a Intent to an array that contains it', () => {
        const intent: IIntent = sampleWithRequiredData;
        const intentCollection: IIntent[] = [
          {
            ...intent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, intent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Intent to an array that doesn't contain it", () => {
        const intent: IIntent = sampleWithRequiredData;
        const intentCollection: IIntent[] = [sampleWithPartialData];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, intent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intent);
      });

      it('should add only unique Intent to an array', () => {
        const intentArray: IIntent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const intentCollection: IIntent[] = [sampleWithRequiredData];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, ...intentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const intent: IIntent = sampleWithRequiredData;
        const intent2: IIntent = sampleWithPartialData;
        expectedResult = service.addIntentToCollectionIfMissing([], intent, intent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intent);
        expect(expectedResult).toContain(intent2);
      });

      it('should accept null and undefined values', () => {
        const intent: IIntent = sampleWithRequiredData;
        expectedResult = service.addIntentToCollectionIfMissing([], null, intent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intent);
      });

      it('should return initial array if no Intent is added', () => {
        const intentCollection: IIntent[] = [sampleWithRequiredData];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, undefined, null);
        expect(expectedResult).toEqual(intentCollection);
      });
    });

    describe('compareIntent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIntent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIntent(entity1, entity2);
        const compareResult2 = service.compareIntent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIntent(entity1, entity2);
        const compareResult2 = service.compareIntent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIntent(entity1, entity2);
        const compareResult2 = service.compareIntent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
