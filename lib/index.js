/* @flow */

export type AccessObject = mixed
export type AccessSubject = mixed
export type AccessOperation = string
export type AccessRule = (
  object: AccessObject,
  subject: AccessSubject,
  operation: AccessOperation
) => Promise<boolean>

export var OP_READ = 'OP_READ'
export var OP_CREATE = 'OP_CREATE'
export var OP_UPDATE = 'OP_UPDATE'
export var OP_DELETE = 'OP_DELETE'

export var OP = {
  READ: OP_READ,
  CREATE: OP_CREATE,
  UPDATE: OP_UPDATE,
  DELETE: OP_DELETE
}

export function allow(object: AccessObject, subject: AccessSubject, operation: AccessOperation): Promise<boolean> {
  return Promise.resolve(true)
}

export function deny(object: AccessObject, subject: AccessSubject, operation: AccessOperation): Promise<boolean> {
  return Promise.resolve(false)
}

export function authorized(object: AccessObject, subject: AccessSubject, operation: AccessOperation): Promise<boolean> {
  return Promise.resolve(!!subject)
}

export type EveryRule = (...rules: Array<AccessRule>) => AccessRule
export function everyRule(...rules: Array<AccessRule>): AccessRule {
  return function(object: AccessObject, subject: AccessSubject, operation: AccessOperation): Promise<boolean> {
    return Promise.all(
      rules.map(rule => rule(object, subject, operation))
    ).then(results => results.every(result => result))
  }
}

export type SomeRule = (...rules: Array<AccessRule>) => AccessRule
export function someRule(...rules: Array<AccessRule>): AccessRule {
  return function(object: AccessObject, subject: AccessSubject, operation: AccessOperation): Promise<boolean> {
    return Promise.all(
      rules.map(rule => rule(object, subject, operation))
    ).then(results => results.some(result => result))
  }
}

export type ByOperationSchema = {[key: AccessOperation]: AccessRule}
export type ByOperation = (schema: ByOperationSchema, defaultRule: ?AccessRule) => AccessRule
export function byOperation(schema: ByOperationSchema, defaultRule: AccessRule = deny): AccessRule {
  return function(object: AccessObject, subject: AccessSubject, operation: AccessOperation): Promise<boolean> {
    var rule: AccessRule = schema[operation] || defaultRule

    return rule(object, subject, operation)
  }
}
