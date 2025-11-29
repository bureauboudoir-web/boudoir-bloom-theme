-- Enable RLS on unprotected tables
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.starter_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Policies for content_items (linked via starter_packs.creator_id)
CREATE POLICY "Users can manage own content items"
ON public.content_items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.starter_packs
    WHERE starter_packs.id = content_items.starter_pack_id
    AND starter_packs.creator_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all content items"
ON public.content_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Policies for content_library (has creator_id)
CREATE POLICY "Users can manage own content library"
ON public.content_library
FOR ALL
USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all content library"
ON public.content_library
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Policies for starter_packs (has creator_id)
CREATE POLICY "Users can manage own starter packs"
ON public.starter_packs
FOR ALL
USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all starter packs"
ON public.starter_packs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Policies for uploads (has creator_id)
CREATE POLICY "Users can manage own uploads"
ON public.uploads
FOR ALL
USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all uploads"
ON public.uploads
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));