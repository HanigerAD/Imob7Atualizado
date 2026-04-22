const dotenv = require('dotenv');
const ftp = require('ftp');
const jimp = require('jimp');
dotenv.config();

const conexao = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

// buscar imagens
async function buscarImagens() {
    console.log('Buscando imagens...');
    const response = await conexao.select('foto').from('foto_imovel');

    return response.map(({ foto }) => foto);
}

async function buscarLogo() {
    console.log('Buscando logo...');
    const response = await conexao.select('logo').from('configuracao_site').where('codigo', 1);
    const { logo } = response[0];

    return logo;
}

// gerar watermark
async function gerarWatermark(bufferOriginal, logoUrl) {
    console.log(`gerando watermark...`);
    let image = await jimp.read(bufferOriginal);
    let watermark = await jimp.read(logoUrl);

    watermark.resize(image.bitmap.width / 5, jimp.AUTO);

    const LOGO_MARGIN_PERCENTAGE = 5;
    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

    const X = image.bitmap.width - watermark.bitmap.width - xMargin;
    const Y = image.bitmap.height - watermark.bitmap.height - yMargin;

    const mimeImage = image.getMIME();

    image = image.composite(watermark, X, Y, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.5
    });

    return await image.getBufferAsync(mimeImage);
}

// enviar para o cdn por ftp
async function enviarImagensParaCdn(files) {
    console.log(`enviando imagens para o cdn...`);
    return new Promise((resolve) => {
        const ftpClient = new ftp();

        ftpClient.on('ready', () => {
            files.forEach(file => ftpClient.put(file.buffer, process.env.CDN_DIRECTORY + file.name, (err) => {
                if (err) throw new Error('Erro ao enviar arquivo para o CDN')
                console.log(`imagem ${file.name} enviada`);
            }));

            ftpClient.end();
        });

        ftpClient.on('close', resolve);

        ftpClient.connect({
            host: process.env.CDN_HOST,
            user: process.env.CDN_USER,
            password: process.env.CDN_PASS,
            secure: false,
        });
    });
}

async function getBufferByUrl(url) {
    console.log(`baixando buffer da imagem ${url}...`);
    const image = await jimp.read(url);
    const mime = image.getMIME();
    const buffer = await image.getBufferAsync(mime);

    return buffer;
}

async function main() {
    const imagens = await buscarImagens();
    const logo = await buscarLogo();
    const imagensParaEnviar = [];

    for (let imagem of imagens) {
        const bufferOriginal = await getBufferByUrl(`${process.env.CDN_URL}/${imagem}`);
        const bufferGerado = await gerarWatermark(bufferOriginal, `${process.env.CDN_URL}/${logo}`);

        imagensParaEnviar.push({ name: `original-${imagem}`, buffer: bufferOriginal });
        imagensParaEnviar.push({ name: `${imagem}`, buffer: bufferGerado });
    }

    await enviarImagensParaCdn(imagensParaEnviar);
}

main().then(() => console.log('FEITO')).catch(console.error)