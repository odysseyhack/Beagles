export function getDateString(input: Date): string {
  return input.toISOString().slice(0, 10);
}

export function toIsoDateString(dateString: string): string {
  return getDateString(new Date(dateString));
}

export function getAge(birthDate: Date): number {
  const now: Date = new Date();
  let age: number = now.getFullYear() - birthDate.getFullYear();
  const m: number = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getStatus(expiryDate: Date): string {
  const now: Date = new Date(new Date().setHours(0, 0, 0, 0));
  return now < expiryDate ? "Active" : "Expired";
}

export function logObject(object: any, header: string | null = null): void {
  console.log("---------------------------------");
  if (header !== null) {
    console.log(header);
  }
  console.log(JSON.stringify(object, null, " "));
  console.log("---------------------------------");
}
