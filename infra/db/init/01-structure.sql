CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY,
  email varchar(100) NOT NULL,
	token varchar(255),
  password varchar(255),
  "timeZone" smallint,
	"createdAt" timestamp WITHOUT time ZONE DEFAULT NOW(),
	"updatedAt" timestamp WITHOUT time ZONE,
	"deletedAt" timestamp WITHOUT time ZONE
);
ALTER TABLE users ADD CONSTRAINT "pkUser" PRIMARY KEY (id);
CREATE UNIQUE INDEX "akUserEmail" ON users (email);
