import { CDN_URL } from "../../../services/cdn.service";
import { useMemo } from "react";

export const GaleriaDeDocumentos = ({
  documentos,
  onChange,
}: {
  documentos: any[];
  onChange: (documentos: any[]) => void;
}) => {
  function ajustarOrdem(documento: any, index: number) {
    const newOrder = index + 1;
    return {
      ...documento,
      order: newOrder,
    };
  }

  function tormarPrincipal(document: any) {
    const documentoPrincipal = documentos.find(
      (documento: any) => documento.document == document
    );

    let newDocumentos = documentos.filter(
      (documento: any) => documento != documentoPrincipal
    );

    newDocumentos = [documentoPrincipal, ...newDocumentos].map(ajustarOrdem);

    onChange(newDocumentos);
  }

  function remover(document: any) {
    const documentoParaRemover = documentos.find(
      (documento: any) => documento.document == document
    );

    documentoParaRemover.remove = true;

    let newDocumentos = documentos.filter(
      (documento: any) => documento != documentoParaRemover
    );

    newDocumentos = [...newDocumentos, documentoParaRemover].map(ajustarOrdem);

    onChange(newDocumentos);
  }

  function mover(fromIndex: number, toIndex: number) {
    let newDocumentos = [...documentos];

    const element = newDocumentos[fromIndex];
    newDocumentos.splice(fromIndex, 1);
    newDocumentos.splice(toIndex, 0, element);

    newDocumentos = newDocumentos.map(ajustarOrdem);

    onChange(newDocumentos);
  }

  function moverParaEsquerda(document: any) {
    const index = documentos.findIndex(
      (documento) => documento.document == document
    );
    mover(index, index - 1);
  }

  function moverParaDireita(document: any) {
    const index = documentos.findIndex(
      (documento) => documento.document == document
    );
    mover(index, index + 1);
  }

  function onDocumentChange(event: any) {
    event.preventDefault();

    let newDocumentos = [...documentos];

    for (const file of event.target.files) {
      newDocumentos.push({
        document: file,
        filename: file.name,
        upload: true,
      });
    }

    newDocumentos = newDocumentos.map(ajustarOrdem);

    onChange(newDocumentos);
  }

  function criarDocumentoTemp(documento: any) {
    return URL.createObjectURL(documento);
  }

  const documentosSemRemover = useMemo(() => {
    return documentos.filter(({ remove }) => !remove);
  }, [documentos]);

  return (
    <div className="row">
      {documentosSemRemover.map(({ document, filename }, index) => (
        <div className="col-md-3 mb-3 mt-3" key={index}>
          <div className="card">
            <div className="card-body">
              <div className="text-center p-2">
                <i className="fa-regular fa-file-lines fa-10x mb-2"></i>
                <p>{filename}</p>
              </div>

              <a
                className="btn btn-primary btn-sm btn-block"
                href={
                  typeof document == "string"
                    ? `${CDN_URL}/${document}`
                    : criarDocumentoTemp(document)
                }
                rel="noreferrer"
                target="_blank"
                download={filename}
              >
                Baixar
              </a>

              <button
                className="btn btn-danger btn-sm btn-block"
                type="button"
                onClick={() => remover(document)}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="col-md-3 mb-3 mt-3">
        <input
          type="file"
          className="d-none"
          id="add-document-file"
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,image/*"
          multiple
          onChange={onDocumentChange}
        />

        <label
          className="card text-center"
          style={{ cursor: "pointer" }}
          htmlFor="add-document-file"
        >
          <div className="card-body">
            <i className="fa-regular fa-square-plus fa-10x"></i>
            <p>Adicionar Documentos</p>
          </div>
        </label>
      </div>
    </div>
  );
};
