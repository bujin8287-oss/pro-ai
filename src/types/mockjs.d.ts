declare module 'mockjs' {
  interface MockjsSetupSettings {
    timeout?: string | number
  }

  interface MockjsStatic {
    mock(
      rurl: string | RegExp,
      rtype: string,
      template: any | ((options: any) => any),
    ): any
    mock(rurl: string | RegExp, template: any | ((options: any) => any)): any
    mock(template: any): any
    setup(settings: MockjsSetupSettings): void
    Random: any
  }

  const Mock: MockjsStatic
  export default Mock
}
