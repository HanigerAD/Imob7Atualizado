export const environment = {
  production: false,
  endpoint: {
    viaCep: "https://viacep.com.br",
    user: "http://localhost:3000/user",
    neighborhood: "http://localhost:3000/neighborhood",
    city: "http://localhost:3000/locality/city",
    uf: "http://localhost:3000/locality/uf",
    agent: "http://localhost:3000/agent",
    auth: "http://localhost:3000/auth",
    blog: "http://localhost:3000/blog",
    configuration: "http://localhost:3000/configuration",
    banner: "http://localhost:3000/banner",
    sobreNosBannerEndpoint: "http://localhost:3000/sobre-nos-banner",
    locality: "http://localhost:3000/locality",
    property: "http://localhost:3000/property",
    contact: "http://localhost:3000/contact",
    cdn: "http://cdn.imobiliaria7setembro.com.br/",
    partner: "http://localhost:3000/partner",
  },
  cdn: "http://cdn.imobiliaria7setembro.com.br",
};
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
