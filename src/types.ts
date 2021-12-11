export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
// entry types
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export type EntryTypes = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}
interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave: {
    startDate: string;
    endDate: string;
  };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Array<Entry>;
}

export type SinglePatient = Required<Patient>;

export function isString(element: unknown): element is string {
  return typeof element === "string" || element instanceof String;
}

export function isNull(element: unknown): element is null {
  return !!element;
}

function isGender(element: any): element is Gender {
  return Object.values(Gender).includes(element);
}

export function isNumber(element: unknown): element is number {
  return typeof element === "number" || element instanceof Number;
}

function isEntry(element: any): element is Entry {
  if (
    !isString(element.id) ||
    !isString(element.description) ||
    !isString(element.date) ||
    !isString(element.specialist)
  )
    return false;
  if (element.type === "HealthCheck") {
    if (!isNumber(element.healthCheckRating)) return false;
    return true;
  } else if (element.type === "Hospital") {
    if (
      !isString(element.discharge.date) ||
      !isString(element.discharge.criteria)
    )
      return false;
    return true;
  } else if (element.type === "OccupationalHealthcare") {
    if (!isString(element.employerName)) return false;
    return true;
  }
  return false;
}

function parseString(element: unknown): string {
  if (!isString(element)) throw "bad propery";
  return element;
}

function parseGender(element: unknown): Gender {
  if (!isGender(element)) throw "bad propery";
  return element;
}

function parseEntryArray(element: unknown): Entry[] {
  if (!Array.isArray(element)) throw "entries is not an array";
  return element.map((entry) => {
    if (!isEntry(entry)) throw new Error(`this is not a valid entry`);
    return entry;
  });
}

export function isStringArray(element: unknown): element is string[] {
  if (!Array.isArray(element)) throw "entries is not an array";
  for (const value of element) {
    if (!isString(value)) return false;
  }
  return true;
}

export function parseStringArray(element: unknown): string[] {
  if (!isStringArray(element))
    throw new Error(`this is not an array of strings`);
  return element;
}

export function createSinglePatient(body: any): SinglePatient {
  console.log(body);
  return {
    id: parseString(body.id),
    name: parseString(body.name),
    occupation: parseString(body.occupation),
    gender: parseGender(body.gender),
    ssn: parseString(body.ssn),
    dateOfBirth: parseString(body.dateOfBirth),
    entries: parseEntryArray(body.entries),
  };
}
