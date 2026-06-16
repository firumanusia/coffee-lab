import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsOptional()
  @IsString()
  name?: string
}

export class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}

export class RefreshDto {
  @IsOptional()
  @IsString()
  refreshToken?: string
}

export class VerifyDto {
  @IsEmail()
  email!: string

  @IsString()
  code!: string
}

export class ResendDto {
  @IsEmail()
  email!: string
}
