
-- Create medical_updates table for incremental health officer entries
CREATE TABLE public.medical_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES public.profiles(id),
  update_type TEXT NOT NULL, -- vitals, blood_sugar, medication, clinical_note, lab_result, allergy, condition
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  officer_name TEXT,
  facility_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_updates ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all medical_updates"
  ON public.medical_updates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Patients can view their own updates
CREATE POLICY "Patients can view their medical_updates"
  ON public.medical_updates FOR SELECT
  USING (patient_id = get_profile_id(auth.uid()));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_updates;
