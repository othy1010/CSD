import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IThreat } from '../threat.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../threat.test-samples';

import { ThreatService } from './threat.service';

const requireRestSample: IThreat = {
  ...sampleWithRequiredData,
};

describe('Threat Service', () => {
  let service: ThreatService;
  let httpMock: HttpTestingController;
  let expectedResult: IThreat | IThreat[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ThreatService);
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

    it('should create a Threat', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const threat = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(threat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Threat', () => {
      const threat = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(threat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Threat', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Threat', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Threat', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addThreatToCollectionIfMissing', () => {
      it('should add a Threat to an empty array', () => {
        const threat: IThreat = sampleWithRequiredData;
        expectedResult = service.addThreatToCollectionIfMissing([], threat);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(threat);
      });

      it('should not add a Threat to an array that contains it', () => {
        const threat: IThreat = sampleWithRequiredData;
        const threatCollection: IThreat[] = [
          {
            ...threat,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addThreatToCollectionIfMissing(threatCollection, threat);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Threat to an array that doesn't contain it", () => {
        const threat: IThreat = sampleWithRequiredData;
        const threatCollection: IThreat[] = [sampleWithPartialData];
        expectedResult = service.addThreatToCollectionIfMissing(threatCollection, threat);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(threat);
      });

      it('should add only unique Threat to an array', () => {
        const threatArray: IThreat[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const threatCollection: IThreat[] = [sampleWithRequiredData];
        expectedResult = service.addThreatToCollectionIfMissing(threatCollection, ...threatArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const threat: IThreat = sampleWithRequiredData;
        const threat2: IThreat = sampleWithPartialData;
        expectedResult = service.addThreatToCollectionIfMissing([], threat, threat2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(threat);
        expect(expectedResult).toContain(threat2);
      });

      it('should accept null and undefined values', () => {
        const threat: IThreat = sampleWithRequiredData;
        expectedResult = service.addThreatToCollectionIfMissing([], null, threat, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(threat);
      });

      it('should return initial array if no Threat is added', () => {
        const threatCollection: IThreat[] = [sampleWithRequiredData];
        expectedResult = service.addThreatToCollectionIfMissing(threatCollection, undefined, null);
        expect(expectedResult).toEqual(threatCollection);
      });
    });

    describe('compareThreat', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareThreat(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareThreat(entity1, entity2);
        const compareResult2 = service.compareThreat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareThreat(entity1, entity2);
        const compareResult2 = service.compareThreat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareThreat(entity1, entity2);
        const compareResult2 = service.compareThreat(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
