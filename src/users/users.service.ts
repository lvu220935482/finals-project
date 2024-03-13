import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await this.hashPassword(createUserDto.password);
      await this.UserModel.create(createUserDto);
      return {
        success: true,
        message: {
          status: 201,
          message: 'User created successfully',
          data: createUserDto,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: {
          status: 400,
          message: err.message,
        },
      };
    }
  }

  async findAll() {
    try {
      const users = await this.UserModel.find();
      return {
        success: true,
        message: {
          status: 200,
          message: 'Users found successfully',
          data: users,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: {
          status: 400,
          message: err.message,
        },
      };
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.UserModel.findOne({ _id: id });
      return {
        success: true,
        message: {
          status: 200,
          message: 'User found successfully',
          data: user,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: {
          status: 400,
          message: `Can't find user with id: ${id}`,
        },
      };
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.UserModel.findById({ _id: id });
      if (!user) {
        throw new Error(`User with id: ${id} not found`);
      }
      const result = await this.UserModel.updateOne({ _id: id }, updateUserDto);
      return {
        success: true,
        message: {
          status: 200,
          message: 'User updated successfully',
          data: updateUserDto,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: {
          status: 400,
          message: err.message,
        },
      };
    }
  }

  async remove(id: string) {
    try {
      const result = await this.UserModel.deleteOne({ _id: id });
      if (result.deletedCount === 0)
        throw new Error(`User with id: ${id} not found`);
      return {
        success: true,
        message: {
          status: 200,
          message: 'User deleted successfully',
        },
      };
    } catch (err) {
      return {
        success: false,
        message: {
          status: 400,
          message: err.message,
        },
      };
    }
  }
}
