import {
    deserializeAccountDefault,
    FileAccountRepository,
} from '../../accounts/AccountRepository'

describe('FileAccountRepository', () => {
    test('Read accounts from file', async () => {
        const accountRepo = new FileAccountRepository(
            './src/__tests__/accounts/files/customers_good.txt'
        )

        const customers = []
        for await (const customer of accountRepo.getAll()) {
            customers.push(customer)
        }

        expect(customers).toEqual([
            {
                latitude: 52.986375,
                longitude: -6.043701,
                name: 'Christina McArdle',
                userId: 12,
            },
            {
                latitude: 51.92893,
                longitude: -10.27699,
                name: 'Alice Cahill',
                userId: 1,
            },
        ])
    })

    test('Read accounts and ignore failures', async () => {
        const accountRepo = new FileAccountRepository(
            './src/__tests__/accounts/files/customers_bad.txt'
        )

        const customers = []
        for await (const customer of accountRepo.getAll()) {
            customers.push(customer)
        }

        expect(customers).toEqual([
            {
                latitude: 52.986375,
                longitude: -6.043701,
                name: 'Christina McArdle',
                userId: 12,
            },
            {
                latitude: 51.92893,
                longitude: -10.27699,
                name: 'Alice Cahill',
                userId: 1,
            },
        ])
    })

    test('Read accounts and stop at first failure', async () => {
        const accountRepo = new FileAccountRepository(
            './src/__tests__/accounts/files/customers_bad.txt',
            deserializeAccountDefault,
            true
        )

        const readAccounts = async () => {
            const customers = []
            for await (const customer of accountRepo.getAll()) {
                customers.push(customer)
            }
            return customers
        }

        await expect(readAccounts).rejects.toThrowError()
    })

    test('Filter accounts', async () => {
        const accountRepo = new FileAccountRepository(
            './src/__tests__/accounts/files/customers_good.txt'
        )

        const accounts = await accountRepo.findAccounts(
            ({ name }) => name === 'Alice Cahill'
        )

        expect(accounts).toEqual([
            {
                latitude: 51.92893,
                longitude: -10.27699,
                name: 'Alice Cahill',
                userId: 1,
            },
        ])
    })

    describe('Deserialize json account', () => {
        test('success', () => {
            const accountAsString =
                '{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}'
            expect(deserializeAccountDefault(accountAsString, 0)).toEqual({
                latitude: 52.986375,
                longitude: -6.043701,
                name: 'Christina McArdle',
                userId: 12,
            })
        })

        test('Failed due to not being valid json', () => {
            const accountAsString = '{"latitude": "52.986375", "user_id": 12,'
            expect(() =>
                deserializeAccountDefault(accountAsString, 0)
            ).toThrowError()
        })

        test.each([['user_id'], ['name'], ['latitude'], ['longitude']])(
            'failed due to missing field %p',
            (missingField) => {
                const accountAsString =
                    '{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}'

                const removeField = (field: string) => {
                    const account = JSON.parse(accountAsString)
                    delete account[field]
                    return JSON.stringify(account)
                }

                expect(() =>
                    deserializeAccountDefault(removeField(missingField), 0)
                ).toThrowError()
            }
        )
    })
})
