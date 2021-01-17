export interface ICoordinates {
    latitude: number
    longitude: number
}

export type GetDistanceFct = (from: ICoordinates, to: ICoordinates) => number
