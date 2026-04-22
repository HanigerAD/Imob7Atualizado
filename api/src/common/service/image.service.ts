import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";
import { Response } from "express";
import * as Jimp from "jimp";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Builder } from "builder-pattern";
import { ImageRequest } from "../integration/request/image.request";
import { CdnService } from "./cdn.service";
import { CdnDto } from "../dto/cdn.dto";
import { ImageWatermark } from "../integration/request/image-watermark";
import { ImagemUtils } from "../utils/imagem-utils";
import { ImageSizeEnum } from "../enum/image-size.enum";
import fetch from "node-fetch";
import axios from "axios";

sharp.concurrency(1)

@Injectable()
export class ImageService {
  constructor(private cdnService: CdnService) { }

  get acceptedFormats(): string[] {
    return ["image/png", "image/jpg", "image/jpeg"];
  }

  public static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async saveImages(
    images: ImageRequest[],
    addWatermask = false,
    logoUrl = '',
    kbytes?: number
  ): Promise<void> {
    if (images?.length) {
      const validImages = images.filter((image) =>
        this.acceptedFormats.includes(image.file.mimetype)
      );

      const cdnDtos = await Promise.all(
        validImages.map((image) => this.prepararImagensParaCdn(image, addWatermask, logoUrl, kbytes))
      ).then(promissesResponse => promissesResponse.reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue)
      }, []));

      await this.cdnService.sendMultipleFilesToFTP(cdnDtos);
    }
  }

  public async saveImage(image: ImageRequest, addWatermask = false, logoUrl = '', kbytes?: number): Promise<void> {
    const cdnDtos = await this.prepararImagensParaCdn(image, addWatermask, logoUrl, kbytes);

    if (cdnDtos.length) {
      await this.cdnService.sendMultipleFilesToFTP(cdnDtos);
    }
  }

  public async applyWatermarkAndSubmitToCdn(images: ImageWatermark[], logoUrl: string, res: Response): Promise<void> {
    const cdnDtos = [];

    for (let image of images) {
      const bufferImagemComMarcaDagua = await this.aplicarMarcaDagua(image.originalFotoUrl, logoUrl);
      const cdnDtoImagemTratadaComMarcaDagua = this.buildCdnDto(bufferImagemComMarcaDagua, image.foto);
      cdnDtos.concat(cdnDtoImagemTratadaComMarcaDagua);
    }

    if (cdnDtos.length) {
      await this.cdnService.sendMultipleFilesToFTP(cdnDtos);
    }
  }

  private async prepararImagensParaCdn(image: ImageRequest, addWatermask = false, logoUrl = '', kbytes?: number): Promise<CdnDto[]> {
    if (image && this.acceptedFormats.includes(image.file.mimetype)) {
      const extensaoDaImagem = path.extname(image.file.originalname);
      const nomeDaImagem = this.gerarNomeParaImagem('', '', extensaoDaImagem);
      image.file.filename = nomeDaImagem;// altera nome do arquivo no contexto

      const bufferImagemTratada = await this.tratarImagem(image.file.buffer, image.width, image.height, kbytes);

      if (addWatermask) {
        const cdnDtoImagemTratada = this.buildCdnDto(bufferImagemTratada, `original-${nomeDaImagem}`);
        const bufferImagemComMarcaDagua = await this.aplicarMarcaDagua(bufferImagemTratada, logoUrl);
        const cdnDtoImagemTratadaComMarcaDagua = this.buildCdnDto(bufferImagemComMarcaDagua, nomeDaImagem);

        return [cdnDtoImagemTratada, cdnDtoImagemTratadaComMarcaDagua];
      } else {
        const cdnDtoImagemTratada = this.buildCdnDto(bufferImagemTratada, nomeDaImagem);

        return [cdnDtoImagemTratada];
      }
    }

    return [];
  }

  private async tratarImagem(imageBuffer: Buffer, maxWidth: number, maxHeight: number, maxKbytes = ImageSizeEnum.MAX_KBYTES): Promise<Buffer> {
    const imagemUtils = new ImagemUtils();
    const imagemTratada = await imagemUtils.tratarImagem(imageBuffer, { maxWidth, maxHeight, maxKbytes });
    return imagemTratada;
  }

  private async loadImageBuffer(image: string | Buffer): Promise<Buffer> {
    if (Buffer.isBuffer(image)) {
      return image;
    } else {
      const { data } = await axios({ url: image, responseType: "arraybuffer" });
      return data as Buffer;
    }
  }

  private async aplicarMarcaDagua(image: string | Buffer, logo: string | Buffer): Promise<Buffer> {

    const baseImageBuffer = await this.loadImageBuffer(image);
    const baseImage = sharp(baseImageBuffer).withMetadata();
  
    const watermarkBuffer = await this.loadImageBuffer(logo);
    const watermark = sharp(watermarkBuffer).withMetadata();
  
    const { width: baseImageWidth, height: baseImageHeight } = await baseImage.metadata();
    const { width: watermarkWidth, height: watermarkHeight } = await watermark.metadata();
  
    const newWatermarkWidth = baseImageWidth / 5;
    const newWatermarkHeight = watermarkHeight * (newWatermarkWidth / watermarkWidth);
  
    const resizedWatermarkBuffer = await watermark
      .resize(Math.round(newWatermarkWidth), Math.round(newWatermarkHeight), { fit: 'inside' })
      .withMetadata()
      .png()
      .toBuffer();
  
    // Usa os valores redimensionados para centralizar corretamente
    const X = Math.round((baseImageWidth - newWatermarkWidth) / 2);
    const Y = Math.round((baseImageHeight - newWatermarkHeight) / 2);
  
    const imageToComposite: sharp.OverlayOptions = {
      input: resizedWatermarkBuffer,
      left: X,
      top: Y
    };
  
    const compositeImage = await baseImage.composite([imageToComposite]).withMetadata();

    const finalImage = await compositeImage.toBuffer();

    return finalImage;
  }

  private gerarNomeParaImagem(prefix: string, suffix: string, ext: string): string {
    return `${prefix}${uuidv4()}${suffix}${ext}`;
  }

  private buildCdnDto(file: Buffer, fileName: string): CdnDto {
    return Builder<CdnDto>().buffer(file).name(fileName).build();
  }
}

