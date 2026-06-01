import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateLevelDeto{
    @IsString()
    title:string;

    @IsString()
    code:string;

    @IsString()
    @IsOptional()
    description:string;

    @IsInt()
    order:number;
}