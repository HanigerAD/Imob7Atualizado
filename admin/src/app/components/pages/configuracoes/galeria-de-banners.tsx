import { imageFallback } from "../../../helpers/image-fallback";
import { CDN_URL } from "../../../services/cdn.service";
import { useMemo } from "react";

export const GaleriaDeBanners = ({
  imagens,
  onChange,
}: {
  imagens: any[];
  onChange: (imagens: any[]) => void;
}) => {
  function remover(image: any) {
    const imagemParaRemover = imagens.find(
      (imagem: any) => imagem.image == image
    );

    imagemParaRemover.remove = true;

    let newImagens = imagens.filter(
      (imagem: any) => imagem != imagemParaRemover
    );

    newImagens = [...newImagens, imagemParaRemover];

    onChange(newImagens);
  }

  function onImageChange(event: any) {
    event.preventDefault();

    let newImagens = [...imagens];

    for (const file of event.target.files) {
      newImagens.push({
        image: file,
        upload: true,
      });
    }

    newImagens = newImagens;

    onChange(newImagens);
  }

  function criarImagemTemp(imagem: any) {
    return URL.createObjectURL(imagem);
  }

  const imagensSemRemover = useMemo(() => {
    return imagens.filter(({ remove }) => !remove);
  }, [imagens]);

  return (
    <div className="row">
      {imagensSemRemover.map(({ image, title }, index) => (
        <div className="col-md-3 mb-3 mt-3" key={index}>
          <div className="card">
            <img
              className="card-img-top"
              src={
                typeof image == "string" ? `${CDN_URL}/${image}` : criarImagemTemp(image)
              }
              alt={title}
              onError={imageFallback}
            />
            <div className="card-body">
              <button
                className="btn btn-danger btn-sm btn-block"
                type="button"
                onClick={() => remover(image)}
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
          id="galeria-de-banner-add-file"
          accept="image/*"
          multiple
          onChange={onImageChange}
        />

        <label
          className="card text-center"
          style={{ cursor: "pointer" }}
          htmlFor="galeria-de-banner-add-file"
        >
          <div className="card-body">
            <i className="fa-regular fa-square-plus fa-10x"></i>
            <p>Adicionar Banners</p>
          </div>
        </label>
      </div>
    </div>
  );
};
