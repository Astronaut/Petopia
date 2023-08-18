CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "bio" TEXT,
    "pet_name" VARCHAR (100),
    "profile_picture" VARCHAR (500)
);

CREATE TABLE "posts" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "image_url" VARCHAR (500) NOT NULL,
    "caption" TEXT,
    "likes" INT DEFAULT 0,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "comments" (
    "id" SERIAL PRIMARY KEY,
    "post_id" INT REFERENCES "posts" ON DELETE CASCADE,
    "user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "comment_text" TEXT NOT NULL,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "followers" (
    "follower_id" INT REFERENCES "user" ON DELETE CASCADE,
    "following_id" INT REFERENCES "user" ON DELETE CASCADE,
    PRIMARY KEY ("follower_id", "following_id")
);
