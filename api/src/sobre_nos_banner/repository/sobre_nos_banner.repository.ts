import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";
import { SobreNosBannerEntity } from "../entity/sobre_nos_banner.entity";

@Injectable()
export class SobreNosBannerRepository {
  constructor(@InjectKnex() private readonly knex: Knex) { }

  public async insert(image: string): Promise<number> {
    return this.knex.insert({ imagem: image }).into("sobre_nos_banner");
  }

  public async getAll(): Promise<SobreNosBannerEntity[]> {
    return this.knex.select("*").from("sobre_nos_banner");
  }

  public async getSingle(code): Promise<SobreNosBannerEntity> {
    return this.knex
      .select("*")
      .from("sobre_nos_banner")
      .where("codigo", "=", code)
      .first();
  }

  public async delete(image: string): Promise<number> {
    return this.knex.delete().from("sobre_nos_banner").where("imagem", "=", image);
  }
}
