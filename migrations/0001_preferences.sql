CREATE TABLE IF NOT EXISTS preferences (
 visitor TEXT NOT NULL CHECK(length(visitor)=64),
 day TEXT NOT NULL CHECK(length(day)=10),
 exhibit_id TEXT NOT NULL,
 PRIMARY KEY(visitor, day)
);
CREATE INDEX IF NOT EXISTS preferences_day_exhibit ON preferences(day, exhibit_id);
