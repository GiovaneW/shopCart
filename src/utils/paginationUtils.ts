import { constants } from '../config/constants'

interface PaginationData<T> {
    count: number,
    rows: Array<T>
}

export interface PaginatedData<T> extends PaginationData<T> {
    pages: number
}


export function setPages<T>(data: PaginationData<T>): void {
    const pages = Math.ceil(data.count / constants.limitPerPage)
    Object.assign(data, { pages })
} 