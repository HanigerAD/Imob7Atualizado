const dotenv = require('dotenv');
const FtpClient = require('ftp');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const sharp = require('sharp');

dotenv.config();

function array_chunk(arr, len) {
  let chunks = [], i = 0, n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }
  return chunks
}

class LogUtils {
  static log(mensagem) {
    const data = new Date();
    console.log(`[${data.toLocaleDateString()} ${data.toLocaleTimeString()}] ${mensagem}`);
  }
}

class FileUtils {
  static salvarArquivo(arquivo, conteudo) {
    return fs.writeFileSync(arquivo, conteudo);
  }

  static async salvarArquivoJson(arquivo, conteudo) {
    return new Promise((resolve, reject) => {
      fs.writeFile(arquivo, JSON.stringify(conteudo), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async lerArquivoJson(arquivo) {
    return new Promise((resolve, reject) => {
      fs.readFile(arquivo, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const objetoParseado = JSON.parse(data);
          resolve(objetoParseado);
        }
      });
    });
  }
}

class Repositorio {
  static async listarArquivos() {
    return new Promise((resolve, reject) => {
      let ftpClient = new FtpClient();

      ftpClient.on('ready', function () {
        ftpClient.list(`./${process.env.CDN_DIRECTORY}`, function (err, list) {
          if (err) {
            reject(err);
          } else {
            resolve(list && list.length ? list.map(({ name }) => name) : []);
            ftpClient.end();
          }
        });
      });

      ftpClient.connect({
        host: process.env.CDN_HOST,
        user: process.env.CDN_USER,
        password: process.env.CDN_PASS,
        secure: false,
      });
    });
  }

  static async enviarArquivos(arquivos) {
    return new Promise((resolve, reject) => {
      const ftpClient = new FtpClient();

      // FTP EVENTS
      ftpClient.on('ready', async () => {
        for (let arquivo of arquivos) {
          const put = async () => {
            return new Promise((resolve, reject) => {
              ftpClient.put(arquivo.buffer, process.env.CDN_DIRECTORY + arquivo.name, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              })
            });
          }

          LogUtils.log(`Enviando imagem ${arquivo.name} para o CDN`);
          await put();
          LogUtils.log(`Imagem ${arquivo.name} enviada com sucesso`);
        }

        ftpClient.end();
      });

      ftpClient.on('close', () => {
        LogUtils.log(`Images enviadas com sucesso`);
        resolve();
      });

      // FTP CONNECTION
      ftpClient.connect({
        host: process.env.CDN_HOST,
        user: process.env.CDN_USER,
        password: process.env.CDN_PASS,
        secure: false,
      });
    });
  }
}

class ImagemUtils {
  url = '';
  buffer = null;
  lastBufferKbytes = 0;
  quality = 95;
  width = 1920;
  height = 1080;
  MAX_WIDTH = 1920;
  MAX_HEIGHT = 1080;
  MAX_KBYTES = 300;

  static getAcceptedExts() {
    return ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];
  }

  static getKbytesOfBuffer(buffer) {
    return Math.trunc(buffer.length / 1024);
  }

  async tratarImagem(imagemUrl) {
    this.url = imagemUrl;

    LogUtils.log(`Tratando imagem ${this.url}`);

    const imageJimp = await jimp.read(this.url);
    const mime = imageJimp.getMIME();

    const initialBuffer = await imageJimp.getBufferAsync(mime);
    this.buffer = initialBuffer;
    this.lastBufferKbytes = ImagemUtils.getKbytesOfBuffer(this.buffer);

    const image = await sharp(this.buffer);
    const { width: originalWidth, height: originalHeight } = image.metadata();

    if (originalWidth <= this.MAX_WIDTH && originalHeight <= this.MAX_HEIGHT) {
      this.width = originalWidth;
      this.height = originalHeight;
    }

    LogUtils.log(`Dimensoes: ${this.width}x${this.height}`);
    LogUtils.log(`Tamanho: ${this.lastBufferKbytes}kb`);

    const resize = async () => {
      let kbytes = ImagemUtils.getKbytesOfBuffer(this.buffer);

      if (kbytes > this.MAX_KBYTES) {
        const newBuffer = await sharp(this.buffer)
          .resize(this.width, this.height, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFormat('jpeg', {
            progressive: true,
            quality: this.quality,
          })
          .toBuffer();

        if (kbytes == this.lastBufferKbytes) {
          this.quality = this.quality - 5;

          if (this.quality <= 70) {
            this.width = Math.trunc(this.width - ((this.width * 25) / 100));
            this.height = Math.trunc(this.height - ((this.height * 25) / 100));
            LogUtils.log(`Alterando dimensoes para: ${this.width}x${this.height}`);
            this.quality = 95;
            this.buffer = initialBuffer;
            this.lastBufferKbytes = ImagemUtils.getKbytesOfBuffer(initialBuffer);
          } else {
            this.lastBufferKbytes = ImagemUtils.getKbytesOfBuffer(newBuffer);
            this.buffer = newBuffer;
          }
        }

        LogUtils.log(`Alterando qualidade para: ${this.quality}%`);

        return resize();
      } else {
        LogUtils.log(`Dimensoes finais: ${this.width}x${this.height}`);
        LogUtils.log(`Tamanho final: ${ImagemUtils.getKbytesOfBuffer(this.buffer)}kb`);

        return this.buffer;
      }
    }

    return resize();
  }
}

async function main() {
  LogUtils.log('Iniciando aplicação');
  // const listaArquivos = await Repositorio.listarArquivos();
  // FileUtils.salvarArquivoJson('temp/arquivos.json', listaArquivos);
  const listaArquivos = await FileUtils.lerArquivoJson('temp/arquivos.json');
  const imagens = listaArquivos.filter(arquivo => ImagemUtils.getAcceptedExts().includes(path.extname(arquivo)));

  const parts = array_chunk(imagens, 20);

  for (let part of parts) {
    let imagensParaEnvio = [];

    for (let image of part) {
      try {
        const imagemUtils = new ImagemUtils();
        const imagemTratada = await imagemUtils.tratarImagem(`${process.env.CDN_URL}/${image}`);
        // FileUtils.salvarArquivo(`temp/${image}`, imagemTratada);
        imagensParaEnvio.push({ name: image, buffer: imagemTratada });
      } catch (err) {
        LogUtils.log(`Não foi possivel tratar a imagem ${image}`);
        const imagensComFalha = await FileUtils.lerArquivoJson('temp/imagens-com-falha.json') || [];
        imagensComFalha.push(image);
        FileUtils.salvarArquivoJson('temp/imagens-com-falha.json', imagensComFalha);
      }
    }

    if (imagensParaEnvio.length) {
      await Repositorio.enviarArquivos(imagensParaEnvio);
    }
  }

  LogUtils.log('aplicação Finalizada');
}

main().then().catch(console.error);