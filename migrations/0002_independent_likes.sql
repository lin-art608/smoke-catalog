CREATE TABLE IF NOT EXISTS exhibit_likes (
 visitor TEXT NOT NULL CHECK(length(visitor)=64),
 day TEXT NOT NULL CHECK(length(day)=10),
 exhibit_id TEXT NOT NULL,
 PRIMARY KEY(visitor, exhibit_id)
);
CREATE INDEX IF NOT EXISTS exhibit_likes_day_exhibit ON exhibit_likes(day, exhibit_id);
INSERT OR IGNORE INTO exhibit_likes(visitor, day, exhibit_id)
 SELECT visitor, MIN(day), exhibit_id FROM preferences GROUP BY visitor, exhibit_id;
