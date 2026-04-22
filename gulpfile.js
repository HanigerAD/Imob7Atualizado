const { exec } = require("child_process");
const path = require("path");
const { src, dest } = require("gulp");

async function startBuildContainer(container) {
  return new Promise((resolve, reject) => {
    exec(`docker compose up ${container} -d`, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

async function stopBuildContainer(container) {
  return new Promise((resolve, reject) => {
    exec(`docker compose down ${container}`, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

async function execBuildInContainer(container) {
  return new Promise((resolve, reject) => {
    exec(`docker exec ${container} npm run build`, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

async function build(container) {
  await startBuildContainer(container);
  await execBuildInContainer(`imob7-${container}`);
  await stopBuildContainer(container);
}

async function buildSite() {
  await build("site");
}

async function buildAdmin() {
  await build("admin");
}

async function buildApi() {
  await build("api");
}

async function limparServerSite() {
  const { deleteAsync } = await import("del");

  return deleteAsync([path.join(__dirname, "server_site", "public")]);
}

async function limparServerAdmin() {
  const { deleteAsync } = await import("del");

  return deleteAsync([path.join(__dirname, "server_admin", "public")]);
}

async function copiarArquivosParaServerSite() {
  return src("site/dist/sete-setembro-site/**/*.*").pipe(
    dest("server_site/public/")
  );
}

async function copiarArquivosParaServerAdmin() {
  return src("admin/build/**/*.*").pipe(dest("server_admin/public/"));
}

async function main() {
  // console.log("Realizando build da Api");
  // await buildApi();
  // console.log("Build da Api realizado");
  // console.log("Realizando build do Admin");
  // await buildAdmin();
  console.log("Limpando Server Admin");
  await limparServerAdmin();
  console.log("Copiando Arquivos para Server Admin");
  await copiarArquivosParaServerAdmin();
  // console.log("Build do Admin realizado");
  // console.log("Realizando build do Site");
  // await buildSite();
  console.log("Limpando Server Site");
  await limparServerSite();
  console.log("Copiando Arquivos para Server Site");
  await copiarArquivosParaServerSite();
  // console.log("Finalizando maquinas de build");
}

exports.default = main;
