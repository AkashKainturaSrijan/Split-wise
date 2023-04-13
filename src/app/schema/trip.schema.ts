import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Expense, ExpenseSchema } from './expense.schema';

export type TripDocument = Trip & Document;

@Schema()
export class Trip {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ type: [ExpenseSchema], default: [] })
  expenses: Expense[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
