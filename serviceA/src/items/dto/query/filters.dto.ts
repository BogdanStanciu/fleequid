import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class ItemsQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @ApiProperty({ required: false })
  price?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ required: true, default: 20 })
  limit: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ required: true, default: 0 })
  offset: number = 0;
}

export { ItemsQueryDto };
