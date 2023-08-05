import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISolution } from '../solution.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../solution.test-samples';

import { SolutionService } from './solution.service';

const requireRestSample: ISolution = {
  ...sampleWithRequiredData,
};

describe('Solution Service', () => {
  let service: SolutionService;
  let httpMock: HttpTestingController;
  let expectedResult: ISolution | ISolution[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SolutionService);
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

    it('should create a Solution', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const solution = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(solution).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Solution', () => {
      const solution = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(solution).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Solution', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Solution', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Solution', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSolutionToCollectionIfMissing', () => {
      it('should add a Solution to an empty array', () => {
        const solution: ISolution = sampleWithRequiredData;
        expectedResult = service.addSolutionToCollectionIfMissing([], solution);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(solution);
      });

      it('should not add a Solution to an array that contains it', () => {
        const solution: ISolution = sampleWithRequiredData;
        const solutionCollection: ISolution[] = [
          {
            ...solution,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSolutionToCollectionIfMissing(solutionCollection, solution);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Solution to an array that doesn't contain it", () => {
        const solution: ISolution = sampleWithRequiredData;
        const solutionCollection: ISolution[] = [sampleWithPartialData];
        expectedResult = service.addSolutionToCollectionIfMissing(solutionCollection, solution);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(solution);
      });

      it('should add only unique Solution to an array', () => {
        const solutionArray: ISolution[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const solutionCollection: ISolution[] = [sampleWithRequiredData];
        expectedResult = service.addSolutionToCollectionIfMissing(solutionCollection, ...solutionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const solution: ISolution = sampleWithRequiredData;
        const solution2: ISolution = sampleWithPartialData;
        expectedResult = service.addSolutionToCollectionIfMissing([], solution, solution2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(solution);
        expect(expectedResult).toContain(solution2);
      });

      it('should accept null and undefined values', () => {
        const solution: ISolution = sampleWithRequiredData;
        expectedResult = service.addSolutionToCollectionIfMissing([], null, solution, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(solution);
      });

      it('should return initial array if no Solution is added', () => {
        const solutionCollection: ISolution[] = [sampleWithRequiredData];
        expectedResult = service.addSolutionToCollectionIfMissing(solutionCollection, undefined, null);
        expect(expectedResult).toEqual(solutionCollection);
      });
    });

    describe('compareSolution', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSolution(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSolution(entity1, entity2);
        const compareResult2 = service.compareSolution(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSolution(entity1, entity2);
        const compareResult2 = service.compareSolution(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSolution(entity1, entity2);
        const compareResult2 = service.compareSolution(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
