import { BadRequestException, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";
import { ValidationError } from "class-validator";

const exceptionFactory = (errors: ValidationError[]): any => {
  const errorsMapper = [] as { property: string, message: string }[];

  for (const error of errors) {
    for (const key in error.constraints) {
      console.log(error.constraints, key);
      const message = error.constraints[key];
      errorsMapper.push({ property: error.property, message: message });
    }
  }

  return new BadRequestException({ errors: errorsMapper, message: 'Campo(s) inválido(s)' }, 'Campo(s) inválido(s)')
};

const validationPipeOptions = { stopAtFirstError: true, exceptionFactory } as ValidationPipeOptions;

export const validationPipe = () => new ValidationPipe(validationPipeOptions)