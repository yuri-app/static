type DateTime = String

interface StaticFile {
  name: string
  type: 'file'
  mtime: DateTime
  size: number
}

interface StaticDirectory {
  name: string
  type: 'directory'
  mtime: DateTime
}

interface ScopeResponse {
  origin: string
  path: string
}

export interface RootResponse {
  list: RootDirectory[]
}

interface RootDirectory {
  scope: string
  path: string
}


export type ListResponse = Array<StaticDirectory | StaticFile>

export async function fetchScope(scope: string) {
  const result: ScopeResponse | null = await (await fetch('/api/scope/' + scope, {
    headers: {
      "Content-Type": "application/json",
    }
  })).json()
  return result
}

export async function fetchRoot() {
  const result: RootResponse = await (await fetch('/api/root', {
    headers: {
      "Content-Type": "application/json",
    }
  })).json()
  return result
}

export async function fetchList(origin: string, path: string) {
  const result: ListResponse = await (await fetch(origin + '/' + path, {
    headers: {
      "Content-Type": "application/json",
    }
  })).json()
  return result
}
