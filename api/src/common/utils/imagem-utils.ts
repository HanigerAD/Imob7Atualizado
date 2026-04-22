import * as sharp from "sharp";

export class ImagemUtils {
  static getAcceptedExts() {
    return ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];
  }

  static getKbytesOfBuffer(buffer) {
    return Math.trunc(buffer.length / 1024);
  }

  async tratarImagem(imageBuffer: Buffer, config: { maxWidth: number, maxHeight: number, maxKbytes: number }): Promise<Buffer> {
    let quality = 90;
    let width = config.maxWidth;
    let height = config.maxHeight;
    
    let buffer = imageBuffer;
    let lastBufferKbytes = ImagemUtils.getKbytesOfBuffer(buffer);
    
    const image = await sharp(buffer);
    const { width: originalWidth, height: originalHeight } = await image.metadata();

    if (originalWidth <= config.maxWidth && originalHeight <= config.maxHeight) {
      width = originalWidth;
      height = originalHeight;
    }

    const resize = async () => {
      let kbytes = ImagemUtils.getKbytesOfBuffer(buffer);

      if (kbytes > config.maxKbytes) {
        const newBuffer = await sharp(buffer)
          .resize(width, height, {
            fit: 'inside'
          })
          .withMetadata()
          .toFormat('jpeg', {
            progressive: true,
            quality: quality,
          })
          .toBuffer();

        if (kbytes == lastBufferKbytes) {
          quality = quality - 10;

          if (quality <= 70) {
            width = Math.trunc(width - ((width * 20) / 100));
            height = Math.trunc(height - ((height * 20) / 100));
            quality = 90;
            buffer = imageBuffer;
            lastBufferKbytes = ImagemUtils.getKbytesOfBuffer(imageBuffer);
          } else {
            lastBufferKbytes = ImagemUtils.getKbytesOfBuffer(newBuffer);
            buffer = newBuffer;
          }
        }

        return resize();
      } else {
        return buffer;
      }
    }

    return resize();
  }
}