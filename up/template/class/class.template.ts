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
import { GetRelation, PostRelation, PatchRelation, PatchRelationSingle, SyncInput, GenericGetMode } from 'core';

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
  id?:number;
  updatedAt?:Date;
  createdAt?:Date;
  ///ref:{"mode":"childField.normal", "templateFile":"class/get/parameter.field.template"}
}

export interface GetOutput {
  id:number;
  updatedAt:Date;
  createdAt:Date;
  ///ref:{"mode":"childField.normal", "templateFile":"class/get/field.template"}

  //---------Relationships--------\\
  ///ref:{"mode":"childEntity.multipleSingle", "templateFile":"class/get/relation.template"}
}

//-----------Post----------\\

//Input
export class PostInput {
  @ValidateNested()
  @Type(() => PostInput${entity.upper})
  @IsArray()
  entries: PostInput${entity.upper}[];
}

export class PostInput${entity.upper} {
  ///ref:{"mode":"childField.normal", "templateFile":"class/post/field.template"}

  //---------Relationships--------\\
  ///ref:{"mode":"childEntity.multipleSingle", "templateFile":"class/post/relation.template"}
}

//Output
export class PostOutput {
  result: number[];
}

//-----------Patch----------\\

//Input
export class PatchInput {
  @ValidateNested()
  @Type(() => PatchInput${entity.upper})
  @IsArray()
  entries: PatchInput${entity.upper}[];
}

export class PatchInput${entity.upper} {
  @IsNumber() id: number;

  ///ref:{"mode":"childField.normal", "templateFile":"class/patch/field.template"}

  //---------Relationships--------\\
  ///ref:{"mode":"childEntity.multipleSingle", "templateFile":"class/patch/relation.template"}
}

//Output
export class PatchOutput {
  result: number[];
}

//-----------Delete----------\\

//Input
export class DeleteInput {
  @ValidateNested()
  @Type(() => DeleteInput${entity.upper})
  @IsArray()
  entries: DeleteInput${entity.upper}[];
}

export class DeleteInput${entity.upper} {
  @IsNumber() id: number;
}

//Output
export class DeleteOutput {
  result: number[];
}
