import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import * as client from 'ftp';
import { CdnDto } from '../dto/cdn.dto';

@Injectable()
export class CdnService {
  public sendMultipleFilesToFTP(files: CdnDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const ftpClient = new client();

      // FTP EVENTS
      ftpClient.on('ready', () => {
        files.forEach(file => ftpClient.put(file.buffer, process.env.CDN_DIRECTORY + file.name, (err) => {
          if (err) reject(new InternalServerErrorException(err, 'Erro ao enviar arquivo para o CDN'))
        }));

        ftpClient.end();
      });

      ftpClient.on('close', () => {
        resolve()
      });

      ftpClient.on('error', (err) => {
        if (err) reject(new InternalServerErrorException(err, 'Erro ao enviar arquivo para o CDN'))
      });

      // FTP CONNECTION
      ftpClient.connect({
        host: process.env.CDN_HOST,
        user: process.env.CDN_USER,
        password: process.env.CDN_PASS,
        secure: false,
      });
    })
  }

  public sendSingleImageToFTP(file: CdnDto): Promise<void> {
    return new Promise((resolve, reject) => {
      const ftpClient = new client();

      // FTP EVENTS
      ftpClient.on('ready', () => {
        ftpClient.put(file.buffer, process.env.CDN_DIRECTORY + file.name, (err) => {
          if (err) reject(new InternalServerErrorException(err, 'Erro ao enviar arquivo para o CDN'))
        })

        ftpClient.end();
      });

      ftpClient.on('close', () => {
        resolve()
      });

      ftpClient.on('error', (err) => {
        if (err) reject(new InternalServerErrorException(err, 'Erro ao enviar arquivo para o CDN'))
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

  public sendSingleDocumentToFTP(file: Express.Multer.File): Promise<void> {
    return new Promise((resolve, reject) => {
      const ftpClient = new client();

      ftpClient.on('ready', () => {
        ftpClient.put(file.buffer, process.env.CDN_DIRECTORY + file.filename, (err) => {
          if (err) reject(new InternalServerErrorException(err, 'Erro ao enviar arquivo para o CDN'));
        })

        ftpClient.end();
      });

      ftpClient.on('close', () => {
        resolve()
      });

      ftpClient.on('error', (err) => {
        if (err) reject(new InternalServerErrorException(err, 'Erro ao enviar arquivo para o CDN'))
      });

      ftpClient.connect({
        host: process.env.CDN_HOST,
        user: process.env.CDN_USER,
        password: process.env.CDN_PASS,
        secure: false,
      });
    });
  }
}
