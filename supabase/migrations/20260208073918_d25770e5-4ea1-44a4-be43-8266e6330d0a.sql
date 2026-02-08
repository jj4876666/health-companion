
-- Add explicit anonymous denial policies for profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles FOR ALL
USING (auth.uid() IS NOT NULL);

-- Add explicit anonymous denial policies for medical_records table
CREATE POLICY "Deny anonymous access to medical_records"
ON public.medical_records FOR ALL
USING (auth.uid() IS NOT NULL);
