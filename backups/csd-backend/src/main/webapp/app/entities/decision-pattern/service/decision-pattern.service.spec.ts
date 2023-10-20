import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecisionPattern } from '../decision-pattern.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../decision-pattern.test-samples';

import { DecisionPatternService } from './decision-pattern.service';

const requireRestSample: IDecisionPattern = {
  ...sampleWithRequiredData,
};

describe('DecisionPattern Service', () => {
  let service: DecisionPatternService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecisionPattern | IDecisionPattern[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecisionPatternService);
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

    it('should create a DecisionPattern', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decisionPattern = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decisionPattern).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecisionPattern', () => {
      const decisionPattern = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decisionPattern).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecisionPattern', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecisionPattern', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecisionPattern', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecisionPatternToCollectionIfMissing', () => {
      it('should add a DecisionPattern to an empty array', () => {
        const decisionPattern: IDecisionPattern = sampleWithRequiredData;
        expectedResult = service.addDecisionPatternToCollectionIfMissing([], decisionPattern);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decisionPattern);
      });

      it('should not add a DecisionPattern to an array that contains it', () => {
        const decisionPattern: IDecisionPattern = sampleWithRequiredData;
        const decisionPatternCollection: IDecisionPattern[] = [
          {
            ...decisionPattern,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecisionPatternToCollectionIfMissing(decisionPatternCollection, decisionPattern);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecisionPattern to an array that doesn't contain it", () => {
        const decisionPattern: IDecisionPattern = sampleWithRequiredData;
        const decisionPatternCollection: IDecisionPattern[] = [sampleWithPartialData];
        expectedResult = service.addDecisionPatternToCollectionIfMissing(decisionPatternCollection, decisionPattern);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decisionPattern);
      });

      it('should add only unique DecisionPattern to an array', () => {
        const decisionPatternArray: IDecisionPattern[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decisionPatternCollection: IDecisionPattern[] = [sampleWithRequiredData];
        expectedResult = service.addDecisionPatternToCollectionIfMissing(decisionPatternCollection, ...decisionPatternArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decisionPattern: IDecisionPattern = sampleWithRequiredData;
        const decisionPattern2: IDecisionPattern = sampleWithPartialData;
        expectedResult = service.addDecisionPatternToCollectionIfMissing([], decisionPattern, decisionPattern2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decisionPattern);
        expect(expectedResult).toContain(decisionPattern2);
      });

      it('should accept null and undefined values', () => {
        const decisionPattern: IDecisionPattern = sampleWithRequiredData;
        expectedResult = service.addDecisionPatternToCollectionIfMissing([], null, decisionPattern, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decisionPattern);
      });

      it('should return initial array if no DecisionPattern is added', () => {
        const decisionPatternCollection: IDecisionPattern[] = [sampleWithRequiredData];
        expectedResult = service.addDecisionPatternToCollectionIfMissing(decisionPatternCollection, undefined, null);
        expect(expectedResult).toEqual(decisionPatternCollection);
      });
    });

    describe('compareDecisionPattern', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecisionPattern(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecisionPattern(entity1, entity2);
        const compareResult2 = service.compareDecisionPattern(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecisionPattern(entity1, entity2);
        const compareResult2 = service.compareDecisionPattern(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecisionPattern(entity1, entity2);
        const compareResult2 = service.compareDecisionPattern(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
