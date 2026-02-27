declare module 'mockjs' {
  interface MockjsSetupSettings {
    timeout?: string | number
  }

  interface MockjsRandom {
    cname(): string
    city(): string
    county(): string
    integer(min: number, max: number): number
    date(format?: string): string
    pick<T>(arr: T[]): T
    guid(): string
    id(): string
    natural(min?: number, max?: number): number
    float(min: number, max: number, dmin?: number, dmax?: number): number
    character(pool?: string): string
    string(pool?: string, min?: number, max?: number): string
    range(start: number, stop?: number, step?: number): number[]
  }

  interface MockjsStatic {
    mock<T>(
      rurl: string | RegExp,
      rtype: string,
      template: Record<string, unknown> | ((options: Record<string, unknown>) => T),
    ): T
    mock<T>(
      rurl: string | RegExp,
      template: Record<string, unknown> | ((options: Record<string, unknown>) => T),
    ): T
    mock<T>(template: Record<string, unknown>): T
    setup(settings: MockjsSetupSettings): void
    Random: MockjsRandom
  }

  const Mock: MockjsStatic
  export default Mock
}
