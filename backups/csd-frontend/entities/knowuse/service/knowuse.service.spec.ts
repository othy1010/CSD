import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKnowuse } from '../knowuse.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../knowuse.test-samples';

import { KnowuseService } from './knowuse.service';

const requireRestSample: IKnowuse = {
  ...sampleWithRequiredData,
};

describe('Knowuse Service', () => {
  let service: KnowuseService;
  let httpMock: HttpTestingController;
  let expectedResult: IKnowuse | IKnowuse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KnowuseService);
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

    it('should create a Knowuse', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const knowuse = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(knowuse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Knowuse', () => {
      const knowuse = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(knowuse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Knowuse', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Knowuse', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Knowuse', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addKnowuseToCollectionIfMissing', () => {
      it('should add a Knowuse to an empty array', () => {
        const knowuse: IKnowuse = sampleWithRequiredData;
        expectedResult = service.addKnowuseToCollectionIfMissing([], knowuse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(knowuse);
      });

      it('should not add a Knowuse to an array that contains it', () => {
        const knowuse: IKnowuse = sampleWithRequiredData;
        const knowuseCollection: IKnowuse[] = [
          {
            ...knowuse,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addKnowuseToCollectionIfMissing(knowuseCollection, knowuse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Knowuse to an array that doesn't contain it", () => {
        const knowuse: IKnowuse = sampleWithRequiredData;
        const knowuseCollection: IKnowuse[] = [sampleWithPartialData];
        expectedResult = service.addKnowuseToCollectionIfMissing(knowuseCollection, knowuse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(knowuse);
      });

      it('should add only unique Knowuse to an array', () => {
        const knowuseArray: IKnowuse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const knowuseCollection: IKnowuse[] = [sampleWithRequiredData];
        expectedResult = service.addKnowuseToCollectionIfMissing(knowuseCollection, ...knowuseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const knowuse: IKnowuse = sampleWithRequiredData;
        const knowuse2: IKnowuse = sampleWithPartialData;
        expectedResult = service.addKnowuseToCollectionIfMissing([], knowuse, knowuse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(knowuse);
        expect(expectedResult).toContain(knowuse2);
      });

      it('should accept null and undefined values', () => {
        const knowuse: IKnowuse = sampleWithRequiredData;
        expectedResult = service.addKnowuseToCollectionIfMissing([], null, knowuse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(knowuse);
      });

      it('should return initial array if no Knowuse is added', () => {
        const knowuseCollection: IKnowuse[] = [sampleWithRequiredData];
        expectedResult = service.addKnowuseToCollectionIfMissing(knowuseCollection, undefined, null);
        expect(expectedResult).toEqual(knowuseCollection);
      });
    });

    describe('compareKnowuse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareKnowuse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareKnowuse(entity1, entity2);
        const compareResult2 = service.compareKnowuse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareKnowuse(entity1, entity2);
        const compareResult2 = service.compareKnowuse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareKnowuse(entity1, entity2);
        const compareResult2 = service.compareKnowuse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
