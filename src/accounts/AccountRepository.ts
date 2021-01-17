import fs from 'fs'
import readline from 'readline'
import { IAccount } from './AccountModel'

export interface IAccountRepository {
    getAll(): AsyncIterable<IAccount>
    findAccounts(
        where: (account: IAccount) => boolean
    ): Promise<Array<IAccount>>
}

export type DeserializeAccountFct = (
    line: string,
    lineNumber: number
) => IAccount

export class FileAccountRepository implements IAccountRepository {
    constructor(
        private readonly filename: string,
        private readonly deserialize: DeserializeAccountFct = deserializeAccountDefault,
        private readonly throwOnError: boolean = false
    ) {}

    async *getAll(): AsyncIterable<IAccount> {
        const readStream = readline.createInterface({
            input: fs.createReadStream(this.filename),
        })
        let lineNumber = 1
        for await (const line of readStream) {
            try {
                yield this.deserialize(line, lineNumber++)
            } catch (err) {
                if (this.throwOnError) {
                    throw err
                } // otherwise we just swallow the error
                console.error(err)
            }
        }
    }

    async findAccounts(
        where: (account: IAccount) => boolean
    ): Promise<Array<IAccount>> {
        const accounts = []
        for await (const account of this.getAll()) {
            if (where(account)) {
                accounts.push(account)
            }
        }
        return accounts
    }
}

export class AccountDeserializationError extends Error {
    constructor(line: string, lineNumber: number, error: string) {
        super(
            `Failed deserializing json into account object: ${line} - ${error} - at line ${lineNumber}.`
        )
    }
}

export const deserializeAccountDefault = (
    line: string,
    lineNumber: number
): IAccount => {
    const json = JSON.parse(line)

    const expectedProperties = ['user_id', 'name', 'longitude', 'latitude']
    expectedProperties.forEach((prop) => {
        if (!json.hasOwnProperty(prop)) {
            throw new AccountDeserializationError(
                line,
                lineNumber,
                `missing property ${prop}`
            )
        }
    })

    const latitude = parseFloat(json.latitude)
    if (isNaN(latitude)) {
        throw new AccountDeserializationError(
            line,
            lineNumber,
            `latitude ${json.latitude} is not a valid number`
        )
    }

    const longitude = parseFloat(json.longitude)
    if (isNaN(longitude)) {
        throw new AccountDeserializationError(
            line,
            lineNumber,
            `longitude ${json.longitude} is not a valid number`
        )
    }

    return {
        userId: json.user_id,
        name: json.name,
        longitude,
        latitude,
    }
}
