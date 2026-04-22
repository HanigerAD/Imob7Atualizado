"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const xmlbuilder2_1 = require("xmlbuilder2");
const common_1 = require("@nestjs/common");
const builder_pattern_1 = require("builder-pattern");
const agent_response_1 = require("../../../agent/integration/response/agent.response");
const city_response_1 = require("../../../locality/city/integration/response/city.response");
const agent_mapper_1 = require("../../../agent/mapper/agent.mapper");
const image_size_enum_1 = require("../../../common/enum/image-size.enum");
const document_service_1 = require("../../../common/service/document.service");
const image_service_1 = require("../../../common/service/image.service");
const utils_1 = require("../../../common/utils/utils");
const city_service_1 = require("../../../locality/city/service/city.service");
const federative_unit_service_1 = require("../../../locality/federative-unit/service/federative-unit.service");
const neighborhood_service_1 = require("../../../locality/neighborhood/service/neighborhood.service");
const category_mapper_1 = require("../../category/mapper/category.mapper");
const zone_mapper_1 = require("../../zone/mapper/zone.mapper");
const property_detail_builder_1 = require("../builder/property-detail.builder");
const property_filter_mapper_1 = require("../mapper/property-filter.mapper");
const property_mapper_1 = require("../mapper/property.mapper");
const property_repository_1 = require("../repository/property.repository");
const conservation_state_mapper_1 = require("./../../conservation-state/mapper/conservation-state.mapper");
const profile_mapper_1 = require("./../../profile/mapper/profile.mapper");
const transaction_mapper_1 = require("./../../transaction/mapper/transaction.mapper");
const type_mapper_1 = require("./../../type/mapper/type.mapper");
const image_mapper_1 = require("./../mapper/image.mapper");
const property_document_mapper_1 = require("../mapper/property-document.mapper");
const log_mapper_1 = require("../mapper/log.mapper");
const table_field_enum_1 = require("../table-field.enum");
const situation_mapper_1 = require("../../../user/mapper/situation.mapper");
const configuration_service_1 = require("../../../configuration/service/configuration.service");
const image_watermark_1 = require("../../../common/integration/request/image-watermark");
let PropertyService = class PropertyService {
    constructor(repository, neighborhoodService, cityService, federativeUnitService, imageService, documentService, configurationService) {
        this.repository = repository;
        this.neighborhoodService = neighborhoodService;
        this.cityService = cityService;
        this.federativeUnitService = federativeUnitService;
        this.imageService = imageService;
        this.documentService = documentService;
        this.configurationService = configurationService;
    }
    async insertProperty(request) {
        const _a = property_mapper_1.PropertyMapper.requestToEntity(request), { municipio } = _a, propertyDetailEntity = __rest(_a, ["municipio"]);
        return this.repository.insertProperty(propertyDetailEntity);
    }
    async insertCategory(request) {
        return this.repository.insertCategory(category_mapper_1.CategoryMapper.requestToEntity(request));
    }
    updateCategory(code, request) {
        return this.repository.updateCategory(code, category_mapper_1.CategoryMapper.requestToEntity(request));
    }
    async deleteCategory(code) {
        const properties = await this.getPropertiesByCategory(code);
        if ((properties && properties.length)) {
            const message = 'N閬攐 foi possivel deletar o registro pois o mesmo contem outros registros vinculados.';
            throw new common_1.BadRequestException({
                message,
                properties,
            }, message);
        }
        else {
            try {
                return this.repository.deleteCategory(code);
            }
            catch (error) {
                throw new common_1.ConflictException(error, 'Erro ao executar comando no banco de dados');
            }
        }
    }
    async update(code, request) {
        const _a = property_mapper_1.PropertyMapper.requestToEntity(request), { municipio } = _a, propertyDetailEntity = __rest(_a, ["municipio"]);
        return this.repository.update(code, propertyDetailEntity);
    }
    getAllProperties(filter) {
        const filters = property_filter_mapper_1.PropertyFilterMapper.requestToEntity(filter);
        return this.repository.getAll(utils_1.UtilsService.clearObject(filters))
            .then(properties => property_mapper_1.PropertyMapper.entityListToResponse(properties));
    }
    getAllPropertiesCounter(filter) {
        const filters = property_filter_mapper_1.PropertyFilterMapper.requestToEntity(filter);
        return this.repository.getAllCounter(utils_1.UtilsService.clearObject(filters));
    }
    async generateImagesWithWatermark(res) {
        let allImagesOfPropertiesResponse = await this.repository.getAllPropertiesImagesUrls();
        let allImagesOfProperties = allImagesOfPropertiesResponse.map(({ foto }) => ({
            foto,
            originalFoto: `original-${foto}`,
            originalFotoUrl: `${process.env.CDN_URL}/original-${foto}`,
        }));
        const { logo: logoImageName } = await this.configurationService.get();
        const logoUrl = `${process.env.CDN_URL}/${logoImageName}`;
        return this.imageService.applyWatermarkAndSubmitToCdn(allImagesOfProperties, logoUrl, res);
    }
    getSingle(code) {
        return this.repository.getSingle(code)
            .then(result => property_mapper_1.PropertyMapper.entityDetailToDto(result))
            .then(property => this.buildDetailedResponse(property));
    }
    async buildDetailedResponse(property) {
        const builder = new property_detail_builder_1.PropertyDetailBuilder();
        builder.setProperty(property);
        if (property.code) {
            builder.setAgent(await this.getAgent(property.code));
            builder.setCategory(await this.getCategoryByProperty(property.code));
            builder.setConservationState(await this.getConservationState(property.code));
            builder.setProfile(await this.getprofile(property.code));
            builder.setType(await this.getType(property.code));
            builder.setZone(await this.getZone(property.code));
            builder.setTransaction(await this.getTransaction(property.code));
        }
        if (property.neighborhood) {
            const neighborhood = await this.neighborhoodService.getSingle(property.neighborhood);
            builder.setNeighborhood(neighborhood);
            if (neighborhood && neighborhood.city) {
                const city = await this.cityService.getSingle(Number(neighborhood.city));
                builder.setCity(city);
                if (city && city.code) {
                    builder.setFederativeUnit(await this.federativeUnitService.getByCity(city.code));
                }
            }
        }
        if (property.code) {
            builder.setSituation(await this.getSituation(property.code));
        }
        return builder.build();
    }
    getCity(code) {
        return this.cityService.getSingle(code);
    }
    getNeighborhood(code) {
        return this.neighborhoodService.getSingle(code);
    }
    getPropertiesByCategory(code) {
        return this.repository.getAll({ paginacao: { pagina: 1, porPagina: 1000 }, categoria: String(code) })
            .then(result => property_mapper_1.PropertyMapper.entityListToResponse(result));
    }
    getCategory(code) {
        return this.repository.getCategory(code)
            .then(result => category_mapper_1.CategoryMapper.entityToResponse(result));
    }
    getCategoryByProperty(code) {
        return this.repository.getCategoryByProperty(code)
            .then(result => category_mapper_1.CategoryMapper.entityToResponse(result));
    }
    getAgent(code) {
        return this.repository.getAgent(code)
            .then(result => agent_mapper_1.AgentMapper.entityToResponse(result));
    }
    getConservationState(code) {
        return this.repository.getConservationState(code)
            .then(result => conservation_state_mapper_1.ConservationStateMapper.entityToResponse(result));
    }
    getprofile(code) {
        return this.repository.getprofile(code)
            .then(result => profile_mapper_1.ProfileMapper.entityToResponse(result));
    }
    getZone(code) {
        return this.repository.getZone(code)
            .then(result => zone_mapper_1.ZoneMapper.entityToResponse(result));
    }
    getType(code) {
        return this.repository.getType(code)
            .then(result => type_mapper_1.TypeMapper.entityToResponse(result));
    }
    getSituation(code) {
        return this.repository.getSituation(code)
            .then(result => situation_mapper_1.SituationMapper.entityToResponse(result));
    }
    getTransaction(code) {
        return this.repository.getTransaction(code)
            .then(transaction => transaction_mapper_1.TransactionMapper.entityToResponse(transaction));
    }
    getRentCounter() {
        return this.repository.rentPropertyCounter()
            .then(result => result[0].registers);
    }
    getSellCounter() {
        return this.repository.sellPropertyCounter()
            .then(result => result[0].registers);
    }
    getPropertyImagesUrls(code) {
        return this.repository.getPropertyImagesUrls(code)
            .then(result => result === null || result === void 0 ? void 0 : result.map(entity => entity.foto));
    }
    getPropertyDocuments(code) {
        return this.repository.getPropertyDocuments(code)
            .then(documents => documents.map(document => property_document_mapper_1.PropertyDocumentMapper.mapPropertyDocumentEntityToResponse(document)));
    }
    async insertPropertyImages(files, propertyCode) {
        const { logo: logoImageName } = await this.configurationService.get();
        const logoUrl = `${process.env.CDN_URL}/${logoImageName}`;
        await this.imageService.saveImages(this.buildPropertyImage(files), true, logoUrl, image_size_enum_1.ImageSizeEnum.PROPERTY_KBYTES);
        await Promise.all(files.map((file, i) => this.repository.insertPropertyImages(file.filename, i, propertyCode)));
        return true;
    }
    async insertPropertyImage(file, propertyCode, order) {
        const { logo: logoImageName } = await this.configurationService.get();
        const logoUrl = `${process.env.CDN_URL}/${logoImageName}`;
        try {
            await this.imageService.saveImage(this.buildPropertyImageRequest(file), true, logoUrl, image_size_enum_1.ImageSizeEnum.PROPERTY_KBYTES);
            await this.repository.insertPropertyImage(file.filename, order, propertyCode);
        }
        catch (error) {
            console.log('insertPropertyImage', { error });
            throw error;
        }
        return true;
    }
    async updateImagesSort(imagesSort) {
        await Promise.all(imagesSort.map(image => this.repository.updateImagesSort(image)));
    }
    async insertPropertyDocument(file, propertyCode) {
        const newFile = this.buildPropertyDocument(file);
        await this.documentService.saveDocument(newFile);
        await this.repository.insertPropertyDocument(newFile.filename, newFile.originalname, propertyCode);
    }
    insertDocuments(files, propertyCode, res) {
        Promise.all(files.map(file => this.documentService.saveDocument(file)));
        Promise.all(files.map(file => this.repository.insertPropertyDocument(file.filename, file.originalname, propertyCode)));
    }
    buildPropertyDocument(file) {
        return file;
    }
    buildPropertyImage(files) {
        return files === null || files === void 0 ? void 0 : files.map(file => (0, builder_pattern_1.Builder)()
            .file(file)
            .width(image_size_enum_1.ImageSizeEnum.PROPERTY_WIDTH)
            .height(image_size_enum_1.ImageSizeEnum.PROPERTY_HEIGHT)
            .build());
    }
    buildPropertyImageRequest(file) {
        return (0, builder_pattern_1.Builder)()
            .file(file)
            .width(image_size_enum_1.ImageSizeEnum.PROPERTY_WIDTH)
            .height(image_size_enum_1.ImageSizeEnum.PROPERTY_HEIGHT)
            .build();
    }
    getPropertyImages(propertyCode) {
        return this.repository.getPropertyImages(propertyCode)
            .then(entities => image_mapper_1.ImageMapper.entityListToResponse(entities));
    }
    async deleteImages(paths) {
        await Promise.all(paths.map(path => this.repository.deleteImage(path)));
    }
    async deleteDocuments(paths) {
        await Promise.all(paths.map(path => this.repository.deleteDocuments(path)));
    }
    delete(code) {
        return this.repository.delete(code);
    }
    async insertLogs(logRequest) {
        const entity = log_mapper_1.LogMapper.mapRequestListToEntity(logRequest);
        await Promise.all(entity.map(log => this.repository.insertLog(log)));
    }
    getLogs(propertyCode) {
        return this.repository.getLogs(propertyCode)
            .then(logs => log_mapper_1.LogMapper.mapEntityListToResponse(logs));
    }
    getValueLog(field, value) {
        const table = table_field_enum_1.TableFieldEnum[field];
        return this.repository.getValueLog(table, value)
            .then(response => response[0]);
    }
    async generateXmlFeed() {
    const sanitize = (str = "") => {
        try {
    return String(str)
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // remove caracteres invisíveis
      .replace(/[\uD800-\uDFFF]/g, "") // remove pares inválidos UTF-16
      .replace(/[^\x09\x0A\x0D\x20-\x7EÀ-ÿ]/g, "") // remove fora do intervalo permitido
      .replace(/\s+/g, " ") // normaliza espaços
      .trim();
  } catch {
    return "";
  }
    };

    const num = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    const isAbsolute = (url) => !!url && /^https?:\/\//i.test(url || "");
    const baseCdn = (process.env.CDN_URL || "").replace(/\/$/, "");
    const photoUrl = (name) => {
        if (!name) return "";
        return isAbsolute(name) ? name : (baseCdn ? `${baseCdn}/${name}` : name);
    };

    const properties = await this.getAllProperties({
        pagina: 1,
        porPagina: 1000,
    });

    const root = { Imoveis: { Imovel: [] } };

    for (const p of properties ?? []) {
        const endereco = {
            Logradouro: sanitize(p?.address?.street || p?.logradouro || ""),
            Numero: sanitize(p?.address?.number || p?.numero || ""),
            Bairro: sanitize(p?.neighborhood?.description || p?.neighborhood || ""),
            Cidade: sanitize(p?.city?.description || p?.city || ""),
            Estado: sanitize(p?.federativeUnit?.acronym || p?.uf || ""),
        };

        const fotos = [];
        if (p.photo) fotos.push({ "@principal": "1", "#": photoUrl(p.photo) });
        if (Array.isArray(p.images)) {
            for (const img of p.images) {
                const u = photoUrl(img);
                if (u) fotos.push({ "#": u });
            }
        }

        root.Imoveis.Imovel.push({
            CodigoImovel: sanitize(p.code || p.internalCode || ""),
            TituloImovel: sanitize(p.title || ""),
            TipoImovel: sanitize(p.type?.description || ""),
            CategoriaImovel: sanitize(p.category?.description || ""),
            ValorVenda: num(p.sellPrice || (String(p.transaction).toLowerCase() === "venda" ? p.price : 0)),
            ValorLocacao: num(p.rentPrice || (String(p.transaction).toLowerCase() === "aluguel" ? p.price : 0)),
            AreaTotal: num(p.totalArea || 0),
            Dormitorios: num(p.bedrooms || 0),
            Banheiros: num(p.bathrooms || 0),
            Garagens: num(p.garages || 0),
            Descricao: sanitize(p.description || p.descricao || ""),
            Endereco: endereco,
            Fotos: { Foto: fotos },
        });
    }

    const { create } = require("xmlbuilder2");
    const doc = create({ version: "1.0", encoding: "UTF-8" }).ele(root);

    return doc.end({ prettyPrint: true });
}

};
PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [property_repository_1.PropertyRepository,
        neighborhood_service_1.NeighborhoodService,
        city_service_1.CityService,
        federative_unit_service_1.FederativeUnitService,
        image_service_1.ImageService,
        document_service_1.DocumentService,
        configuration_service_1.ConfigurationService])
], PropertyService);
exports.PropertyService = PropertyService;
//# sourceMappingURL=property.service.js.map