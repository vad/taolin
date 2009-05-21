-- # Insert Configs
INSERT INTO configs VALUES (1, 1, 'name', 'taolin');
INSERT INTO configs VALUES (3, 1, 'url', 'http://taolin.fbk.eu');
INSERT INTO configs VALUES (4, 1, 'admin', 'admin@example.com');
INSERT INTO configs VALUES (5, 1, 'jsdebug', '1');
INSERT INTO configs VALUES (15, 1, 'logo_url', 'img/logo.png');
INSERT INTO configs VALUES (16, 1, 'favicon', 'img/favicon.png');
INSERT INTO configs VALUES (7, 2, 'group_name', 'Group');
INSERT INTO configs VALUES (17, 2, 'publications', '1');
INSERT INTO configs VALUES (6, 2, 'domain', 'example.com');
INSERT INTO configs VALUES (8, 3, 'people_fs_path', 'YOUR_PATH/user_images/');
INSERT INTO configs VALUES (9, 3, 'error_fs_path', 'ANOTHER_PATH/images_upload_error/');
INSERT INTO configs VALUES (10, 3, 'people_web_path', 'user_images/');
INSERT INTO configs VALUES (11, 3, 'webcam_fs_path', 'ONE_PATH/webcam/');
INSERT INTO configs VALUES (13, 4, 'server', 'jabber.example.com');
INSERT INTO configs VALUES (14, 4, 'domain', 'example.com');
INSERT INTO configs VALUES (12, 5, 'method', 'Dummy');

-- # Insert Config categories
INSERT INTO config_categories VALUES (1, 'site');
INSERT INTO config_categories VALUES (2, 'organization');
INSERT INTO config_categories VALUES (3, 'images');
INSERT INTO config_categories VALUES (4, 'jabber');
INSERT INTO config_categories VALUES (5, 'auth');
