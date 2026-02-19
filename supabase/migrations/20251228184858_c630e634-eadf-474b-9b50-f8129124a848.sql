-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'parent', 'child', 'adult');

-- Create age category enum
CREATE TYPE public.age_category AS ENUM ('infant', 'child', 'teen', 'adult');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    emec_id VARCHAR(11) NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    age_category public.age_category DEFAULT 'adult',
    parent_user_id UUID REFERENCES auth.users(id),
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    language TEXT DEFAULT 'en',
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    -- Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
ON public.profiles
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- Deny all access by default
CREATE POLICY deny_all ON public.profiles
FOR ALL
USING (false)
WITH CHECK (false);

-- Allow users to access only their own profile
CREATE POLICY user_owns_profile ON public.profiles
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Optional: allow admins full access
CREATE POLICY admin_full_access ON public.profiles
FOR ALL
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    facility_name TEXT,
    facility_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create consent_codes table
CREATE TABLE public.consent_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(6) NOT NULL,
    requesting_officer_id UUID REFERENCES public.profiles(id),
    facility_name TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    record_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    facility_name TEXT,
    officer_name TEXT,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medications table
CREATE TABLE public.medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    drug_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    schedule JSONB DEFAULT '[]'::jsonb,
    start_date DATE NOT NULL,
    end_date DATE,
    prescribed_by TEXT,
    facility_name TEXT,
    side_effects TEXT[],
    warnings TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create allergies table
CREATE TABLE public.allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    allergy_type TEXT NOT NULL,
    allergen TEXT NOT NULL,
    severity TEXT NOT NULL,
    reactions TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create immunizations table
CREATE TABLE public.immunizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vaccine_name TEXT NOT NULL,
    date_administered DATE NOT NULL,
    batch_number TEXT,
    administered_by TEXT,
    facility_name TEXT,
    next_dose_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    action_description TEXT NOT NULL,
    performed_by UUID REFERENCES public.profiles(id),
    officer_name TEXT,
    facility_name TEXT,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication_reminders table
CREATE TABLE public.medication_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    scheduled_time TIME NOT NULL,
    taken_at TIMESTAMP WITH TIME ZONE,
    missed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KES',
    payment_method TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    donor_name TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pharmacy_orders table
CREATE TABLE public.pharmacy_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    emec_id VARCHAR(11) NOT NULL,
    pharmacy_name TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    status TEXT DEFAULT 'pending',
    prescription_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to get user's profile id
CREATE OR REPLACE FUNCTION public.get_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Generate EMEC ID function
CREATE OR REPLACE FUNCTION public.generate_emec_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..11 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Parents can view their children's profiles"
    ON public.profiles FOR SELECT
    USING (parent_user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own role"
    ON public.user_roles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for consent_codes
CREATE POLICY "Patients can view their consent codes"
    ON public.consent_codes FOR SELECT
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins can view and create consent codes"
    ON public.consent_codes FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients can approve consent codes"
    ON public.consent_codes FOR UPDATE
    USING (patient_id = public.get_profile_id(auth.uid()));

-- RLS Policies for medical_records
CREATE POLICY "Patients can view their own records"
    ON public.medical_records FOR SELECT
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Parents can view children's records"
    ON public.medical_records FOR SELECT
    USING (patient_id IN (
        SELECT id FROM public.profiles WHERE parent_user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all records"
    ON public.medical_records FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for medications
CREATE POLICY "Patients can view their medications"
    ON public.medications FOR SELECT
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Parents can view children's medications"
    ON public.medications FOR SELECT
    USING (patient_id IN (
        SELECT id FROM public.profiles WHERE parent_user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all medications"
    ON public.medications FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for allergies
CREATE POLICY "Patients can view their allergies"
    ON public.allergies FOR SELECT
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins can manage all allergies"
    ON public.allergies FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for immunizations
CREATE POLICY "Patients can view their immunizations"
    ON public.immunizations FOR SELECT
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins can manage all immunizations"
    ON public.immunizations FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for audit_logs
CREATE POLICY "Patients can view their audit logs"
    ON public.audit_logs FOR SELECT
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins can view and create audit logs"
    ON public.audit_logs FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for medication_reminders
CREATE POLICY "Patients can manage their reminders"
    ON public.medication_reminders FOR ALL
    USING (patient_id = public.get_profile_id(auth.uid()));

-- RLS Policies for donations
CREATE POLICY "Anyone can view public donations"
    ON public.donations FOR SELECT
    USING (is_public = true);

CREATE POLICY "Donors can view their own donations"
    ON public.donations FOR SELECT
    USING (donor_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Anyone can create donations"
    ON public.donations FOR INSERT
    WITH CHECK (true);

-- RLS Policies for pharmacy_orders
CREATE POLICY "Patients can manage their orders"
    ON public.pharmacy_orders FOR ALL
    USING (patient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins can view all orders"
    ON public.pharmacy_orders FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
    BEFORE UPDATE ON public.medications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pharmacy_orders_updated_at
    BEFORE UPDATE ON public.pharmacy_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();