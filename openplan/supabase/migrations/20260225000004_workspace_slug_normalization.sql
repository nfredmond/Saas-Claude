-- Improve workspace slug generation to preserve letters from mixed-case org names.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_name TEXT;
  slug_base TEXT;
  workspace_slug TEXT;
  new_workspace_id UUID;
BEGIN
  org_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'org_name'), ''),
    split_part(NEW.email, '@', 1)
  );

  slug_base := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g');
  slug_base := regexp_replace(slug_base, '(^-|-$)', '', 'g');

  workspace_slug := COALESCE(NULLIF(slug_base, ''), 'workspace')
    || '-' || substring(NEW.id::text, 1, 8);

  INSERT INTO public.workspaces (name, slug)
  VALUES (org_name, workspace_slug)
  RETURNING id INTO new_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;
