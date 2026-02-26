CREATE TABLE IF NOT EXISTS billing_webhook_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'received',
  failure_reason TEXT,
  payload_hash TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_billing_webhook_receipts_workspace_created
  ON billing_webhook_receipts(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_billing_webhook_receipts_status_created
  ON billing_webhook_receipts(status, created_at DESC);

CREATE OR REPLACE FUNCTION set_billing_webhook_receipts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_billing_webhook_receipts_updated_at ON billing_webhook_receipts;
CREATE TRIGGER trg_set_billing_webhook_receipts_updated_at
BEFORE UPDATE ON billing_webhook_receipts
FOR EACH ROW
EXECUTE FUNCTION set_billing_webhook_receipts_updated_at();

ALTER TABLE billing_webhook_receipts ENABLE ROW LEVEL SECURITY;
