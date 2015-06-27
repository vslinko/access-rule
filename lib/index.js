/* @flow */

export type AccessObject = mixed
export type AccessSubject = mixed
export type AccessOperation = string
export type AccessRule = (object: AccessObject, subject: AccessSubject, operation: AccessOperation) => boolean

export var OP_GET = 'OP_GET'
export var OP_POST = 'OP_POST'
export var OP_PATCH = 'OP_PATCH'
export var OP_DELETE = 'OP_DELETE'

export var OP = {
  GET: OP_GET,
  POST: OP_POST,
  PATCH: OP_PATCH,
  DELETE: OP_DELETE
}

export function allow(object: AccessObject, subject: AccessSubject, operation: AccessOperation): boolean {
  return true
}

export function deny(object: AccessObject, subject: AccessSubject, operation: AccessOperation): boolean {
  return false
}

export function authorized(object: AccessObject, subject: AccessSubject, operation: AccessOperation): boolean {
  return !!subject
}

export type EveryRule = (rules: Array<AccessRule>) => AccessRule
export function everyRule(rules: Array<AccessRule>): AccessRule {
  return function(object: AccessObject, subject: AccessSubject, operation: AccessOperation): boolean {
    return rules.every(rule => rule(object, subject, operation))
  }
}

export type SomeRule = (rules: Array<AccessRule>) => AccessRule
export function someRule(rules: Array<AccessRule>): AccessRule {
  return function(object: AccessObject, subject: AccessSubject, operation: AccessOperation): boolean {
    return rules.some(rule => rule(object, subject, operation))
  }
}

export type ByOperationSchema = {[key: AccessOperation]: AccessRule}
export type ByOperation = (schema: ByOperationSchema) => AccessRule
export function byOperation(schema: ByOperationSchema): AccessRule {
  return function(object: AccessObject, subject: AccessSubject, operation: AccessOperation): boolean {
    return schema[operation](object, subject, operation)
  }
}
