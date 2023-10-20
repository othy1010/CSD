import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICodecisionMethod } from '../codecision-method.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../codecision-method.test-samples';

import { CodecisionMethodService } from './codecision-method.service';

const requireRestSample: ICodecisionMethod = {
  ...sampleWithRequiredData,
};

describe('CodecisionMethod Service', () => {
  let service: CodecisionMethodService;
  let httpMock: HttpTestingController;
  let expectedResult: ICodecisionMethod | ICodecisionMethod[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CodecisionMethodService);
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

    it('should create a CodecisionMethod', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const codecisionMethod = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(codecisionMethod).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CodecisionMethod', () => {
      const codecisionMethod = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(codecisionMethod).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CodecisionMethod', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CodecisionMethod', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CodecisionMethod', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCodecisionMethodToCollectionIfMissing', () => {
      it('should add a CodecisionMethod to an empty array', () => {
        const codecisionMethod: ICodecisionMethod = sampleWithRequiredData;
        expectedResult = service.addCodecisionMethodToCollectionIfMissing([], codecisionMethod);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(codecisionMethod);
      });

      it('should not add a CodecisionMethod to an array that contains it', () => {
        const codecisionMethod: ICodecisionMethod = sampleWithRequiredData;
        const codecisionMethodCollection: ICodecisionMethod[] = [
          {
            ...codecisionMethod,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCodecisionMethodToCollectionIfMissing(codecisionMethodCollection, codecisionMethod);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CodecisionMethod to an array that doesn't contain it", () => {
        const codecisionMethod: ICodecisionMethod = sampleWithRequiredData;
        const codecisionMethodCollection: ICodecisionMethod[] = [sampleWithPartialData];
        expectedResult = service.addCodecisionMethodToCollectionIfMissing(codecisionMethodCollection, codecisionMethod);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(codecisionMethod);
      });

      it('should add only unique CodecisionMethod to an array', () => {
        const codecisionMethodArray: ICodecisionMethod[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const codecisionMethodCollection: ICodecisionMethod[] = [sampleWithRequiredData];
        expectedResult = service.addCodecisionMethodToCollectionIfMissing(codecisionMethodCollection, ...codecisionMethodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const codecisionMethod: ICodecisionMethod = sampleWithRequiredData;
        const codecisionMethod2: ICodecisionMethod = sampleWithPartialData;
        expectedResult = service.addCodecisionMethodToCollectionIfMissing([], codecisionMethod, codecisionMethod2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(codecisionMethod);
        expect(expectedResult).toContain(codecisionMethod2);
      });

      it('should accept null and undefined values', () => {
        const codecisionMethod: ICodecisionMethod = sampleWithRequiredData;
        expectedResult = service.addCodecisionMethodToCollectionIfMissing([], null, codecisionMethod, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(codecisionMethod);
      });

      it('should return initial array if no CodecisionMethod is added', () => {
        const codecisionMethodCollection: ICodecisionMethod[] = [sampleWithRequiredData];
        expectedResult = service.addCodecisionMethodToCollectionIfMissing(codecisionMethodCollection, undefined, null);
        expect(expectedResult).toEqual(codecisionMethodCollection);
      });
    });

    describe('compareCodecisionMethod', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCodecisionMethod(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCodecisionMethod(entity1, entity2);
        const compareResult2 = service.compareCodecisionMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCodecisionMethod(entity1, entity2);
        const compareResult2 = service.compareCodecisionMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCodecisionMethod(entity1, entity2);
        const compareResult2 = service.compareCodecisionMethod(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
