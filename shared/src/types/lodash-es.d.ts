declare module "lodash-es" {
    export function meanBy<T>(collection: ArrayLike<T>, iteratee: (item: T) => number): number;
    export function maxBy<T>(collection: ArrayLike<T>, iteratee: (item: T) => number): T | undefined;
    export function minBy<T>(collection: ArrayLike<T>, iteratee: (item: T) => number): T | undefined;
    export function uniq<T>(array: ArrayLike<T>): T[];
    export function isEqual(value: any, other: any): boolean;
    export function xorWith<T>(array: T[], ...args: any[]): T[];
    export function capitalize(string: string): string;
    export function differenceWith<T>(array: T[], values: T[], comparator?: (arrVal: T, othVal: T) => boolean): T[];
    export function uniqueId(prefix?: string): string;
    export function trim(string: string, chars?: string): string;
    export function range(start: number, end?: number, step?: number): number[];
    export function sample<T>(collection: T[]): T | undefined;
    export function times<T>(n: number, iteratee: (num: number) => T): T[];
    export function round(number: number, precision?: number): number;
    export function clone<T>(value: T): T;
    export function cloneDeep<T>(value: T): T;
    export function omit<T>(object: T, ...paths: string[]): Partial<T>;
}