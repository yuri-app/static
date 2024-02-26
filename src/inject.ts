import { DataViewProps } from 'primevue/dataview';

export type Layout = DataViewProps['layout']

interface AppProvide {
  layout: Ref<Layout>
}

const appSymbol: InjectionKey<AppProvide> = Symbol('app')

export function appProvide(p: AppProvide) {
  return provide(appSymbol, p)
}

export function appInject() {
  return inject(appSymbol)!
}
