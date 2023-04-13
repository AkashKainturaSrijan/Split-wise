import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Expense {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  amount: number;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
