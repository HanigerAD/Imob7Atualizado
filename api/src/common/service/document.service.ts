import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { Response } from "express";

import { CdnService } from "./cdn.service";
import { Builder } from "builder-pattern";
import { CdnDto } from "../dto/cdn.dto";

@Injectable()
export class DocumentService {
  constructor(private cdnService: CdnService) {}

  get acceptedFormats(): string[] {
    return [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
      "application/msword",
      "text/plain",
    ];
  }

  public async saveDocument(
    file: Express.Multer.File
  ): Promise<void> {
    if (file && this.acceptedFormats.includes(file.mimetype)) {
      const cdnDtos = await this.prepareFileForCDN(file);
      fs.writeFile("./uploads/" + cdnDtos.name, cdnDtos.buffer, () => {});
      return this.cdnService.sendSingleDocumentToFTP(file);
    } else {
      return null;
    }
  }

  private async prepareFileForCDN(file: Express.Multer.File): Promise<CdnDto> {
    file.filename = this.renameFile(file.originalname);
    const fileBuffer = file.buffer;
    return this.buildCdnDto(fileBuffer, file.filename);
  }

  private renameFile(originalName: string): string {
    return uuidv4() + path.extname(originalName);
  }

  private buildCdnDto(file: Buffer, fileName: string): CdnDto {
    return Builder<CdnDto>().buffer(file).name(fileName).build();
  }
}
