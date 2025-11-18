-- Bootstrap first admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('a7060a51-4e9d-4138-95c0-09f1650bd931', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;