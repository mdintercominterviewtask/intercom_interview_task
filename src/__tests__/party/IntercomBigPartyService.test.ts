import { FileAccountRepository } from '../../accounts/AccountRepository'
import { IntercomBigPartyService } from '../../party/IntercomBigPartyService'

describe('IntercomBigPartyService', () => {
    test('get list of invited accounts', async () => {
        const accountRepository = new FileAccountRepository(
            './src/__tests__/party/files/customers.txt'
        )
        const hqCoordinates = {
            latitude: 53.339428,
            longitude: -6.257664,
        }
        const maxDistanceInKm = 100

        const partyService = new IntercomBigPartyService({
            accountRepository,
            hqCoordinates,
            maxDistanceInKm,
        })

        expect(await partyService.getListOfInvitedAccounts()).toEqual([
            {
                latitude: 52.986375,
                longitude: -6.043701,
                name: 'Christina McArdle',
                userId: 12,
            },
            {
                latitude: 54.0894797,
                longitude: -6.18671,
                name: 'Eoin Ahearn',
                userId: 8,
            },
            {
                latitude: 53.038056,
                longitude: -7.653889,
                name: 'Stephen McArdle',
                userId: 26,
            },
        ])
    })
})
