import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class SearchRequest {
  @IsNotEmpty()
  @IsNumberString()
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  @IsOptional()
  access: string;
}
