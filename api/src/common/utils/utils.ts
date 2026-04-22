import {Injectable} from "@nestjs/common";

@Injectable()
export class UtilsService {
    public static clearObject(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj
    }
}
