import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "react-quill";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import Input from "../../shared/input-generico";
import { SeletorBooleanoGenerico } from "../../shared/seletor-booleano-generico";

export const NovoImovelPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({} as any);
  const [modelAnt, setModelAnt] = useState({} as any);
  const [carregando, setCarregando] = useState(false);

  const modelId = params.code || null;

  function atualizarModel(chave: string, valor: any) {
    setModel((modelAnt: any) => ({ ...modelAnt, [chave]: valor }));
  }

  async function cancelar(event: any) {
    event.preventDefault();

    navigate(`/admin/novos-imoveis`);
  }

  async function manipularEnvio(event: any) {
    event.preventDefault();

    try {
      await salvar(model);
    } catch (error) {
      console.log({ error });
      setCarregando(false);
    }
  }

  function removeCamposSalvar(data: any) {
    let newModel = Object.assign({}, data);

    newModel = ObjectHelper.mantemSomenteCampos(newModel, [
      "fullname",
      "email",
      "phone",
      "address",
      "uf",
      "city",
      "neighborhood",
      "type",
      "privativeArea",
      "totalArea",
      "parking",
      "bedrooms",
      "condominium",
      "iptu",
      "finality",
      "paidout",
      "price",
      "description",
      "date",
    ]);

    return newModel;
  }

  async function salvarNovoImovel(data: any) {
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/contact/new-properties/${code}`, newModel);
    } else {
      const resposta = await apiService.post(`/contact/new-property`, newModel);

      code = resposta.data[0];
    }

    return code;
  }

  async function salvar(data: any) {
    setCarregando(true);

    try {
      let code = await salvarNovoImovel(data);

      toast.success("Registro salvo com sucesso");
      setCarregando(false);

      if (code != modelId) {
        navigate(`/admin/novos-imoveis/${code}`);
      } else {
        buscar(code);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        "Houve um erro ao salvar o Novo Imovel. Verifique se os campos foram preenchidos corretamente"
      );
      setCarregando(false);
    }
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});

    try {
      const resposta = await apiService.get(`/contact/new-properties/${modelId}`);

      const newModel = Object.assign({}, resposta.data);

      setModelAnt(newModel);
      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar o Novo Imovel.");
      setCarregando(false);
    }
  }

  useEffect(() => {
    setModelAnt({});

    if (modelId) {
      console.log({ modelId });
      buscar(modelId);
    }
  }, [modelId]);

  return (
    <div className="container-fluid px-4">
      <div className="mt-4">
        <h1>Novo Imovel</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Novos Imoveis</li>
        <li className="breadcrumb-item active">Novo Imovel</li>
      </ol>

      <form onSubmit={manipularEnvio}>
        <div className="card mb-4">
          <div className="card-header">Geral</div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <Input
                  id="input-fullname"
                  label="Nome Completo"
                  placeholder="Nome Completo"
                  value={model.fullname || ""}
                  onChange={(e) =>
                    atualizarModel("fullname", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <Input
                  id="input-email"
                  label="E-mail"
                  type="email"
                  placeholder="E-mail"
                  value={model.email || ""}
                  onChange={(e) =>
                    atualizarModel("email", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-phone"
                  label="Telefone"
                  placeholder="(00) 0 0000-0000"
                  mask="phone"
                  value={model.phone || ""}
                  onChange={(e) =>
                    atualizarModel("phone", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-address"
                  label="Endereço Completo"
                  value={model.address || ""}
                  onChange={(e) =>
                    atualizarModel("address", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-uf"
                    placeholder="UF"
                    value={model?.uf || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "uf",
                        event.target.value
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS" selected>Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                    <option value="EX">Estrangeiro</option>
                  </select>
                  <label htmlFor="input-uf">UF</label>
                </div>
              </div>

              <div className="col-md-4">
                <Input
                  id="input-city"
                  label="Cidade"
                  value={model.city || ""}
                  onChange={(e) =>
                    atualizarModel("city", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-neighborhood"
                  label="Bairro"
                  value={model.neighborhood || ""}
                  onChange={(e) =>
                    atualizarModel("neighborhood", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-type"
                    placeholder="Tipo"
                    value={model?.type || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "type",
                        event.target.value
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    <option data-display="state" value="Residencial" selected> Residencial </option>
                    <option data-display="state" value="Comercial"> Comercial </option>
                  </select>
                  <label htmlFor="input-type">Tipo</label>
                </div>
              </div>

              <div className="col-md-4">
                <Input
                  id="input-privativeArea"
                  label="Área privativa (m²)"
                  type="number"
                  value={model.privativeArea || ""}
                  onChange={(e) =>
                    atualizarModel("privativeArea", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-totalArea"
                  label="Área Total (m²)"
                  type="number"
                  value={model.totalArea || ""}
                  onChange={(e) =>
                    atualizarModel("totalArea", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-parking"
                  label="Vagas"
                  type="number"
                  value={model.parking || ""}
                  onChange={(e) =>
                    atualizarModel("parking", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-bedrooms"
                  label="Dormitórios"
                  type="number"
                  value={model.bedrooms || ""}
                  onChange={(e) =>
                    atualizarModel("bedrooms", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-condominium"
                  label="Valor condomínio (R$)"
                  mask="currency"
                  value={model.condominium || ""}
                  onChange={(e) =>
                    atualizarModel("condominium", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-iptu"
                  label="IPTU (R$)"
                  mask="currency"
                  value={model.iptu || ""}
                  onChange={(e) =>
                    atualizarModel("iptu", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="input-finality"
                    placeholder="Finalidade"
                    value={model?.finality || ""}
                    onChange={(event) =>
                      atualizarModel(
                        "finality",
                        event.target.value
                      )
                    }
                  >
                    <option value={""} disabled>
                      Selecione...
                    </option>
                    <option data-display="finality" value="Aluguel" selected> Aluguel </option>
                    <option data-display="finality" value="Venda" selected> Venda </option>
                  </select>
                  <label htmlFor="input-finality">Finalidade</label>
                </div>
              </div>

              <div className="col-md-4">
                <SeletorBooleanoGenerico
                  id="input-paidout"
                  label="Imóvel está pago?"
                  value={model?.paidout}
                  onChange={(value) => atualizarModel("paidout", value)}
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-price"
                  label="Valor (R$)"
                  mask="currency"
                  value={model.price || ""}
                  onChange={(e) =>
                    atualizarModel("price", e.currentTarget.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <Input
                  id="input-date"
                  label="Data"
                  type="date"
                  value={model.date || ""}
                  onChange={(e) =>
                    atualizarModel("date", e.currentTarget.value)
                  }
                />
              </div>
            </div>

            <TextEditor
              placeholder="Descrição"
              className=" mb-3"
              theme="snow"
              value={model?.description || ""}
              onChange={(value) => atualizarModel("description", value)}
            />
          </div>
        </div>

        <div className="d-inline-block w-100">
          <div className="float-end">
            <button
              className="btn btn-secondary mb-4"
              type="button"
              disabled={carregando}
              onClick={cancelar}
            >
              Cancelar
            </button>
            &nbsp;
            <button
              className="btn btn-success mb-4"
              type="submit"
              disabled={carregando}
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
