import {Injectable} from "@nestjs/common";
import {ContactRepository} from "../repository/contact.repository";
import {ContactMapper} from "../mapper/contact.mapper";
import {NewPropertyRequest} from "../integration/request/new-property.request";
import {NewPropertyResponse} from "../integration/response/new-property.response";
import {MessageRequest} from "../integration/request/message.request";
import {MessageResponse} from "../integration/response/message.response";

@Injectable()
export class ContactService {
    constructor(
        private repository: ContactRepository
    ) {
    }

    public insertNewPropertyContact(request: NewPropertyRequest): Promise<number> {
        return this.repository.insertNewPropertyContact(ContactMapper.newPropertyContactRequestToEntity(request))
    }

    public getAllNewPropertiesContacts(): Promise<NewPropertyResponse[]> {
        return this.repository.getAllNewPropertiesContacts()
            .then(posts => ContactMapper.newPropertyContactEntityListToResponse(posts));
    }

    public getSingleNewPropertyContact(code: number): Promise<NewPropertyResponse> {
        return this.repository.getSingleNewPropertyContact(code)
            .then(result => ContactMapper.newPropertyContactEntityToResponse(result));
    }

    public updateNewPropertyContact(code: number, request: NewPropertyRequest): Promise<number> {
        return this.repository.updateNewPropertyContact(code, ContactMapper.newPropertyContactRequestToEntity(request));
    }

    public deleteNewPropertiesContact(code: number): Promise<number> {
        return this.repository.deleteNewPropertiesContact(code);
    }

    public newPropertiesContactsCounter(): Promise<number> {
        return this.repository.newPropertiesContactsCounter()
            .then(result => result[0].registers);
    }

    public insertMessage(request: MessageRequest): Promise<number> {
        return this.repository.insertMessage(ContactMapper.messageContactRequestToEntity(request))
    }

    public getAllMessages(): Promise<MessageResponse[]> {
        return this.repository.getAllMessages()
            .then(posts => ContactMapper.messageEntityListToResponse(posts));
    }

    public getSingleMessage(code: number): Promise<MessageResponse> {
        return this.repository.getSingleMessage(code)
            .then(result => ContactMapper.messageContactEntityToResponse(result));
    }

    public updateMessage(code: number, request: MessageRequest): Promise<number> {
        return this.repository.updateMessage(code, ContactMapper.messageContactRequestToEntity(request));
    }

    public deleteMessage(code: number): Promise<number> {
        return this.repository.deleteMessage(code);
    }

    public messagesCounter(): Promise<number> {
        return this.repository.messagesCounter()
            .then(result => result[0].registers);
    }

}
