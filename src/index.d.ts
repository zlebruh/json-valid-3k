declare module 'json-valid-3k' {
  function doItem(item: any, ruleValue: Object | String): {valid: Boolean, item: any}
  function doArray(arr: any[], rule: Object | String): {valid: Boolean, item: any[]};
  function doBranch(branch: Object, rules: Object): {valid: Boolean, tree: Object};
  export function validate(object: Object, schema: Object, logError: Boolean): {valid: Boolean, tree: Object};
}
