import { InjectKnex, Knex } from "nestjs-knex";
import { Injectable } from "@nestjs/common";
import { PartnerEntity } from "../entity/partner.entity";

@Injectable()
export class PartnerRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  public insert(entity: PartnerEntity): Promise<number> {
    return this.knex.insert(entity).into("parceiro");
  }

  public getAll(): Promise<PartnerEntity[]> {
    return this.knex.select("*").from("parceiro");
  }

  public getSingle(code: number): Promise<PartnerEntity> {
    return this.knex
      .select("*")
      .from("parceiro")
      .where("codigo", "=", code)
      .first();
  }

  public update(code: number, entity: PartnerEntity): Promise<number> {
    return this.knex.update(entity).from("parceiro").where("codigo", "=", code);
  }

  public setImage(code: number, image: string): Promise<number> {
    return this.knex
      .update({ imagem: image })
      .from("parceiro")
      .where("codigo", "=", code);
  }

  public delete(code: number): Promise<number> {
    return this.knex.delete().from("parceiro").where("codigo", "=", code);
  }
}
