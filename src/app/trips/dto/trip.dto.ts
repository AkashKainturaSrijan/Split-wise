import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsNotEmpty()
  @IsDateString()
  end_date: Date;
}

export class TripSummaryDto {
  total_expenses: number;
  expenses_per_user: { [userId: string]: number };
}
