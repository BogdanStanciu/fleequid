import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsQueryDto } from './dto/query/filters.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { item } from './mocks/init-items';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  /**
   * Called once all modules have been initialized, but before listening for connections.
   * This method will insert two items in the database
   */
  async onApplicationBootstrap() {
    if (!(await this.itemModel.findOne({ name: item.name }))) {
      await this.create(item);
    }
  }

  /**
   * Create and return a new Item object
   * @param {CreateItemDto} createItemDto
   * @throws {BadRequestException, InternalServerErrorException}
   * @returns {Promise<Item>}
   */
  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = new this.itemModel(createItemDto);
    return item.save().catch((err) => {
      if (err.code === 11000) {
        throw new BadRequestException('Duplicate value entry', err.keyValue);
      }
      throw new InternalServerErrorException(err.toString());
    });
  }

  /**
   * Return a single item by id
   * @param {string} id
   * @throws {NotFoundException}
   * @returns {Promise<Item>}
   */
  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  /**
   * Return a list of items filtered and limited
   * @param {ItemsQueryDto} filters
   * @returns {Promise<Item[]>}
   */
  async find(filters: ItemsQueryDto): Promise<Item[]> {
    const { limit, offset, ...f } = filters;
    const query: any = {};

    if (f.name) {
      query.name = { $regex: f.name, $options: 'i' };
    }

    if (f.description) {
      query.description = { $regex: f.description, $options: 'i' };
    }

    if (f.price) {
      query.price = f.price;
    }

    const result = await this.itemModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .exec();

    return result;
  }

  /**
   * Update in bulk a item find by id
   * @param {string} id Item id
   * @throws {BadRequestException, NotFoundException, InternalServerErrorException}
   * @param updateItemDto
   */
  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    try {
      const result = await this.itemModel
        .findByIdAndUpdate(new Types.ObjectId(id), updateItemDto, { new: true })
        .exec();

      if (!result) {
        throw new NotFoundException('Item not found');
      }

      return result;
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('Duplicate value entry', err.keyValue);
      }
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * Given an item id, delete it from the database
   * @param {string} id item id
   * @throws {NotFoundException}
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const result = await this.itemModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount != 1) {
      throw new NotFoundException('Item not found');
    }
  }
}
