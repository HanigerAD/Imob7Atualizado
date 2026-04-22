import { imageFallback } from "../../../helpers/image-fallback";
import { CDN_URL } from "../../../services/cdn.service";

export const VisualizarGaleriaDeImagens = ({
  imagens,
}: {
  imagens: any[];
}) => {
  return (
    <div className="row">
      {imagens.map(({ photo, title }, index) => {
        return (
          <div className="col-md-3 mb-3 mt-3" key={index}>
            <div className="card">
              <a href={`${CDN_URL}/original-${photo}`} className="show-hide-on-hover" target="_blank" style={{ position: 'relative' }}>
                <img
                  className="card-img-top"
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                  }}
                  src={`${CDN_URL}/original-${photo}`}
                  alt={title}
                  onError={imageFallback}
                />
                <div className="hide" style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: 'absolute'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}>
                    <span className="transform-translate-40" style={{
                      margin: 0,
                      position: 'absolute',
                      top: '40%',
                      left: '40%',
                      color: '#fff'
                    }}>Visualizar</span>
                  </div>
                </div>
              </a>
              <div className="card-body">
                <a
                  className="btn btn-primary btn-sm btn-block"
                  href={`${CDN_URL}/${photo}`}
                  rel="noreferrer"
                  target="_blank"
                  download={photo}
                >
                  Baixar
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};
