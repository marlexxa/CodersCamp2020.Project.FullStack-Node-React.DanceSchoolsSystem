import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DepositInterface } from './interfaces/deposit.interface';
import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInterface } from 'src/user/interfaces/user.interface';

@Injectable()
export class DepositService {
  constructor(
    @InjectModel('Deposit') private readonly depositModel: Model<DepositInterface>,
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
  ) {}

  async create(createDepositDto: CreateDepositDto) {
    const deposit = await new this.depositModel(createDepositDto);
    return deposit.save();
  }

  async findAll() {
    const deposits = await this.depositModel.find().exec();
    if (!deposits || !deposits[0]) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return deposits;
  }

  async findOne(id: string) {
    const deposit = await this.depositModel.findOne({ _id: id }).exec();
    if (!deposit) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return deposit;
  }

  async update(id: string, updateDepositDto: UpdateDepositDto) {
    const deposit = await this.depositModel.findByIdAndUpdate({ _id: id }, updateDepositDto).exec();
    if (!deposit) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const deposit = await this.depositModel.deleteOne({ _id: id }).exec();
    if (deposit.deletedCount === 0) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return deposit;
  }

  async findByUserId(id: string) {
    const deposits = await this.depositModel.find().exec();
    deposits.forEach((deposit) => {
      if (deposit.user._id == id) {
        return deposit;
      } else {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
    });
  }
}
