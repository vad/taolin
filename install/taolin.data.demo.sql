-- # Importing demo user data into database: boards table

INSERT INTO "boards" ("id", "user_id", "text", "email", "expire_date", "created", "modified", "deleted", "deleted_date") VALUES (1,909,'Looking for a bike','platone@platone.com',NULL,'2009-04-08 14:53:47','2009-04-08 14:53:47',0,NULL);


-- # Importing demo user data into database: buildings table

INSERT INTO "buildings" ("id", "name", "description", "imagepath", "top", "left", "bottom", "right") VALUES (1,'Map of Ancient Greece',NULL,'webroot/img/building/GreeceNumberedPerepheries.png',0,0,500,500);
INSERT INTO "buildings" ("id", "name", "description", "imagepath", "top", "left", "bottom", "right") VALUES (2,'Map of Ancient Rome',NULL,'webroot/img/building/800px-RomanEmpire_117.svg.png',149,52,911,1192);


-- # Importing demo user data into database: groups table

INSERT INTO "groups" ("id", "name", "description_en", "description_it", "url") VALUES (71,'Grecia','Famous people of Ancient Greece','Personaggi famosi dell\'antica Grecia',NULL);
INSERT INTO "groups" ("id", "name", "description_en", "description_it", "url") VALUES (72,'Roma','Famous people of Ancient Rome','Personaggi famosi dell\'antica Roma',NULL);


-- # Importing demo user data into database: groups_users table

INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (71,909,NULL,NULL);
INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (72,907,NULL,NULL);
INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (71,905,NULL,NULL);
INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (72,906,NULL,NULL);
INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (71,903,NULL,NULL);
INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (72,908,NULL,NULL);
INSERT INTO "groups_users" ("group_id", "user_id", "created", "modified") VALUES (72,910,NULL,NULL);


-- # Importing demo user data into database: groups_users_history table

INSERT INTO "groups_users_history" ("id", "group_id", "user_id", "created_on", "created") VALUES (20,71,903,NULL,NULL);
INSERT INTO "groups_users_history" ("id", "group_id", "user_id", "created_on", "created") VALUES (21,71,903,NULL,NULL);
INSERT INTO "groups_users_history" ("id", "group_id", "user_id", "created_on", "created") VALUES (22,71,900,NULL,NULL);


-- # Importing demo user data into database: users table

INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (903,'aristotele','Aristotele','',NULL,'','Grecia',NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'philosophy, biology, physics, Greece',NULL,NULL,NULL,NULL,NULL,1,0,'2009-02-27 16:31:46',' philosophy, biology, physics, Greece',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (901,'demo','Admin','',NULL,'demo@demo.it',NULL,NULL,NULL,NULL,NULL,NULL,NOW(),'2008-12-10 16:17:56',NULL,NULL,'demo@demo.it','Social Network, Enterprise 2.0, Web 2.0',NULL,NULL,NULL,NULL,NULL,1,0,'2008-12-04 15:58:07','demo@demo.it Social Network, Enterprise 2.0, Web 2.0',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (905,'socrate','Socrate','',NULL,'socrate@socrate.com','Grecia',NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'philosophy, greece',NULL,NULL,NULL,NULL,NULL,1,0,'2008-12-04 15:58:07','socrate@socrate.com philosophy, greece',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (906,'cicerone','Marco Tullio','Cicerone',NULL,'cicerone@cicerone.com','Roma',NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'politics, philosophy, Rome',NULL,NULL,NULL,NULL,NULL,1,0,'2008-12-04 18:24:15','cicerone@cicerone.com politics, philosophy, Rome',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (907,'lucrezio','Tito','Lucrezio',NULL,'lucrezio@lucrezio.com','Roma',NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'philosophy',NULL,NULL,NULL,NULL,NULL,1,0,'2008-12-04 18:23:58','lucrezio@lucrezio.com philosophy',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (908,'seneca','Lucio Anneo','Seneca',NULL,'seneca@seneca.com','Roma',NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'philosophy, politics, Rome',NULL,NULL,NULL,NULL,NULL,1,0,'2008-12-04 15:58:07','seneca@seneca.com philosophy, politics, Rome',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (909,'platone','Platone','',NULL,'platone@platone.com','Grecia',NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'Greece, philosophy',NULL,NULL,NULL,NULL,NULL,1,0,'2009-01-16 00:15:02','platone@platone.com Greece, philosophy',1);
INSERT INTO "users" ("id", "login", "name", "surname", "date_of_birth", "email", "groups_description", "personal_page", "phone", "phone2", "working_place", "publik_id", "created", "modified", "role", "mod_date_of_birth", "mod_email", "mod_description", "mod_personal_page", "mod_phone", "mod_phone2", "mod_working_place", "mod_role", "active", "deleted", "deleted_date", "content", "gender") VALUES (910,'sallustio','Gaio','Sallustio Crispo','0086-10-01','sallustio@sallustio.com',NULL,NULL,NULL,NULL,NULL,NULL,NOW(),NOW(),NULL,NULL,NULL,'Rome, history, ',NULL,NULL,NULL,NULL,NULL,1,0,'2008-12-04 16:10:00','0086-10-01 sallustio@sallustio.com Rome, history, ',1);


-- # Importing demo user data into database: users_widgets table

INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1025,1,901,1,0,0,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1037,4,901,0,0,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1027,7,901,0,2,0,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1028,30,901,1,1,0,'{}','{\"text\":\"Widget note, really cool!\"}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1039,24,901,2,1,NULL,'{\"collapsed\":false}','{\"items\":\"2\",\"autoExpand\":false}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1031,3,901,1,2,0,'{}','{\"showPhoto\":false}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1041,32,901,2,0,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1034,27,901,0,1,0,'{}','{\"term\":\"Philosphy\"}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1061,43,909,1,3,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1062,45,909,0,2,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1067,53,909,0,3,NULL,'{}','{\"height\":\"100\"}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1064,30,909,1,2,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1056,7,909,1,0,0,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1058,29,909,0,0,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1068,44,909,2,0,NULL,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1054,51,909,1,1,0,'{}','{}');
INSERT INTO "users_widgets" ("id", "widget_id", "user_id", "col", "pos", "tab", "application_conf", "widget_conf") VALUES (1055,3,909,0,1,0,'{}','{}');


-- # Importing demo user data into database: workplaces table

INSERT INTO "workplaces" ("id", "user_id", "building_id", "created", "modified", "x", "y") VALUES (1,909,1,NOW(),NOW(),0.5,0.5);
