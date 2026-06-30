import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { PrismaService } from '../prisma/prisma.service'

class FeedbackDto {
  @IsString()
  @MinLength(2)
  @MaxLength(4000)
  message!: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MaxLength(40)
  type?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  page?: string
}

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: anyone can submit a suggestion / feedback (delivered to admin). */
  @Post()
  async create(@Body() dto: FeedbackDto) {
    await this.prisma.feedback.create({
      data: { message: dto.message, email: dto.email, type: dto.type, page: dto.page },
    })
    return { ok: true }
  }
}
