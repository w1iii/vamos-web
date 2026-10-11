CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  package_key TEXT NOT NULL CHECK (package_key IN ('eclipse', 'prestige')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  full_name TEXT NOT NULL,
  messenger TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Reviewed/New'
);

CREATE INDEX IF NOT EXISTS reservations_created_at_idx
  ON reservations (created_at DESC);
