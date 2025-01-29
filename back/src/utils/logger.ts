// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  descriptor.value = async function (...args: any[]) {
    const logPrefix = `[${target.name.toUpperCase()}]`
    const logFunction = `${propertyKey}(${args.length === 0 ? '' : args.map((arg) => JSON.stringify(arg)).join(', ')})`
    const result = await Promise.resolve(originalMethod.apply(this, args))
    const logReturn = result === undefined ? 'void' : Array.isArray(result) ? '' : JSON.stringify(result)
    console.log(`${logPrefix} ${logFunction} ${logReturn === 'void' ? '' : `-> ${logReturn}`}`)
    if (!logReturn) console.table(result)
    return result
  }
  return descriptor
}
