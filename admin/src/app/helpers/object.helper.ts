export class ObjectHelper {
  static mantemSomenteCampos(objeto: any, campos: string[]) {
    const propriedades = Object.keys(objeto);

    const newObjeto = Object.assign({});

    for (let campo of campos) {
      const existe = propriedades.includes(campo);

      if (existe) {
        newObjeto[campo] = objeto[campo];
      }
    }

    return newObjeto;
  }
}
