-- Run this in the Supabase SQL Editor AFTER you've run schema.sql
-- (this just fills in your current price list so you don't have to type it
-- all in by hand through the Pricing tab)

insert into price_list (service, price, description, sort_order) values
  ('Soft Glam', 150, null, 0),
  ('Heavy Beat / Full Glam', 200, null, 1),
  ('Bridal Trial', 120, null, 2),
  ('Bridal Day-Of', 400, null, 3),
  ('Makeup Lesson (1 hr)', 250, null, 4),
  ('Hollywood Curls', 75, null, 5),
  ('Slick Back Bun', 100, null, 6),
  ('Bombshell Blowout', 85, null, 7),
  ('Half Up / Half Down', 120, null, 8),
  ('Messy Bun', 150, null, 9),
  ('Lashes (add-on)', 25, null, 10),
  ('Body Glow (add-on)', 20, 'Collarbones + shoulders', 11),
  ('Early Morning Fee (add-on)', 20, 'Before 7 AM', 12),
  ('On-Site Travel (add-on)', null, 'Priced based on location — contact for a quote', 13);
