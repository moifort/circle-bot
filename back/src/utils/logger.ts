// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  descriptor.value = function (...args: any[]) {
    const logPrefix = `[${target.name.toUpperCase()}]`
    const logFunction = `${propertyKey}(${args.length === 0 ? '' : args.map((arg) => JSON.stringify(arg)).join(', ')})`
    console.log(`${logPrefix} ${logFunction}`)
    return originalMethod.apply(this, args)
  }
  return descriptor
}
