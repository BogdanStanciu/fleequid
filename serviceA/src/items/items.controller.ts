import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { Item } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsQueryDto } from './dto/query/filters.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiResponse({
    type: Item,
    isArray: false,
    status: 201,
    description: 'Create and return a new item',
    example: {
      name: 'MacBook Pro M4',
      description: 'Apple MacBook Pro',
      price: 1900,
    },
  })
  @ApiProperty({
    type: CreateItemDto,
    isArray: false,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @ApiOkResponse({
    description:
      'Find a single item by id, if no items is found for the given id will return a 404',
    isArray: false,
    example: {
      name: 'MacBook Pro M4',
      description: 'Apple MacBook Pro',
      price: 1900,
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Item id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException();
    }
    return this.itemsService.findOne(id);
  }

  @ApiOkResponse({
    type: Item,
    description: 'Get a list of items searched by filters',
    isArray: true,
    example: [
      {
        _id: '67ab7c8382aab0e872056ef6',
        name: 'MacBook Pro M3',
        price: 1200,
        description: 'Apple MacBook Pro',
      },
    ],
  })
  @ApiBody({
    type: ItemsQueryDto,
  })
  @Get()
  async find(@Query() filters: ItemsQueryDto): Promise<Item[]> {
    return this.itemsService.find(filters);
  }

  @ApiResponse({
    type: Item,
    isArray: false,
    description: 'Update a item in bulk',
    example: {
      name: 'MacBook Pro M3',
      price: 1200,
      description: 'Apple MacBook Pro',
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Item id',
  })
  @Put(':id')
  async update(
    @Param() id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    return this.itemsService.update(id, updateItemDto);
  }

  @ApiResponse({
    status: 200,
    description:
      'Delete a single item by id, if no item is found will return a 404',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Item id',
  })
  @Delete(':id')
  async delete(@Param() id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    return this.itemsService.delete(id);
  }
}
