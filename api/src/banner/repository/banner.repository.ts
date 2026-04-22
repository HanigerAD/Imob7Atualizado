import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";
import { BannerEntity } from "../entity/banner.entity";

@Injectable()
export class BannerRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  public insert(image: string): Promise<number> {
    return this.knex.insert({ imagem: image }).into("banner");
  }

  public getAll(): Promise<BannerEntity[]> {
    return this.knex.select("*").from("banner");
  }

  public getSingle(code): Promise<BannerEntity> {
    return this.knex
      .select("*")
      .from("banner")
      .where("codigo", "=", code)
      .first();
  }

  public delete(image: string): Promise<number> {
    return this.knex.delete().from("banner").where("imagem", "=", image);
  }
}
