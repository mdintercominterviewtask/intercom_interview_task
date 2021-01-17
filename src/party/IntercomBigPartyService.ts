import { IAccount } from '../accounts/AccountModel'
import { IAccountRepository } from '../accounts/AccountRepository'
import { getGreatCircleDistance } from '../location/distance'
import { GetDistanceFct, ICoordinates } from '../location/types'

interface IIntercomBigPartyServiceConfig {
    accountRepository: IAccountRepository
    hqCoordinates: ICoordinates
    maxDistanceInKm: number
    getDistance?: GetDistanceFct
}

export class IntercomBigPartyService {
    private readonly accountRepository: IAccountRepository
    private readonly hqCoordinates: ICoordinates
    private readonly maxDistanceInKm: number
    private readonly getDistance: GetDistanceFct

    constructor(config: IIntercomBigPartyServiceConfig) {
        this.accountRepository = config.accountRepository
        this.hqCoordinates = config.hqCoordinates
        this.maxDistanceInKm = config.maxDistanceInKm
        this.getDistance = config.getDistance || getGreatCircleDistance
    }

    async getListOfInvitedAccounts(): Promise<Array<IAccount>> {
        return this.accountRepository.findAccounts(
            (account) =>
                this.getDistance(this.hqCoordinates, account) <=
                this.maxDistanceInKm * 1000
        )
    }
}
