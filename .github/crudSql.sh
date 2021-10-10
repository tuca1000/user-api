#!/bin/sh

CRUD_NAME=$1

echo Generating SQL CRUD to ${CRUD_NAME}

yo secjs ${CRUD_NAME} --path=./${CRUD_NAME}

echo Moving E2E Tests
mv ./${CRUD_NAME}/E2E/${CRUD_NAME} ./tests/E2E

echo Moving Dto
mv ./${CRUD_NAME}/Dtos/${CRUD_NAME}Dto.ts ./app/Contracts/Dtos

echo Moving Model
mv ./${CRUD_NAME}/${CRUD_NAME}.ts ./app/Models

echo Moving Api Service
mv ./${CRUD_NAME}/${CRUD_NAME}Service.ts ./app/Services/Api

echo Moving Repository
mv ./${CRUD_NAME}/${CRUD_NAME}Repository.ts ./app/Repositories

echo Moving Controller
mv ./${CRUD_NAME}/${CRUD_NAME}Controller.ts ./app/Http/Controllers

echo Moving Validator
mv ./${CRUD_NAME}/${CRUD_NAME}Validator.ts ./app/Validators

echo Moving Resource
mv ./${CRUD_NAME}/${CRUD_NAME}Resource.ts ./app/Resources

echo Moving Factory
mv ./${CRUD_NAME}/${CRUD_NAME}Factory.ts ./database/factories

echo Moving Seeder
mv ./${CRUD_NAME}/${CRUD_NAME}Seeder.ts ./database/seeds

rm -r ./${CRUD_NAME}

echo Finished!
