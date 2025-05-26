-- Update all existing users to have the DRIVER role
UPDATE `users` SET `role` = 'DRIVER' WHERE `role` IS NULL OR `role` = '';
