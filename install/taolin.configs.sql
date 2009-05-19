-- # Insert Configs
INSERT INTO configs VALUES (1, 1, 'name', 'desktop.fbk.eu');
INSERT INTO configs VALUES (3, 1, 'url', 'https://desktop.fbk.eu');
INSERT INTO configs VALUES (4, 1, 'admin', 'sonet@fbk.eu');
INSERT INTO configs VALUES (5, 1, 'jsdebug', '1');
INSERT INTO configs VALUES (15, 1, 'logo_url', 'img/logo.png');
INSERT INTO configs VALUES (16, 1, 'favicon', 'img/favicon.png');
INSERT INTO configs VALUES (7, 2, 'group_name', 'FBK Unit');
INSERT INTO configs VALUES (17, 2, 'publications', '1');
INSERT INTO configs VALUES (6, 2, 'domain', 'fbk.eu');
INSERT INTO configs VALUES (8, 3, 'people_fs_path', '/www/bowie/html/people/images_bowie/');
INSERT INTO configs VALUES (9, 3, 'error_fs_path', '/www/bowie/html/people/images_upload_error/');
INSERT INTO configs VALUES (10, 3, 'people_web_path', 'fbk/img/people/');
INSERT INTO configs VALUES (11, 3, 'webcam_fs_path', '/www/bowie/html/images/webcam/');
INSERT INTO configs VALUES (13, 4, 'server', 'desktop.fbk.eu');
INSERT INTO configs VALUES (14, 4, 'domain', 'fbk.eu');
INSERT INTO configs VALUES (12, 5, 'method', 'Ldap');

-- # Insert Config categories
INSERT INTO config_categories VALUES (1, 'site');
INSERT INTO config_categories VALUES (2, 'organization');
INSERT INTO config_categories VALUES (3, 'images');
INSERT INTO config_categories VALUES (4, 'jabber');
INSERT INTO config_categories VALUES (5, 'auth');
