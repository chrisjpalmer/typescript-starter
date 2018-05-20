/**
 * NEVER import like this - import { MyAwesomeFunction, MyAwesomeClass } from ".."; OR import { MyAwesomeFunction, MyAwesomeClass } from ".";
 * ALWAYS import like this - import { MyAwesomeClass } from '../my.awesome.class'; import { MyAwesomeFunction } from '../my.awesome.function';
 * AVOID ".." OR "." import destinations as this confuses typescript. Search and replace "." OR ".." for absolute destinations. Note double quotes were used here to make your search easier
 */
import {
  ValidateNested,
  IsArray,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostRelation, PatchRelation } from 'core';

//------------------------------------------------
//--------------------- INPUT --------------------
//------------------------------------------------

//-----------Get-----------\\
//Uses GenericGetController

//-----------Post----------\\

//Input
export class PostInput {
  @ValidateNested()
  @Type(() => PostInputMessageCategory)
  @IsArray()
  entries: PostInputMessageCategory[];
}

export class PostInputMessageCategory {
  @IsString() name: string;

  //---------Relationships--------\\
  @ValidateNested()
  @Type(() => PostRelation)
  @IsArray()
  @IsOptional()
  messages: PostRelation[];
}

//Output
export class PostOutput {
  result: number[];
}

//-----------Patch----------\\

//Input
export class PatchInput {
  @ValidateNested()
  @Type(() => PatchInputMessageCategory)
  @IsArray()
  entries: PatchInputMessageCategory[];
}

export class PatchInputMessageCategory {
  @IsNumber() id: number;

  @IsString()
  @IsOptional()
  name: string;

  //---------Relationships--------\\
  @ValidateNested()
  @Type(() => PostRelation)
  @IsArray()
  @IsOptional()
  messages: PatchRelation[];
}

//Output
export class PatchOutput {
  result: number[];
}

//-----------Delete----------\\

//Input
export class DeleteInput {
  @ValidateNested()
  @Type(() => DeleteInputMessageCategory)
  @IsArray()
  entries: DeleteInputMessageCategory[];
}

export class DeleteInputMessageCategory {
  @IsNumber() id: number;
}

//Output
export class DeleteOutput {
  result: number[];
}
