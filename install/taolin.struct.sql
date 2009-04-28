-- MySQL dump 10.11
--
-- Host: localhost    Database: desktop
-- ------------------------------------------------------
-- Server version	5.0.45
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO,POSTGRESQL' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table "acos"
--

DROP TABLE IF EXISTS "acos";
CREATE TABLE "acos" (
  "id" SERIAL,
  "parent_id" INTEGER default NULL,
  "model" varchar(255) default NULL,
  "foreign_key" INTEGER default NULL,
  "alias" varchar(255) default NULL,
  "lft" INTEGER default NULL,
  "rght" INTEGER default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "aros"
--

DROP TABLE IF EXISTS "aros" CASCADE;
CREATE TABLE "aros" (
  "id" SERIAL,
  "parent_id" INTEGER default NULL,
  "model" varchar(255) default NULL,
  "foreign_key" INTEGER default NULL,
  "alias" varchar(255) default NULL,
  "lft" INTEGER default NULL,
  "rght" INTEGER default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "aros_acos"
--

DROP TABLE IF EXISTS "aros_acos" CASCADE;
CREATE TABLE "aros_acos" (
  "id" SERIAL,
  "aro_id" INTEGER NOT NULL,
  "aco_id" INTEGER NOT NULL,
  "_create" varchar(2) NOT NULL default '0',
  "_read" varchar(2) NOT NULL default '0',
  "_update" varchar(2) NOT NULL default '0',
  "_delete" varchar(2) NOT NULL default '0',
  PRIMARY KEY  ("id"),
   UNIQUE ("aro_id","aco_id")
);

--
-- Table structure for table "boards"
--

DROP TABLE IF EXISTS "boards" CASCADE;
CREATE TABLE "boards" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "text" text,
  "email" varchar(50) default NULL,
  "expire_date" date default NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) default NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "buildings"
--

DROP TABLE IF EXISTS "buildings" CASCADE;
CREATE TABLE "buildings" (
  "id" SERIAL,
  "name" text NOT NULL,
  "description" text,
  "imagepath" varchar(200) NOT NULL,
  "top" INTEGER NOT NULL,
  "left" INTEGER NOT NULL,
  "bottom" INTEGER NOT NULL,
  "right" INTEGER NOT NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "cake_sessions"
--

DROP TABLE IF EXISTS "cake_sessions" CASCADE;
CREATE TABLE "cake_sessions" (
  "id" varchar(255) NOT NULL default '',
  "data" text,
  "expires" INTEGER default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "calendars"
--

DROP TABLE IF EXISTS "calendars" CASCADE;
CREATE TABLE "calendars" (
  "id" SERIAL PRIMARY KEY,
  "url" varchar(200) NOT NULL UNIQUE,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) NOT NULL,
  "checked" timestamp(0) NULL default NULL,
  "listed" SMALLINT NOT NULL default '0',
  "name" varchar(100) default NULL
);

--
-- Table structure for table "checked_users"
--

DROP TABLE IF EXISTS "checked_users" CASCADE;
CREATE TABLE "checked_users" (
  "user_id" INTEGER NOT NULL,
   UNIQUE ("user_id")
);

--
-- Table structure for table "events"
--

DROP TABLE IF EXISTS "events" CASCADE;
CREATE TABLE "events" (
  "id" SERIAL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) NOT NULL,
  "uid" varchar(100) NOT NULL UNIQUE,
  "summary" text NOT NULL,
  "description" text,
  "location" text,
  "start_time" TIMESTAMP(0) NOT NULL,
  "end_time" TIMESTAMP(0) NOT NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  "calendar_id" INTEGER NOT NULL,
  PRIMARY KEY  ("id")
   --KEY "start_time" ("start_time","end_time")
);


--
-- Table structure for table "feedbacks"
--

DROP TABLE IF EXISTS "feedbacks" CASCADE;
CREATE TABLE "feedbacks" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "text" text NOT NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "groups"
--

DROP TABLE IF EXISTS "groups" CASCADE;
CREATE TABLE "groups" (
  "id" SERIAL,
  "name" varchar(50) NOT NULL,
  "description_en" text,
  "description_it" text,
  "url" varchar(100) default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "groups_users"
--

DROP TABLE IF EXISTS "groups_users" CASCADE;
CREATE TABLE "groups_users" (
  "group_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "created" TIMESTAMP(0) default now(),
  "modified" TIMESTAMP(0) default NULL,
   --KEY "group_id" ("group_id"),
   --KEY "user_id" ("user_id")
   PRIMARY KEY(group_id, user_id)
);


--
-- Table structure for table "groups_users_history"
--

DROP TABLE IF EXISTS "groups_users_history" CASCADE;
CREATE TABLE "groups_users_history" (
  "id" SERIAL,
  "group_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "created_on" TIMESTAMP(0) default NULL,
  "created" TIMESTAMP(0) default now(),
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "identities"
--

DROP TABLE IF EXISTS "identities" CASCADE;
CREATE TABLE "identities" (
  "user_id" INTEGER NOT NULL,
  "institute_id" INTEGER NOT NULL,
  "unique_identifier_string" INTEGER NOT NULL,
  PRIMARY KEY  ("institute_id","unique_identifier_string"),
   UNIQUE ("user_id")
);

--
-- Table structure for table "institutes"
--

DROP TABLE IF EXISTS "institutes" CASCADE;
CREATE TABLE "institutes" (
  "id" SERIAL,
  "name" varchar(50) NOT NULL,
  "description" text,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "logs"
--

DROP TABLE IF EXISTS "logs" CASCADE;
CREATE TABLE "logs" (
  "id" SERIAL,
  "text" text NOT NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "photos"
--

DROP TABLE IF EXISTS "photos" CASCADE;
CREATE TABLE "photos" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "photo" bytea,
  "filename" text,
  "name" varchar(100) default NULL,
  "caption" text,
  "width" INTEGER default NULL,
  "height" INTEGER default NULL,
  "created" TIMESTAMP(0) default now(),
  "modified" TIMESTAMP(0) default NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  "default_photo" SMALLINT NOT NULL,
  "is_hidden" SMALLINT NOT NULL,
  "is_fbk_photo" SMALLINT NOT NULL,
  PRIMARY KEY  ("id")
);


--
-- Table structure for table "templates"
--

DROP TABLE IF EXISTS "templates" CASCADE;
CREATE TABLE "templates" (
  "id" SERIAL,
  "temp" varchar(1000) NOT NULL,
  "name" varchar(50) NOT NULL,
  "icon" varchar(100) default NULL,
  "is_unique" SMALLINT NOT NULL default '0',
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "timelines"
--

DROP TABLE IF EXISTS "timelines" CASCADE;
CREATE TABLE "timelines" (
  "id" SERIAL,
  "user_id" INTEGER default NULL,
  "login" varchar(50) default NULL,
  "template_id" INTEGER NOT NULL,
  "param" text,
  "date" TIMESTAMP(0) NOT NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) default NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "users"
--

DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
  "id" SERIAL,
  "login" varchar(50) default NULL,
  "name" varchar(50) default NULL,
  "surname" varchar(50) default NULL,
  "date_of_birth" date default NULL,
  "gender" INTEGER NOT NULL,
  "email" varchar(50) default NULL,
  "fbk_unit" varchar(100) default NULL,
  "groups_description" TEXT,
  "personal_page" varchar(80) default NULL,
  "phone" varchar(15) default NULL,
  "phone2" varchar(15) default NULL,
  "working_place" TEXT,
  "publik_id" INTEGER default NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) default NULL,
  "role" varchar(50) default NULL,
  "mod_date_of_birth" date default NULL,
  "mod_email" varchar(50) default NULL,
  "mod_description" text,
  "mod_personal_page" varchar(80) default NULL,
  "mod_phone" varchar(15) default NULL,
  "mod_phone2" varchar(15) default NULL,
  "mod_working_place" text,
  "mod_role" varchar(50) default NULL,
  "mod_home_address" character varying(200) DEFAULT NULL::character varying, -- Home address
  "mod_carpooling" boolean NOT NULL default false, -- Available for carpooling?
  "privacy_policy_acceptance" boolean NOT NULL default false, -- 0 = privacy policy not yet accepted, show first login wizard. 1 = already accepted, everything ok!
  "facebook" text,
  "linkedin" text,
  "twitter" text,
  "active" SMALLINT NOT NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  "content" text,
  "tsv" tsvector,
  PRIMARY KEY  ("id"),
  UNIQUE ("login")
);


CREATE OR REPLACE FUNCTION users_tsv_trigger() RETURNS trigger AS $$
begin
    new.tsv :=
        setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(new.surname, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(new.login, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(new.mod_description, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(new.mod_phone, new.phone, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(new.mod_phone2, new.phone2, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(new.mod_email, new.email, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(new.mod_home_address, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(new.groups_description, '')), 'C');
    return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER usertsvupdate BEFORE INSERT OR UPDATE
ON users FOR EACH ROW EXECUTE PROCEDURE users_tsv_trigger();

--
-- Temporary table structure for view "readable_timelines"
--

CREATE OR REPLACE VIEW readable_timelines AS
SELECT "timelines"."id" AS "id" , "timelines"."user_id" AS "user_id" , "users"."name" AS "name" , "users"."surname" AS "surname" , "timelines"."login" AS "login" , "users"."gender" AS "gender" , "timelines"."template_id" AS "template_id" , "timelines"."param" AS "param" , "timelines"."date" AS "date" , "templates"."temp" AS "temp" , "templates"."icon" AS "icon"
FROM (((SELECT * FROM timelines WHERE deleted = 0) AS timelines
LEFT OUTER JOIN (SELECT * FROM users WHERE deleted = 0) AS users ON "timelines"."user_id" = "users"."id")
JOIN "templates" ON "timelines"."template_id" = "templates"."id")
WHERE
(
 (
  "timelines"."id" IN (
   SELECT max("timelines"."id") AS "MAX(id)"
     FROM "timelines" JOIN templates ON template_id = templates.id
     WHERE "timelines"."deleted" = 0 AND "templates"."is_unique" = 1
     GROUP BY "timelines"."template_id" , "timelines"."user_id"
  )
  AND "users"."deleted" = 0
 )
 OR "timelines"."user_id" IS NULL
 OR (
  "timelines"."id"
  IN (
   SELECT "timelines"."id"
   FROM "timelines" JOIN templates ON template_id = templates.id
   WHERE (
   "timelines"."deleted" = 0
   AND "templates"."is_unique" = 0
   )
  )
 )
)
ORDER BY "timelines"."date" DESC;

-- ALTER TABLE readable_timelines OWNER TO sonetdbmgr;

--
-- Table structure for table "users_history"
--

DROP TABLE IF EXISTS "users_history" CASCADE;
CREATE TABLE "users_history" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "login" varchar(50) default NULL,
  "name" varchar(50) default NULL,
  "surname" varchar(50) default NULL,
  "date_of_birth" date default NULL,
  "gender" INTEGER NOT NULL,
  "email" varchar(50) default NULL,
  "fbk_unit" varchar(100) default NULL,
  "groups_description" varchar(50) default NULL,
  "personal_page" varchar(80) default NULL,
  "phone" varchar(15) default NULL,
  "phone2" varchar(15) default NULL,
  "working_place" text,
  "publik_id" INTEGER default NULL,
  "registration_date" TIMESTAMP(0) default NULL,
  "role" varchar(50) default NULL,
  "mod_date_of_birth" date default NULL,
  "mod_email" varchar(50) default NULL,
  "mod_description" text,
  "mod_personal_page" varchar(80) default NULL,
  "mod_phone" varchar(3) default NULL,
  "mod_phone2" varchar(3) default NULL,
  "mod_working_place" text,
  "mod_role" varchar(50) default NULL,
  "mod_home_address" character varying(200) DEFAULT NULL::character varying, -- Home address
  "mod_carpooling" boolean NOT NULL default false, -- Available for carpooling?
  "privacy_policy_acceptance" boolean NOT NULL default false, -- 0 = privacy policy not yet accepted, show first login wizard. 1 = already accepted, everything ok!
  "facebook" text,
  "linkedin" text,
  "twitter" text,
  "active" SMALLINT default NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "users_widgets"
--

DROP TABLE IF EXISTS "users_widgets" CASCADE;
CREATE TABLE "users_widgets" (
  id SERIAL,
  widget_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  col INTEGER NOT NULL,
  pos INTEGER NOT NULL,
  tab INTEGER default NULL,
  application_conf text,
  widget_conf text NOT NULL,
  deleted smallint NOT NULL DEFAULT (0)::smallint,
  deleted_date timestamp(0) without time zone,
  PRIMARY KEY  (id)
);

--
-- Table structure for table "users_widgets_history"
--

DROP TABLE IF EXISTS "users_widgets_history" CASCADE;
CREATE TABLE "users_widgets_history" (
  "id" SERIAL,
  "user_widget_id" INTEGER NOT NULL,
  "widget_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "col" INTEGER NOT NULL,
  "pos" INTEGER NOT NULL,
  "tab" INTEGER default NULL,
  "widget_conf" text,
  "application_conf" text,
  "modified" timestamp(0) NOT NULL default CURRENT_TIMESTAMP(0),
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "widgets"
--

DROP TABLE IF EXISTS "widgets" CASCADE;
CREATE TABLE "widgets" (
  "id" SERIAL,
  "string_identifier" text NOT NULL,
  "name" varchar(50) NOT NULL,
  "description" text NOT NULL,
  "user_params" varchar(10000) NOT NULL default '[]',
  "application_conf" text,
  "widget_conf" text,
  "screenshot" varchar(100) default NULL,
  "enabled" SMALLINT NOT NULL default '1',
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" timestamp(0) NULL default CURRENT_TIMESTAMP(0),
  PRIMARY KEY  ("id")
);

--
-- Table structure for table "widgets_skel"
--

DROP TABLE IF EXISTS "widgets_skel" CASCADE;
CREATE TABLE "widgets_skel" (
  "id" SERIAL,
  "widget_id" INTEGER NOT NULL,
  "col" INTEGER NOT NULL,
  "pos" INTEGER NOT NULL,
  "tab" INTEGER NOT NULL default '0',
  PRIMARY KEY  ("id")
);

--
-- Temporary table structure for view "widgets_skel_readable"
--

--DROP TABLE IF EXISTS "widgets_skel_readable";
/*!50001 DROP VIEW "widgets_skel_readable"*/;
/*!50001 CREATE TABLE "widgets_skel_readable" (
  "name" varchar(50),
  "id" SERIAL,
  "pos" INTEGER unsigned,
  "col" INTEGER unsigned,
  "tab" INTEGER unsigned
) */;

CREATE OR REPLACE VIEW widgets_skel_readable AS 
 SELECT widgets.name, widgets_skel.id, widgets_skel.pos, widgets_skel.col, widgets_skel.tab
   FROM widgets_skel
   JOIN widgets ON widgets_skel.widget_id = widgets.id
  ORDER BY widgets_skel.col;

-- ALTER TABLE widgets_skel_readable OWNER TO sonetdbmgr;





--
-- Table structure for table "workplaces"
--

DROP TABLE IF EXISTS "workplaces" CASCADE;
CREATE TABLE "workplaces" (
  "id" SERIAL,
  "user_id" INTEGER NOT NULL,
  "building_id" INTEGER NOT NULL,
  "created" TIMESTAMP(0) NOT NULL default now(),
  "modified" TIMESTAMP(0) NOT NULL,
  "x" float NOT NULL,
  "y" float NOT NULL,
  PRIMARY KEY  ("id")
);

DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE tags (
  tag varchar(100) NOT NULL PRIMARY KEY,
  created timestamp(0) without time zone NOT NULL DEFAULT now(),
  modified timestamp(0) without time zone
);

DROP TABLE IF EXISTS content_tags CASCADE;
CREATE TABLE content_tags (
  id SERIAL NOT NULL PRIMARY KEY,
  tag_id varchar(100) NOT NULL,
  content_type_id INTEGER NOT NULL,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL, -- creator
  created timestamp(0) without time zone NOT NULL DEFAULT now(),
  modified timestamp(0) without time zone NOT NULL DEFAULT now(),
  deleted SMALLINT NOT NULL default '0',
  deleted_date timestamp(0) NULL default NULL
);

DROP TABLE IF EXISTS content_types CASCADE;
CREATE TABLE content_types (
  id SERIAL NOT NULL PRIMARY KEY,
  model_name varchar(50) NOT NULL,
  table_name varchar(50) NOT NULL,
  created timestamp(0) without time zone NOT NULL DEFAULT now(),
  modified timestamp(0) without time zone,
  UNIQUE (model_name),
  UNIQUE (table_name)
);

--
-- Final view structure for view "users_widgets_readable"
--

CREATE OR REPLACE VIEW users_widgets_readable AS 
 SELECT users.login, users_widgets.user_id, widgets.string_identifier, users_widgets.widget_id, users_widgets.pos, users_widgets.col, users_widgets.tab, users_widgets.application_conf, users_widgets.widget_conf
   FROM users_widgets
   JOIN users ON users.id = users_widgets.user_id
   JOIN widgets ON widgets.id = users_widgets.widget_id
  WHERE users_widgets.deleted = 0
  ORDER BY users.login;

-- ALTER TABLE users_widgets_readable OWNER TO sonetdbmgr;

--
-- Final view structure for view "widgets_skel_readable"
--


-- SONET DEFINED FUNCTIONS
drop function ifnull (text, text);
create function ifnull (text, text) returns text AS '
select coalesce($1, $2) as result
' language 'sql';


drop function ifnull (int4, int4);
create function ifnull (int4, int4) returns int4 as '
select coalesce($1, $2) as result
' language 'sql';


CREATE OR REPLACE FUNCTION set_groups_description(integer)
  RETURNS void AS
$BODY$
    UPDATE users SET groups_description = 
        (SELECT array_to_string(ARRAY(SELECT name FROM groups WHERE groups.id IN 
            (SELECT groups_users.group_id FROM groups_users WHERE groups_users.user_id = users.id)), ','))
    WHERE id = $1;
$BODY$
  LANGUAGE 'sql' VOLATILE
  COST 100;
-- ALTER FUNCTION set_groups_description(integer) OWNER TO sonetdbmgr;
