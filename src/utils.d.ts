declare module 'utils' {
    export function extract(rule: Object | String): {type: null|String, props: any, children: any};
    export function invalidEmpty(item: Object, rule: Object, itemType: String): Boolean;
    export function getError(value: any, rule: String, isEmptyError?: Boolean): String;
    export function matchType(itemType: String, ruleType: String|Array): { TYPE: String, match: Boolean };
}
