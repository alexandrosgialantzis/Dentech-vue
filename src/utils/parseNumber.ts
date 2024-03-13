export const parseAndCheckNumber = (arg: string): null | number => {
  const num = Number(arg)

  if (isNaN(num) || !isFinite(num)) {
    return null
  }

  return num
}
