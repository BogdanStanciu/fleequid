import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt = require('bcryptjs');

const userA = 'user.a';
const userB = 'user.b';

@Injectable()
export class UserService {
  private salt_rounds = 10;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Create and return a new user
   * @param {CreateUserDto} createUserDto
   * @returns {Promise<User>}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    const salt = bcrypt.genSaltSync(this.salt_rounds);
    createdUser.password = bcrypt.hashSync(createUserDto.password, salt);

    return createdUser.save().catch((err) => {
      if (err.code == 11000) {
        throw new BadRequestException('Duplicate value entry', err.keyValue);
      }

      throw new InternalServerErrorException(err.toString());
    });
  }

  /**
   * Search user in db with username if passed
   * @param {{_id?: string; username?: string;}} username
   * @returns {Promise<User>}
   */
  async findOne(filters: {
    _id?: string;
    username?: string;
  }): Promise<User | null> {
    return this.userModel.findOne(filters).exec();
  }

  /**
   * Called once all modules have been initialized, but before listening for connections.
   * This method will check if user A and B already exists on database,
   * and if not, will insert them.
   */
  async onApplicationBootstrap() {
    if (!(await this.userModel.findOne({ username: userA }))) {
      await this.create({
        username: userA,
        password: '1234',
      });
    }

    if (!(await this.userModel.findOne({ username: userB }))) {
      await this.create({
        username: userB,
        password: '1234',
      });
    }
  }
}
