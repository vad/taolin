-- 
-- STORED PROCEDURES
--

CREATE OR REPLACE FUNCTION set_groups_description(integer) RETURNS void AS $$
    UPDATE users SET groups_description = 
        (SELECT array_to_string(ARRAY(SELECT name FROM groups WHERE groups.id IN 
            (SELECT groups_users.group_id FROM groups_users WHERE groups_users.user_id = users.id)), ','))
    WHERE id = $1;
$$ LANGUAGE SQL;




CREATE OR REPLACE FUNCTION groups_users_trigger_fun() RETURNS trigger AS $groups_users_trigger_fun$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            -- invoke set_groups_description function
            PERFORM set_groups_description(NEW.user_id);
        -- insert record into users_history table if operation is not insert
        ELSE 
            -- invoke set_groups_description function
            PERFORM set_groups_description(OLD.user_id);
            INSERT INTO groups_users_history (group_id,user_id,created_on) VALUES (OLD.group_id,OLD.user_id,OLD.created);
        END IF;
    RETURN NULL;
  END;
$groups_users_trigger_fun$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insert_new_event_into_timeline() RETURNS trigger AS $insert_new_event_into_timeline$
  BEGIN
    -- insert record into users_history table if operation is not insert
    IF NEW.calendar_id IN (SELECT id FROM calendars WHERE url = 'http://www.fbk.eu/event.ics' OR url = 'http://in.fbk.eu/event.ics') THEN
        INSERT INTO timelines (template_id, param, date) VALUES (13, '{"summary":"' || REPLACE(SUBSTRING(NEW.summary,1,50),'"','\\"') || '..."}', NEW.created);
    END IF;
    RETURN NEW;
  END;
$insert_new_event_into_timeline$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION on_delete_photo() RETURNS trigger AS $on_delete_photo$
  BEGIN
    IF OLD.default_photo = 1 THEN 
        UPDATE photos SET default_photo = 1 WHERE id = (SELECT id FROM photos WHERE user_id = OLD.user_id AND deleted = 0 ORDER BY insert_date ASC LIMIT 1);
    END IF;
    RETURN NEW;
  END;
$on_delete_photo$ LANGUAGE plpgsql;


-- #### --

--
-- INDEXES
--

CREATE INDEX users_tsv_idx ON users USING gin (tsv);

CREATE INDEX photos_user_id_idx ON photos USING btree (user_id);

CREATE INDEX timelines_user_id_idx ON timelines USING btree (user_id);

CREATE INDEX users_widgets_user_id_idx ON users_widgets (user_id);

CREATE INDEX groups_users_user_id_idx ON groups_users (user_id);

CREATE INDEX content_types__table_name__idx ON content_types (table_name);


-- #### --

--
-- TRIGGERS
--


-- === groups_users ===
CREATE TRIGGER groups_users_trigger AFTER INSERT OR UPDATE OR DELETE ON groups_users
FOR EACH ROW EXECUTE PROCEDURE groups_users_trigger_fun(); 

-- === events ===
CREATE TRIGGER events_trigger AFTER INSERT ON events
FOR EACH ROW EXECUTE PROCEDURE insert_new_event_into_timeline(); 

-- === photos ===
--CREATE TRIGGER photos_trigger BEFORE UPDATE OR DELETE ON photos
--FOR EACH ROW EXECUTE PROCEDURE on_delete_photo(); 


-- #### --

--
-- SET SEQUENCES
--

SELECT SETVAL('boards_id_seq', (select MAX(id) from boards)+1);
SELECT SETVAL('buildings_id_seq', (select MAX(id) from buildings)+1);
SELECT SETVAL('calendars_id_seq', (select MAX(id) from calendars)+1);
SELECT SETVAL('events_id_seq', (select MAX(id) from events)+1);
SELECT SETVAL('feedbacks_id_seq', (select MAX(id) from feedbacks)+1);
SELECT SETVAL('groups_id_seq', (select MAX(id) from groups)+1);
SELECT SETVAL('institutes_id_seq', (select MAX(id) from institutes)+1);
SELECT SETVAL('logs_id_seq', (select MAX(id) from logs)+1);
SELECT SETVAL('photos_id_seq', (select MAX(id) from photos)+1);
SELECT SETVAL('templates_id_seq', (select MAX(id) from templates)+1);
SELECT SETVAL('timelines_id_seq', (select MAX(id) from timelines)+1);
SELECT SETVAL('users_id_seq', (select MAX(id) from users)+1);
SELECT SETVAL('users_widgets_id_seq', (select MAX(id) from users_widgets)+1);
SELECT SETVAL('widgets_id_seq', (select MAX(id) from widgets)+1);
SELECT SETVAL('widgets_skel_id_seq', (select MAX(id) from widgets_skel)+1);
SELECT SETVAL('workplaces_id_seq', (select MAX(id) from workplaces)+1);
