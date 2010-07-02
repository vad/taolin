-- # Table structure for table "groups_users_history"

DROP TABLE IF EXISTS "groups_users_history" CASCADE;
CREATE TABLE "groups_users_history" (
  "id" SERIAL,
  "group_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "created_on" TIMESTAMP(0) default NULL,
  "created" TIMESTAMP(0) default now(),
  PRIMARY KEY  ("id")
);

-- # Table structure for table "users_history"

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
  "corporate_unit" varchar(100) default NULL,
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
  "facebook" varchar(120) default NULL,
  "linkedin" varchar(50) default NULL,
  "twitter" varchar(50) default NULL,
  "active" SMALLINT default NULL,
  "deleted" SMALLINT NOT NULL default '0',
  "deleted_date" timestamp(0) NULL default NULL,
  "number_of_columns" INTEGER NOT NULL default 2,
  "background_id" INTEGER NOT NULL default 1,
  "theme" character varying(200) DEFAULT NULL::character varying,
  "notification" boolean NOT NULL default true, -- whether a user allows Taolin to notify her/him or not
  "institute_id" INTEGER NOT NULL default 1,
  PRIMARY KEY  ("id")
);

-- # Table structure for table "users_widgets_history"

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

-- # Create table acos_history

DROP TABLE IF EXISTS "acos_history" CASCADE;
CREATE TABLE "acos_history"
(
  history_id serial PRIMARY KEY,
  history_operation char(1) NOT NULL,
  history_created timestamp(0) NOT NULL,
  history_user text NOT NULL,
  id integer,
  parent_id integer,
  model character varying(255),
  foreign_key integer,
  alias character varying(255),
  lft integer,
  rght integer
) WITH (OIDS=FALSE);

-- # Create trigger to populate acos_history

CREATE OR REPLACE FUNCTION insert_into_acos_history() RETURNS trigger AS $insert_into_acos_history$
  BEGIN
    IF (TG_OP = 'DELETE') THEN
      INSERT INTO acos_history VALUES (DEFAULT, 'D', now(), user, OLD.*);
      RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
      INSERT INTO acos_history VALUES (DEFAULT, 'U', now(), user, NEW.*);
      RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
      INSERT INTO acos_history VALUES (DEFAULT, 'I', now(), user, NEW.*);
      RETURN NEW;
    END IF;
    RETURN NULL; -- result is ignored since this is an AFTER trigger
  END;
$insert_into_acos_history$ LANGUAGE plpgsql;

-- # Create acos_history_trigger

CREATE TRIGGER acos_history_trigger AFTER DELETE OR UPDATE ON acos
FOR EACH ROW EXECUTE PROCEDURE insert_into_acos_history(); 

-- # Create table aros_history

DROP TABLE IF EXISTS "aros_history" CASCADE;
CREATE TABLE aros_history
(
  history_id serial PRIMARY KEY,
  history_operation char(1) NOT NULL,
  history_created timestamp(0) NOT NULL,
  history_user text NOT NULL,
  id integer,
  parent_id integer,
  model character varying(255),
  foreign_key integer,
  alias character varying(255),
  lft integer,
  rght integer
) WITH (OIDS=FALSE);

-- # Create trigger to populate aros_history

CREATE OR REPLACE FUNCTION insert_into_aros_history() RETURNS trigger AS $insert_into_aros_history$
  BEGIN
    IF (TG_OP = 'DELETE') THEN
      INSERT INTO aros_history VALUES (DEFAULT, 'D', now(), user, OLD.*);
      RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
      INSERT INTO aros_history VALUES (DEFAULT, 'U', now(), user, NEW.*);
      RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
      INSERT INTO aros_history VALUES (DEFAULT, 'I', now(), user, NEW.*);
      RETURN NEW;
    END IF;
    RETURN NULL; -- result is ignored since this is an AFTER trigger
  END;
$insert_into_aros_history$ LANGUAGE plpgsql;

-- # Create aros_history_trigger

CREATE TRIGGER aros_history_trigger AFTER UPDATE OR DELETE ON aros
FOR EACH ROW EXECUTE PROCEDURE insert_into_aros_history(); 

-- # Create table aros_acos_history

DROP TABLE IF EXISTS "aros_acos_history" CASCADE;
CREATE TABLE aros_acos_history
(
  history_id serial PRIMARY KEY,
  history_operation char(1) NOT NULL,
  history_created timestamp(0) NOT NULL,
  history_user text NOT NULL,
  id integer,
  aro_id integer,
  aco_id integer,
  _create character varying(2),
  _read character varying(2),
  _update character varying(2),
  _delete character varying(2)
) WITH (OIDS=FALSE);

-- # Create trigger to populate aros_acos_history

CREATE OR REPLACE FUNCTION insert_into_aros_acos_history() RETURNS trigger AS $insert_into_aros_acos_history$
  BEGIN
    IF (TG_OP = 'DELETE') THEN
      INSERT INTO aros_acos_history VALUES (DEFAULT, 'D', now(), user, OLD.*);
      RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
      INSERT INTO aros_acos_history VALUES (DEFAULT, 'U', now(), user, NEW.*);
      RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
      INSERT INTO aros_acos_history VALUES (DEFAULT, 'I', now(), user, NEW.*);
      RETURN NEW;
    END IF;
    RETURN NULL; -- result is ignored since this is an AFTER trigger
  END;
$insert_into_aros_acos_history$ LANGUAGE plpgsql;

-- # Create aros_history_trigger

CREATE TRIGGER aros_acos_history_trigger AFTER UPDATE OR DELETE ON aros_acos
FOR EACH ROW EXECUTE PROCEDURE insert_into_aros_acos_history(); 

-- # users_history populating trigger function

CREATE OR REPLACE FUNCTION insert_into_users_history() RETURNS trigger AS $insert_into_users_history$
  BEGIN
    -- insert record into users_history table
    INSERT INTO users_history (user_id,login,name,surname,date_of_birth,gender,email,corporate_unit,groups_description,personal_page,phone,phone2,working_place,publik_id,registration_date,role,mod_date_of_birth,mod_email,mod_description,mod_personal_page,mod_phone,mod_phone2,mod_working_place,mod_role,mod_home_address,mod_carpooling,privacy_policy_acceptance,facebook,linkedin,twitter,deleted,deleted_date, active, number_of_columns, background_id, theme, notification, institute_id) VALUES (OLD.id,OLD.login,OLD.name,OLD.surname,OLD.date_of_birth,OLD.gender,OLD.email,OLD.corporate_unit,OLD.groups_description,OLD.personal_page,OLD.phone,OLD.phone2,OLD.working_place,OLD.publik_id,OLD.created,OLD.role,OLD.mod_date_of_birth,OLD.mod_email,OLD.mod_description,OLD.mod_personal_page,OLD.mod_phone,OLD.mod_phone2,OLD.mod_working_place,OLD.mod_role,OLD.mod_home_address,OLD.mod_carpooling,OLD.privacy_policy_acceptance,OLD.facebook,OLD.linkedin,OLD.twitter,OLD.deleted,OLD.deleted_date,OLD.active,OLD.number_of_columns,OLD.background_id,OLD.theme, OLD.notification, OLD.institute_id);
    IF (OLD.institute_id <> NEW.institute_id) THEN
        UPDATE identities SET institute_id = NEW.institute_id WHERE user_id = NEW.id;
    END IF;
    RETURN NULL;
  END;
$insert_into_users_history$ LANGUAGE plpgsql;

-- # Create users_trigger

CREATE TRIGGER users_trigger AFTER UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE PROCEDURE insert_into_users_history(); 

-- # Create users_widgets history trigger function

CREATE OR REPLACE FUNCTION insert_into_users_widgets_history() RETURNS trigger AS $insert_into_users_widgets_history$
  BEGIN
    -- insert record into users_widgets_history table
    INSERT INTO users_widgets_history (user_widget_id, widget_id, user_id, col, pos, tab, widget_conf) VALUES (OLD.id,OLD.widget_id,OLD.user_id, OLD.col, OLD.pos, OLD.tab, OLD.widget_conf);
    RETURN NEW;
  END;
$insert_into_users_widgets_history$ LANGUAGE plpgsql;

-- # Create users_widgets_trigger

-- === users_widgets ===
CREATE TRIGGER users_widgets_trigger AFTER UPDATE OR DELETE ON users_widgets
FOR EACH ROW EXECUTE PROCEDURE insert_into_users_widgets_history(); 

-- # History tables indexes

SELECT SETVAL('groups_users_history_id_seq', (select MAX(id) from groups_users_history)+1);
SELECT SETVAL('users_history_id_seq', (select MAX(id) from users_history)+1);
SELECT SETVAL('users_widgets_history_id_seq', (select MAX(id) from users_widgets_history)+1);
