import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import { CreateUserDto, UpdateUserDto } from 'app/Contracts/Dtos/UserDto'

import { ObjectIdPipe } from 'app/Pipes/ObjectIdPipe'
import { PaginationContract } from '@secjs/contracts'
import { PipeValidator } from 'app/Pipes/PipeValidator'
import { UserService } from 'app/Services/Api/UserService'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('User')
@Controller('users')
export class UserController {
  @Inject(UserService)
  private userService: UserService

  @Get()
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  async index(
    @Query(QueryParamsPipe) queries: any,
    @Pagination() paginate: PaginationContract,
  ) {
    return this.userService.findAll(paginate, queries)
  }

  @Post()
  async store(@Body(PipeValidator) body: CreateUserDto) {
    return this.userService.createOne(body)
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async show(
    @Query(QueryParamsPipe) queries: any,
    @Param(ObjectIdPipe) params: any,
  ) {
    return this.userService.findOne(params.id, queries)
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  async update(
    @Param(ObjectIdPipe) params: any,
    @Body(PipeValidator) body: UpdateUserDto,
  ) {
    return this.userService.updateOne(params.id, body)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delete(@Param(ObjectIdPipe) params: any) {
    return this.userService.deleteOne(params.id)
  }
}
