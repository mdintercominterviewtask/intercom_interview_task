import { EARTH_RADIUS } from './constants'
import { GetDistanceFct, ICoordinates } from './types'

export const getGreatCircleDistance: GetDistanceFct = (
    from: ICoordinates,
    to: ICoordinates
): number => {
    const getRadian = (n: number) => (n * Math.PI) / 180

    const fromLon = getRadian(from.longitude)
    const fromLat = getRadian(from.latitude)
    const toLon = getRadian(to.longitude)
    const toLat = getRadian(to.latitude)

    const { cos, sin, acos } = Math

    const distance =
        acos(
            sin(fromLat) * sin(toLat) +
                cos(fromLat) * cos(toLat) * cos(fromLon - toLon)
        ) * EARTH_RADIUS

    return distance
}
