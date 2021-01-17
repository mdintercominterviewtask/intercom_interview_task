import { getGreatCircleDistance } from '../../location/distance'

describe('distance', () => {
    test('greate circle distance', () => {
        expect(
            getGreatCircleDistance(
                { latitude: 52.986375, longitude: -6.043701 },
                {
                    latitude: 53.339428,
                    longitude: -6.257664,
                }
            )
        ).toEqual(41815.51617654177)
    })
})
