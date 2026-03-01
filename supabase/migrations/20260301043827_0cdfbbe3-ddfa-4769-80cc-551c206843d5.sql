
-- Add missing columns to profiles for enhanced signup
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS emergency_contact jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS height numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS weight numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS license_number text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS parent_phone text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS parent_email text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'adult',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add health_officer to app_role enum if not exists
DO $$ 
BEGIN
  -- We'll use the existing 'admin' role for health officers since it already exists
  -- No enum change needed
END $$;

-- Create trigger to auto-create profile on signup (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, emec_id, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    generate_emec_id(),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'adult')
  );
  
  -- Auto-assign role based on account_type
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.raw_user_meta_data->>'account_type' = 'admin' THEN 'admin'::app_role
      WHEN NEW.raw_user_meta_data->>'account_type' = 'child' THEN 'child'::app_role
      WHEN NEW.raw_user_meta_data->>'account_type' = 'parent' THEN 'parent'::app_role
      ELSE 'adult'::app_role
    END
  );
  
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
