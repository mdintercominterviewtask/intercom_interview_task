import { Command, InvalidOptionArgumentError, Option } from 'commander'
import { FileAccountRepository } from './accounts/AccountRepository'
import { IntercomBigPartyService } from './party/IntercomBigPartyService'

const validateDistanceInput = (inputValue: string): number => {
    const distance = parseFloat(inputValue)
    if (isNaN(distance)) {
        throw new InvalidOptionArgumentError(
            `Not a valid distance: ${inputValue}`
        )
    }
    return distance
}

const run = async () => {
    const program = new Command()
    program
        .requiredOption('-f, --file <path>', 'File with the customer records')
        .addOption(
            new Option(
                '-d, --distance <number>',
                'Maximum distance wihthin which customers will be included'
            )
                .argParser(validateDistanceInput)
                .default(100, '100km')
        )

    program.parse(process.argv)

    const { file, distance } = program.opts()

    const partyService = new IntercomBigPartyService({
        accountRepository: new FileAccountRepository(file),
        hqCoordinates: {
            latitude: 53.339428,
            longitude: -6.257664,
        },
        maxDistanceInKm: distance,
    })

    const invitedAccounts = await partyService.getListOfInvitedAccounts()
    invitedAccounts
        .map(({ userId, name }) => ({ userId, name }))
        .forEach((account) => console.log(account))
}

run()
