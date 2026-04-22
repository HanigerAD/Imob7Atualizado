import React from "react";
import {
  converterParaCep,
  converterParaCpf,
  converterParaMoeda,
  converterParaTelefone,
} from "../../../utils/parser.utils";

export function cep(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 9;
  let value = e.currentTarget.value;

  value = converterParaCep(value);

  e.currentTarget.value = value;
  return e;
}

export function currency(e: React.FormEvent<HTMLInputElement>) {
  let value = e.currentTarget.value;

  value = converterParaMoeda(value);

  e.currentTarget.value = value;
  return e;
}

export function cpf(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 14;
  let value = e.currentTarget.value;

  if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
    value = converterParaCpf(value);

    e.currentTarget.value = value;
  }

  return e;
}

export function phone(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 15;

  let value = e.currentTarget.value;

  value = converterParaTelefone(value);

  e.currentTarget.value = value;
  return e;
}
