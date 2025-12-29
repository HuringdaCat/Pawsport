-- Seed Data for Community Posts
-- Run this in Supabase SQL Editor to add sample posts

-- Note: Replace 'YOUR_USER_ID' with an actual user ID from auth.users
-- To get your user ID, run: SELECT id, email FROM auth.users;

-- ============================================
-- INSERT SAMPLE POSTS
-- ============================================

-- First, let's get a user ID to use for sample posts
-- You can replace this with your actual user ID

INSERT INTO community_posts (user_id, author_name, content, route, pet_types, likes, comment_count)
VALUES 
  -- Post 1
  (
    (SELECT id FROM auth.users LIMIT 1), -- Uses first user in database
    (SELECT COALESCE(
      (SELECT raw_user_meta_data->>'display_name' FROM auth.users LIMIT 1),
      'Sample User'
    )),
    'Just completed my pet''s relocation from New York to London! The process was smooth thanks to all the helpful tips from this community. Happy to answer any questions! 🐕✈️',
    'New York, USA → London, UK',
    ARRAY['Dog'],
    5,
    2
  ),
  
  -- Post 2
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT COALESCE(
      (SELECT raw_user_meta_data->>'display_name' FROM auth.users LIMIT 1),
      'Sample User'
    )),
    'Looking for advice on flying with a cat from Tokyo to Sydney. Anyone done this route before? Worried about the long flight duration.',
    'Tokyo, Japan → Sydney, Australia',
    ARRAY['Cat'],
    3,
    1
  ),
  
  -- Post 3
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT COALESCE(
      (SELECT raw_user_meta_data->>'display_name' FROM auth.users LIMIT 1),
      'Sample User'
    )),
    'Pro tip: Start the paperwork at least 6 months in advance! Some countries have very strict quarantine requirements. My rabbit and I learned this the hard way 🐰',
    'Berlin, Germany → Toronto, Canada',
    ARRAY['Rabbit', 'Small Pet'],
    8,
    4
  ),
  
  -- Post 4
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT COALESCE(
      (SELECT raw_user_meta_data->>'display_name' FROM auth.users LIMIT 1),
      'Sample User'
    )),
    'Successfully relocated two dogs and a cat from California to Amsterdam! The key was finding a pet-friendly airline. Would recommend KLM for their excellent pet care program.',
    'Los Angeles, USA → Amsterdam, Netherlands',
    ARRAY['Dog', 'Cat'],
    12,
    6
  ),
  
  -- Post 5
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT COALESCE(
      (SELECT raw_user_meta_data->>'display_name' FROM auth.users LIMIT 1),
      'Sample User'
    )),
    'Question: Has anyone traveled with a bird internationally? I''m moving from Singapore to Paris next year and need advice on airline carriers and documentation.',
    'Singapore → Paris, France',
    ARRAY['Bird'],
    2,
    3
  );

-- ============================================
-- VERIFICATION
-- ============================================

-- Check the inserted posts
SELECT 
  id,
  author_name,
  LEFT(content, 50) as content_preview,
  route,
  pet_types,
  likes,
  comment_count,
  created_at
FROM community_posts
ORDER BY created_at DESC;

-- Check if you have users
SELECT id, email, raw_user_meta_data->>'display_name' as display_name
FROM auth.users;

-- If no users found, you need to:
-- 1. Sign up for an account in your app
-- 2. Then re-run this script

SELECT '✅ Sample posts created!' as status;
SELECT 'Go to the Community page to see them!' as next_step;
