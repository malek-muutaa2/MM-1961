CREATE TABLE "audit_log" (
	"id" serial NOT NULL,
	"timestamp" timestamp NOT NULL,
	"actor" varchar(255) NOT NULL,
	"event" varchar(255) NOT NULL,
	"event_description" text NOT NULL,
	"targets" json NOT NULL,
	"client" json
);
