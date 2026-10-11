import { neon } from "@neondatabase/serverless";

const packages = {
  eclipse: 6499,
  prestige: 17499,
} as const;

export type PackageKey = keyof typeof packages;

export function isPackageKey(value: unknown): value is PackageKey {
  return typeof value === "string" && value in packages;
}

export function getPackageAmount(packageKey: PackageKey) {
  return packages[packageKey];
}

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}
