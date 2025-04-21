import { v4 as uuidV4, validate, version } from 'uuid';

import { ICustomRequest } from "../../infrastructure/adapter/http/header";

export function validateUUID(req: ICustomRequest): string {
    const uuid: string = req.header('X-RqUID') as string;
    if (uuid !== '' && uuidValidateV4(uuid)) {
        return uuid;
    }
    return uuidV4();
}

function uuidValidateV4(uuid: string) {
    return validate(uuid) && version(uuid) === 4;
}
