declare module 'json-valid-3k' {
  interface Obj {
    [key: string]: {
      [key: string]: unknown
    }
  }
  interface ValidationResponse {
    valid: boolean
    tree: Obj
    dropped: Map
    errors: Map
  }
  interface RuleInterface {
    type: string
    props: { [key: string]: Rule }
    children: { [key: string]: Rule }
    optional?: boolean
    default?: unknown
    allowEmpty?: boolean
    silentDrop?: boolean
  }
  type Rule = string | RuleInterface
  type Rules = { [key: string]: Rule }

  export function validate(object: Obj, schema: Obj): ValidationResponse
  export const types: Map<K, V>
}
