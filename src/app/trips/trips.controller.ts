import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from '../schema/trip.schema';
import { Expense } from '../schema/expense.schema';

@Controller('trips')
export class TripsController {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  @Post()
  async create(@Body() trip: Trip): Promise<Trip> {
    const createdTrip = new this.tripModel(trip);
    return createdTrip.save();
  }

  @Get()
  async findAll(): Promise<Trip[]> {
    return this.tripModel.find().exec();
  }

  @Put(':id/addExpense')
  async addExpense(
    @Param('id') id: string,
    @Body() expense: Expense,
  ): Promise<Trip> {
    const trip = await this.tripModel.findById(id).exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (!expense.user || !expense.amount) {
      throw new BadRequestException('Invalid expense');
    }
    trip.expenses.push(expense);
    return trip.save();
  }

  @Get(':id/summary')
  async getSummary(@Param('id') id: string): Promise<any> {
    const trip = await this.tripModel.findById(id).exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const pipeline = [
      {
        $match: { _id: trip._id },
      },
      {
        $unwind: '$expenses',
      },
      {
        $group: {
          _id: '$expenses.user',
          spent: { $sum: '$expenses.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          user: '$_id',
          spent: 1,
        },
      },
    ];

    const result = await this.tripModel.aggregate(pipeline).exec();
    const summary = {};

    for (const { user, spent } of result) {
      summary[user] = {
        spent,
        owes: {},
      };
    }

    for (const expense of trip.expenses) {
      const username = expense.user;
      for (const otherUser of trip.users) {
        if (otherUser !== username) {
          if (!summary[otherUser].owes[username]) {
            summary[otherUser].owes[username] = 0;
          }
          summary[otherUser].owes[username] +=
            expense.amount / (trip.users.length - 1);
        }
      }
    }

    return summary;
  }
}
