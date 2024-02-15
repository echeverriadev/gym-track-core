import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import mongoose, {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
} from 'mongoose';
import * as dot from 'dot-object';
import { SortOrder } from 'mongoose';

type ValidatedAction = 'create' | 'findOneAndUpdate' | 'update' | 'updateOne';
export type ValidationContext = {
  action: ValidatedAction;
  entityId?: string;
};

export abstract class AbstractCrudService<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(createRequest: any): Promise<any> {
    await this.validate(createRequest, { action: 'create' });
    const mappedEntity = this.mapDtoToEntity(createRequest);

    return this.model
      .create(mappedEntity)
      .then((record) => this.afterCreate(record))
      .then((record) => {
        if (!record) {
          return;
        }

        return this.mapEntityToDto(record);
      })
      .catch((error) => {
        this.#throwUnhandledError(error, 'create', 'Error creating record');
      });
  }

  find(filter: FilterQuery<T>): Promise<any[]> {
    return this.model
      .find(filter)
      .catch((error) => {
        this.#throwUnhandledError(error, 'find', 'Error finding records');
      })
      .then((records) => {
        if (!records) {
          return null;
        }

        return records.map((record) => this.mapEntityToDto(record));
      });
  }

  findById(id: string): Promise<any> {
    this.validateObjectId(id);

    return this.model
      .findById(id)
      .catch((error) => {
        this.#throwUnhandledError(error, 'findById', 'Error finding record');
      })
      .then((record) => {
        if (!record) {
          throw new NotFoundException(`${this.model.name} not found`);
        }

        return this.mapEntityToDto(record);
      });
  }

  findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<any> {
    return this.model
      .findOne(filter, projection, options)
      .catch((error) => {
        this.#throwUnhandledError(error, 'findOne', 'Error finding record');
      })
      .then((record) => {
        if (!record) {
          throw new NotFoundException(`${this.model.name} not found`);
        }

        return this.mapEntityToDto(record);
      });
  }

  findOneAndUpdate(filter: FilterQuery<T>, updateRequest: UpdateQuery<T>) {
    this.validate(updateRequest, { action: 'findOneAndUpdate' });
    const updateRequestDot = dot.dot(updateRequest);
    return this.model
      .findOneAndUpdate(filter, updateRequestDot, {
        returnDocument: 'after',
      })
      .catch((error) => {
        this.#throwUnhandledError(
          error,
          'findOneAndUpdate',
          'Error updating record',
        );
      })
      .then((record) => {
        if (!record) {
          throw new NotFoundException(`${this.model.name} not found`);
        }

        return this.mapEntityToDto(record);
      });
  }

  async update(
    id: string,
    updateRequest: UpdateQuery<T>,
    dotNotation = true,
  ): Promise<any> {
    this.validateObjectId(id);
    await this.validate(updateRequest, { action: 'update', entityId: id });
    const mappedEntity = this.mapDtoToEntity(updateRequest);
    dot.keepArray = true;
    const updateQuery = dotNotation ? dot.dot(mappedEntity) : mappedEntity;

    return this.model
      .findByIdAndUpdate(id, updateQuery, {
        returnDocument: 'after',
      })
      .then((record) => this.afterUpdate(record))
      .then((record) => {
        if (!record) {
          throw new NotFoundException(`${this.model.name} not found`);
        }

        return this.mapEntityToDto(record);
      })
      .catch((error) => {
        this.#throwUnhandledError(error, 'update', 'Error updating record');
      });
  }

  async updateOne(
    filter: FilterQuery<T>,
    updateRequest: UpdateQuery<T>,
    dotNotation = true,
  ): Promise<any> {
    await this.validate(updateRequest, { action: 'updateOne' });
    const mappedEntity = this.mapDtoToEntity(updateRequest);
    dot.keepArray = true;
    const updateQuery = dotNotation ? dot.dot(mappedEntity) : mappedEntity;

    return this.model
      .findOneAndUpdate(filter, updateQuery, {
        returnDocument: 'after',
      })
      .then((record) => this.afterUpdate(record))
      .then((record) => {
        if (!record) {
          throw new NotFoundException(`${this.model.name} not found`);
        }

        return this.mapEntityToDto(record);
      })
      .catch((error) => {
        this.#throwUnhandledError(error, 'updateOne', 'Error updating record');
      });
  }

  remove(id: string): Promise<any> {
    this.validateObjectId(id);

    return this.model
      .findByIdAndDelete(id)
      .then((record) => {
        if (!record) {
          throw new NotFoundException(`${this.model.name} not found`);
        }

        return this.mapEntityToDto(record as unknown as T);
      })
      .catch((error) => {
        this.#throwUnhandledError(error, 'remove', 'Error deleting record');
      });
  }

  updateMany(
    filter: FilterQuery<T>,
    updateRequest: UpdateQuery<T>,
  ): Promise<any> {
    dot.keepArray = true;
    const updateRequestDot = dot.dot(updateRequest);

    return this.model
      .updateMany(filter, updateRequestDot, {
        returnDocument: 'after',
      })
      .catch((error) => {
        this.#throwUnhandledError(
          error,
          'updateMany',
          'Error updating records',
        );
      });
  }

  async deleteMany(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteMany(filter).catch((error) => {
      this.#throwUnhandledError(error, 'deleteMany', 'Error deleting records');
    });
  }

  findPaginated(
    filter: FilterQuery<T>,
    sort?: Record<string, SortOrder>,
    limit = 400,
    skip = 0,
  ): Promise<any[]> {
    return this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .catch((error) => {
        this.#throwUnhandledError(
          error,
          'findPaginated',
          'Error finding records',
        );
      })
      .then((records) => {
        if (!records) {
          return null;
        }

        return records.map((record) => this.mapEntityToDto(record));
      });
  }

  protected afterCreate(record: T): Promise<T> {
    return Promise.resolve(record);
  }

  protected afterUpdate(record: T): Promise<T> {
    return Promise.resolve(record);
  }

  #throwUnhandledError(error: any, context: string, message: string) {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof UnprocessableEntityException) throw error;
    throw new ConflictException(error, message);
  }

  protected validateObjectId(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) return;

    throw new BadRequestException('ObjectId is not valid');
  }

  // assumes the dto object is compatible with T object
  protected mapDtoToEntity(dto: any): Partial<T> {
    return dto;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validate(_dtoToValidate: any, _context?: ValidationContext): void {
    return;
  }

  protected abstract mapEntityToDto(record: T): any;
}
