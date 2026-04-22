import { HttpException, HttpStatus } from "@nestjs/common";

export class RepositoryException extends HttpException {
  constructor(objectOrError: string | object, description = "Repository") {
    super(
      HttpException.createBody(
        objectOrError,
        description,
        HttpStatus.INTERNAL_SERVER_ERROR
      ),
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
