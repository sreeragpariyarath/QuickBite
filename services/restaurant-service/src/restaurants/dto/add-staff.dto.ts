import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum StaffRoleEnum {
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  KITCHEN_STAFF = 'KITCHEN_STAFF',
}

export class AddStaffDto {
  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111', description: 'User ID of the staff member' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: 'Ananya Sharma' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+919876543211' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'ananya@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ enum: StaffRoleEnum, example: 'MANAGER' })
  @IsEnum(StaffRoleEnum)
  role: StaffRoleEnum;
}
