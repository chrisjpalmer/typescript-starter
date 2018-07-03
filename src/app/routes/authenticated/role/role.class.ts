/**
 * NEVER import like this - import { MyAwesomeFunction, MyAwesomeClass } from ".."; OR import { MyAwesomeFunction, MyAwesomeClass } from ".";
 * ALWAYS import like this - import { MyAwesomeClass } from '../my.awesome.class'; import { MyAwesomeFunction } from '../my.awesome.function';
 * AVOID ".." OR "." import destinations as this confuses typescript. Search and replace "." OR ".." for absolute destinations. Note double quotes were used here to make your search easier
 */
import {
  ValidateNested,
  IsArray,
  IsNumber,
  IsBoolean,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetRelation,
  PostRelation,
  PatchRelation,
  PatchRelationSingle,
  SyncInput,
  GenericGetMode,
} from 'core';

//------------------------------------------------
//--------------------- CLASS --------------------
//------------------------------------------------

//-----------Get-----------\\
export class GetInput extends SyncInput {
  //Query Mode
  @IsOptional() mode: GenericGetMode;
  //Discrete Mode
  @IsOptional() ids: number[];
  //ParameterSearch Mode
  @IsOptional() parameterSearch: GetParameterSearch;

  //Pagination
  @IsOptional() page: number;
  @IsOptional() pageSize: number;
}

export interface GetParameterSearch {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  name?: string;
  description?: string;
}

export interface GetOutput {
  id: number;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  description: string;

  //---------Relationships--------\\
  privileges: Partial<GetRelation>[];
}

//-----------Post----------\\

//Input
export class PostInput {
  @ValidateNested()
  @Type(() => PostInputRole)
  @IsArray()
  entries: PostInputRole[];
}

export class PostInputRole {
  @IsString() name: string;

  @IsString() description: string;

  //---------Relationships--------\\
  @ValidateNested()
  @Type(() => PostRelation)
  @IsArray()
  @IsOptional()
  privileges: PostRelation[];
}

//Output
export class PostOutput {
  result: number[];
}

//-----------Patch----------\\

//Input
export class PatchInput {
  @ValidateNested()
  @Type(() => PatchInputRole)
  @IsArray()
  entries: PatchInputRole[];
}

export class PatchInputRole {
  @IsNumber() id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  //---------Relationships--------\\
  @ValidateNested()
  @Type(() => PatchRelation)
  @IsArray()
  @IsOptional()
  privileges: PatchRelation[];
}

//Output
export class PatchOutput {
  result: number[];
}

//-----------Delete----------\\

//Input
export class DeleteInput {
  @ValidateNested()
  @Type(() => DeleteInputRole)
  @IsArray()
  entries: DeleteInputRole[];
}

export class DeleteInputRole {
  @IsNumber() id: number;
}

//Output
export class DeleteOutput {
  result: number[];
}
