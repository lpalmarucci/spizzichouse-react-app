export function getInitialLetters(firstName: string, lastName: string) {
  return firstName.slice(0, 1).toUpperCase() + lastName.slice(0, 1).toUpperCase();
}
