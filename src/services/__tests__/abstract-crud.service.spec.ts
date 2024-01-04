import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Document } from 'mongoose';
import {
  AbstractCrudService,
  ValidationContext,
} from '../abstract-crud.service';
import { InjectModel, getModelToken } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';

class MockModel extends Document {
  countryCode: string;
  status: string;
}

const mockMongoose = {
  create: jest.fn(),
  find: jest.fn(),
  updateMany: jest.fn(),
  deleteMany: jest.fn(() => {
    return Promise.resolve();
  }),
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  sort: jest.fn(),
  skip: jest.fn(),
  limit: jest.fn(),
};

class MockDto {
  countryCode: string;
  status: string;
}

const mockValidator = jest.fn();

const mockEventCatcher = {
  afterCreate: jest.fn(),
  afterUpdate: jest.fn(),
};

@Injectable()
class MockService extends AbstractCrudService<MockModel> {
  constructor(@InjectModel(MockModel.name) model: Model<MockModel>) {
    super(model);
  }

  mockValidateObjectId(id: string) {
    this.validateObjectId(id);
  }

  mockMapDtoToEntity(dto: MockDto): Partial<MockModel> {
    return this.mapDtoToEntity(dto);
  }

  async validate(request: MockDto, context: ValidationContext) {
    await mockValidator(request, context);
  }

  mockValidationError() {
    this.throwValidationError('Validation Error');
  }

  protected mapEntityToDto(record: MockModel): MockDto {
    const mockDto = new MockDto();
    mockDto.countryCode = record.countryCode;
    mockDto.status = record.status;

    return mockDto;
  }

  protected async afterCreate(record: MockModel): Promise<MockModel> {
    const document = await super.afterCreate(record);
    mockEventCatcher.afterCreate(document);

    return document;
  }

  protected async afterUpdate(record: MockModel): Promise<MockModel> {
    const document = await super.afterUpdate(record);
    mockEventCatcher.afterUpdate(document);

    return document;
  }
}

describe('AbstractCrudHandler', () => {
  let service: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        MockService,
        {
          provide: getModelToken('MockModel'),
          useValue: mockMongoose,
        },
      ],
    }).compile();

    service = module.get<MockService>(MockService);
  });

  describe('create()', () => {
    const mockCreateRequestDto: MockDto = {
      countryCode: 'MX',
      status: 'created',
    };

    beforeEach(() => {
      const mockModel: Partial<MockModel> = {
        countryCode: 'MX',
      };
      mockMongoose.create.mockResolvedValue(mockModel);
      mockValidator.mockClear();
    });

    it('creates a new mockModel', async () => {
      const resultDto = await service.create(mockCreateRequestDto);
      expect(resultDto.countryCode).toBeTruthy();
    });

    it('calls validate with given DTO', async () => {
      await service.create(mockCreateRequestDto);
      expect(mockValidator).toBeCalledWith(mockCreateRequestDto, {
        action: 'create',
      });
    });

    it('calls afterCreate', async () => {
      await service.create(mockCreateRequestDto);
      expect(mockEventCatcher.afterCreate).toBeCalled();
    });

    describe('when database returns void', () => {
      beforeEach(() => {
        mockMongoose.create.mockResolvedValue(null);
      });

      it('returns null object', async () => {
        const resultDto = await service.create(mockCreateRequestDto);
        expect(resultDto).toBeFalsy();
      });
    });
  });

  describe('updateMany()', () => {
    const filter = { countryCode: 'MX' };

    describe('when there is a valid record to update', () => {
      beforeEach(() => {
        const mockModel: Partial<MockModel> = {
          countryCode: 'MX',
          status: 'created',
        };
        mockMongoose.updateMany.mockResolvedValueOnce(mockModel);
      });

      it('returns records with updated values', async () => {
        const expectedResult: MockDto = {
          countryCode: 'MX',
          status: 'created',
        };

        const result = await service.updateMany(filter, {});
        expect(result).toStrictEqual(expectedResult);
      });
    });
  });

  describe('deleteMany()', () => {
    const filter = { countryCode: 'MX' };

    describe('when there are valid records to delete', () => {
      it('calls model.delteMany with given filter', async () => {
        await service.deleteMany(filter);
        expect(mockMongoose.deleteMany).toBeCalledWith(filter);
      });
    });
  });

  describe('find()', () => {
    const filter = { countryCode: 'MX' };

    describe('when records exist', () => {
      beforeEach(() => {
        const mockModel: Partial<MockModel> = {
          countryCode: 'MX',
          status: 'created',
        };

        mockMongoose.find.mockResolvedValueOnce([mockModel]);
      });

      it('returns records in DTO format', async () => {
        const expectedResult = new MockDto();
        expectedResult.countryCode = 'MX';
        expectedResult.status = 'created';

        const results = await service.find(filter);

        expect(results).toStrictEqual([expectedResult]);
      });
    });

    describe('when the record does not exists', () => {
      beforeEach(() => {
        mockMongoose.find.mockResolvedValueOnce(null);
      });

      it('returns falsy', async () => {
        const result = await service.find(filter);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('findById()', () => {
    describe('when exists record', () => {
      beforeEach(() => {
        const mockModel: Partial<MockModel> = {
          countryCode: 'MX',
          status: 'created',
        };

        mockMongoose.findById.mockResolvedValueOnce(mockModel);
      });

      it('returns record in DTO format', async () => {
        const expectedResult = new MockDto();
        expectedResult.countryCode = 'MX';
        expectedResult.status = 'created';

        const results = await service.findById('62f2d3a0055643ae4b67d2f3');

        expect(results).toStrictEqual(expectedResult);
      });
    });

    describe('when the record does not exists', () => {
      beforeEach(() => {
        mockMongoose.findById.mockResolvedValueOnce(null);
      });

      it('returns falsy', () => {
        expect(() => {
          return service.findById('62f2d3a0055643ae4b67d2f3');
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('findOne()', () => {
    const filter = { countryCode: 'MX' };

    describe('when exists record', () => {
      beforeEach(() => {
        const mockModel: Partial<MockModel> = {
          countryCode: 'MX',
          status: 'created',
        };

        mockMongoose.findOne.mockResolvedValueOnce(mockModel);
      });

      it('returns record in DTO format', async () => {
        const expectedResult = new MockDto();
        expectedResult.countryCode = 'MX';
        expectedResult.status = 'created';

        const results = await service.findOne(filter);

        expect(results).toStrictEqual(expectedResult);
      });
    });

    describe('when the record does not exists', () => {
      beforeEach(() => {
        mockMongoose.findOne.mockResolvedValueOnce(null);
      });

      it('returns falsy', () => {
        expect(() => {
          return service.findOne(filter);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('update()', () => {
    const mockUpdateRequestDto: Partial<MockDto> = { countryCode: 'MX' };

    beforeEach(() => {
      const mockModel: Partial<MockModel> = {
        countryCode: 'MX',
        status: 'created',
      };
      mockMongoose.findByIdAndUpdate.mockResolvedValue(mockModel);
      mockValidator.mockClear();
    });

    it('update a mockModel', async () => {
      const resultDto = await service.update(
        '62f2d3a0055643ae4b67d2f3',
        mockUpdateRequestDto,
      );
      expect(resultDto.countryCode).toBeTruthy();
    });

    it('update a mockModel without dot', async () => {
      const resultDto = await service.update(
        '62f2d3a0055643ae4b67d2f3',
        mockUpdateRequestDto,
        false,
      );
      expect(resultDto.countryCode).toBeTruthy();
    });

    it('calls validate with given DTO', async () => {
      await service.update(
        '62f2d3a0055643ae4b67d2f3',
        mockUpdateRequestDto,
        false,
      );
      expect(mockValidator).toBeCalledWith(mockUpdateRequestDto, {
        entityId: '62f2d3a0055643ae4b67d2f3',
        action: 'update',
      });
    });

    it('calls afterUpdate', async () => {
      await service.update('62f2d3a0055643ae4b67d2f3', mockUpdateRequestDto);
      expect(mockEventCatcher.afterUpdate).toBeCalled();
    });

    describe('when database returns void', () => {
      beforeEach(() => {
        mockMongoose.findByIdAndUpdate.mockResolvedValue(null);
      });

      it('throws an HTTP NotFound Exception', () => {
        expect(() =>
          service.update('62f2d3a0055643ae4b67d2f3', mockUpdateRequestDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('updateOne', () => {
    const countryCode = 'MX';
    const status = 'initialized';

    const updateFilter: Partial<MockDto> = { countryCode };
    const updateQuery: Partial<MockDto> = { status };

    describe('when it successfully updates the resource', () => {
      beforeEach(() => {
        mockMongoose.findOneAndUpdate.mockResolvedValueOnce({
          countryCode,
          status,
        });
        mockValidator.mockClear();
      });

      it('updates a resource', async () => {
        const result = await service.updateOne(updateFilter, updateQuery);
        expect(result).toMatchObject({ countryCode, status });
      });

      it('updates a resource without dot notation', async () => {
        const result = await service.updateOne(
          updateFilter,
          updateQuery,
          false,
        );
        expect(result).toMatchObject({ countryCode, status });
      });

      it('calls validate with given DTO', async () => {
        await service.updateOne(updateFilter, updateQuery, false);
        expect(mockValidator).toBeCalledWith(updateQuery, {
          action: 'updateOne',
        });
      });

      it('calls afterUpdate', async () => {
        await service.updateOne(updateFilter, updateQuery);
        expect(mockEventCatcher.afterUpdate).toBeCalled();
      });
    });

    describe('when database returns null', () => {
      beforeEach(() => {
        mockMongoose.findOneAndUpdate.mockResolvedValueOnce(null);
      });

      it('throws an HTTP NotFound Exception', () => {
        const promise = service.updateOne(updateFilter, updateQuery);
        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('remove()', () => {
    const mockModel: Partial<MockModel> = {
      countryCode: 'MX',
    };

    beforeEach(() => {
      mockMongoose.findByIdAndDelete.mockResolvedValue(mockModel);
    });

    it('remove a mockModel', async () => {
      const resultDto = await service.remove('62f2d3a0055643ae4b67d2f3');
      expect(resultDto).toEqual(mockModel);
    });

    describe('when database returns void', () => {
      beforeEach(() => {
        mockMongoose.findByIdAndDelete.mockResolvedValue(null);
      });

      it('raises an HTTP Not Found exception', () => {
        expect(() => {
          return service.remove('62f2d3a0055643ae4b67d2f3');
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('validateObjectId()', () => {
    describe('when the id is valid', () => {
      it('returns void', async () => {
        const resultDto = await service.mockValidateObjectId(
          '63642880d4c830a3457a0163',
        );

        expect(resultDto).toBeFalsy();
      });
    });

    describe('when the id is invalid', () => {
      it('raises an HTTP Badrequest exception', () => {
        expect(() => {
          return service.mockValidateObjectId('INVALID_ID');
        }).toThrow(BadRequestException);
      });
    });
  });

  describe('findOneAndUpdate()', () => {
    const mockUpdateRequestDto: MockDto = {
      countryCode: 'MX',
      status: 'created',
    };

    beforeEach(() => {
      const mockModel: Partial<MockModel> = {
        countryCode: 'MX',
      };
      mockMongoose.findOneAndUpdate.mockResolvedValue(mockModel);
      mockValidator.mockClear();
    });

    it('update a mockModel', async () => {
      const resultDto = await service.findOneAndUpdate(
        {},
        mockUpdateRequestDto,
      );
      expect(resultDto.countryCode).toBeTruthy();
    });

    it('calls validate with given DTO', async () => {
      await service.findOneAndUpdate({}, mockUpdateRequestDto);
      expect(mockValidator).toBeCalledWith(mockUpdateRequestDto, {
        action: 'findOneAndUpdate',
      });
    });

    describe('when database returns void', () => {
      beforeEach(() => {
        mockMongoose.findOneAndUpdate.mockResolvedValue(null);
      });

      it('returns null object', () => {
        expect(() =>
          service.findOneAndUpdate({}, mockUpdateRequestDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('mapDtoToEntity()', () => {
    const mockDto: MockDto = { countryCode: 'MX', status: 'created' };

    describe('when the method is not overrited', () => {
      it('returns the same dto', () => {
        const resultDto = service.mockMapDtoToEntity(mockDto);

        expect(resultDto).toBe(mockDto);
      });
    });
  });

  describe('findPaginated()', () => {
    const filter = { countryCode: 'MX' };
    const sorter: Record<string, SortOrder> = { countryCode: -1 };

    describe('when exists records', () => {
      beforeEach(() => {
        const mockModel: Partial<MockModel> = {
          countryCode: 'MX',
          status: 'created',
        };

        mockMongoose.find.mockReturnThis();
        mockMongoose.sort.mockReturnThis();
        mockMongoose.skip.mockReturnThis();
        mockMongoose.limit.mockResolvedValueOnce([mockModel]);
      });

      it('returns records in DTO format', async () => {
        const expectedResult = new MockDto();
        expectedResult.countryCode = 'MX';
        expectedResult.status = 'created';

        const results = await service.findPaginated(filter);

        expect(results).toStrictEqual([expectedResult]);
      });

      it('sort param is provide', async () => {
        const expectedResult = new MockDto();
        expectedResult.countryCode = 'MX';
        expectedResult.status = 'created';

        await service.findPaginated(filter, sorter);

        expect(mockMongoose.sort).toHaveBeenCalledWith({
          countryCode: -1,
        });
      });
    });

    describe('when the record does not exists', () => {
      beforeEach(() => {
        mockMongoose.find.mockReturnThis();
        mockMongoose.sort.mockReturnThis();
        mockMongoose.skip.mockReturnThis();
        mockMongoose.limit.mockResolvedValueOnce(null);
      });

      it('returns falsy', async () => {
        const result = await service.findPaginated(filter);

        expect(result).toBeFalsy();
      });
    });
  });
});
