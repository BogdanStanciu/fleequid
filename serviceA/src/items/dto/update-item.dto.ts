import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class UpdateItemDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}

export { UpdateItemDto };
