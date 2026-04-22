import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "react-quill";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import { ObjectHelper } from "../../../helpers/object.helper";
import Input from "../../shared/input-generico";

export const MensagemPage = () => {
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

    navigate(`/admin/mensagens`);
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
      "subject",
      "message",
    ]);

    return newModel;
  }

  async function salvarMensagem(data: any) {
    const newModel = removeCamposSalvar(data);
    let code = modelId || "";

    if (code) {
      await apiService.patch(`/contact/messages/${code}`, newModel);
    } else {
      const resposta = await apiService.post(`/contact/message`, newModel);

      code = resposta.data[0];
    }

    return code;
  }

  async function salvar(data: any) {
    setCarregando(true);

    try {
      let code = await salvarMensagem(data);

      toast.success("Registro salvo com sucesso");
      setCarregando(false);

      if (code != modelId) {
        navigate(`/admin/mensagens/${code}`);
      } else {
        buscar(code);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        "Houve um erro ao salvar a Mensagem. Verifique se os campos foram preenchidos corretamente"
      );
      setCarregando(false);
    }
  }

  async function buscar(modelId: string) {
    setCarregando(true);
    setModel({});

    try {
      const resposta = await apiService.get(`/contact/messages/${modelId}`);

      const newModel = Object.assign({}, resposta.data);

      setModelAnt(newModel);
      setModel(newModel);

      setCarregando(false);
    } catch (error) {
      console.log({ error });
      toast.error("Houve um erro ao buscar a Mensagem.");
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
        <h1>Mensagem</h1>
      </div>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">Mensagens</li>
        <li className="breadcrumb-item active">Mensagem</li>
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

              <div className="col-md-8">
                <Input
                  id="input-subject"
                  label="Assunto"
                  placeholder="Assunto"
                  value={model.subject || ""}
                  onChange={(e) =>
                    atualizarModel("subject", e.currentTarget.value)
                  }
                />
              </div>
            </div>

            <TextEditor
              placeholder="Mensagem"
              className=" mb-3"
              theme="snow"
              value={model?.message || ""}
              onChange={(value) => atualizarModel("message", value)}
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
