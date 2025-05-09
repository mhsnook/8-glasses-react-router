/*
  # Seed data for example users and goals

  1. Users
    - Add profiles for Joni and Xris
  2. Goals
    - Add 3 goals for Joni (water, workout, cigarettes)
    - Add 2 goals for Xris (screen time, meals)
  3. Entries
    - Add sample entries for all goals
*/

-- Insert profiles for existing users
insert into profiles (id, username, is_public)
values 
  ('6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 'joni', true),
  ('8a4432ba-db90-4481-a884-11c78706ad8d', 'xris', true);

-- Insert sample goals for joni
insert into goals (id, user_id, name, verb, amount, orientation, period, unit_type, is_public)
values
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 'glasses of water', 'drink', 8, 'or more', 'daily', 'count', true),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 'workout', 'do', 18000, 'or more', 'weekly', 'duration', true),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 'cigarettes', 'smoke', 5, 'or less', 'weekly', 'count', true);

-- Insert sample goals for xris
insert into goals (id, user_id, name, verb, amount, orientation, period, unit_type, is_public)
values
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 'screen time limits', 'break', 3, 'or less', 'weekly', 'count', true),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 'real meals', 'eat', 2, 'or more', 'daily', 'count', true);

-- Insert sample entries for joni's water goal (last 14 days)
insert into entries (goal_id, user_id, amount, created_at)
values
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '13 days' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '13 days' + interval '11 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '13 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '13 days' + interval '15 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '13 days' + interval '17 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '12 days' + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '12 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '12 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '12 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '15 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '20 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '8 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '15 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '20 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '9 days' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '9 days' + interval '11 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '9 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '8 days' + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '8 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '7 days' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '7 days' + interval '11 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '7 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '7 days' + interval '17 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '7 days' + interval '20 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '8 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '15 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '17 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '20 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '5 days' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '5 days' + interval '11 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '5 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '5 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '5 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '4 days' + interval '8 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '4 days' + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '4 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '4 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '4 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '3 days' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '3 days' + interval '11 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '3 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '3 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '3 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '2 days' + interval '8 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '2 days' + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '2 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '2 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '2 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '1 day' + interval '9 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '1 day' + interval '11 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '1 day' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '1 day' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '1 day' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() + interval '8 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() + interval '10 hours'),
  ('00000000-0000-0000-0000-000000000011', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() + interval '12 hours');

-- Insert sample entries for joni's workout goal
insert into entries (goal_id, user_id, amount, created_at)
values
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 3600, now() - interval '13 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1800, now() - interval '11 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 2700, now() - interval '9 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1800, now() - interval '8 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 3600, now() - interval '6 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1800, now() - interval '4 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 3600, now() - interval '2 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000012', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1800, now() + interval '19 hours');

-- Insert sample entries for joni's cigarettes goal
insert into entries (goal_id, user_id, amount, created_at)
values
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '13 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '12 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '17 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '11 days' + interval '21 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '10 days' + interval '15 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '9 days' + interval '16 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '7 days' + interval '14 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '6 days' + interval '17 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '4 days' + interval '15 hours'),
  ('00000000-0000-0000-0000-000000000013', '6d4d62d8-62ca-4d5f-8534-96cedb785eb5', 1, now() - interval '1 day' + interval '18 hours');

-- Insert sample entries for xris's screen time goal
insert into entries (goal_id, user_id, amount, created_at)
values
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '13 days' + interval '22 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '11 days' + interval '23 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '10 days' + interval '21 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '8 days' + interval '22 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '7 days' + interval '23 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '6 days' + interval '21 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '4 days' + interval '22 hours'),
  ('00000000-0000-0000-0000-000000000021', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '1 day' + interval '23 hours');

-- Insert sample entries for xris's meals goal (last 14 days)
insert into entries (goal_id, user_id, amount, created_at)
values
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '13 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '13 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '12 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '12 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '11 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '11 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '10 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '9 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '9 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '8 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '8 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '7 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '7 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '6 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '5 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '5 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '4 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '4 days' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '3 days' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '3 days' + interval '19 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '2 days' + interval '13 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '1 day' + interval '12 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() - interval '1 day' + interval '18 hours'),
  ('00000000-0000-0000-0000-000000000022', '8a4432ba-db90-4481-a884-11c78706ad8d', 1, now() + interval '12 hours');