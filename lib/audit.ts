import { db } from "@/lib/db/dbpostgres";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { audit_log, users } from "./db/schema";
import { eq } from "drizzle-orm";

export interface AuditLog {
  // auto-generated ID
  timestamp: Date;
  // user email or system user
  actor: string;
  email: string;
  // dot notation path to the component beeing modified
  // example : 'user.delete', 'user.create', 'appariement.validate-facility', 'appariement.validate-sifa-admin' ...
  event: string;
  // description of the event
  event_description: string;
  // key-value pairs of the context of the event example
  // example : [{label: 'facility', value: 'CHUM'}, {label: 'matchId', value: '1234'} ...]
  targets: { label: string; value: string }[];
  // client information
  client?: {
    ip: string;
    userAgent: string;
  };
}

type AuditLogInput = Omit<AuditLog, "timestamp" | "client" | "actor">;

export const audit = async (log: AuditLogInput) => {
  const headerList = await headers();
    const session = await getServerSession();
  const timeZone = "America/Toronto";
  const now = new Date();

  // Convert the current date to the desired timezone
  const options = {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("en-CA", options);
  const [date, time] = formatter.format(now).split(", ");

  // Combine date and time parts into the desired format
  const formattedString = `${date.replace(/\//g, "-")}T${time}`;
  const dateFromString = new Date(formattedString);
  const auditLog: AuditLog = {
    timestamp: dateFromString,
    ...log,
    actor: log.email ,
    client: {
      ip:
        headerList.get("x-forwarded-for") ||
        headerList.get("x-real-ip") ||
        headerList.get("x-client-ip") ||
        headerList.get("x-remote-ip") ||
        headerList.get("remoteip") ||
        headerList.get("clientip") ||
        headerList.get("x-real-ip") ||
        "",
      userAgent: headerList.get("user-agent") || "unknown",
    },
  };

  try {
    await db.insert(audit_log).values(auditLog);
    if(auditLog.event === "user.signin" ) {
      console.log("Audit log for user sign in: ", auditLog);
      
    await db.update(users).set({ last_login: auditLog.timestamp }).where(eq(users.email,auditLog.email));

    }
  } catch (error) {
    console.error("audit error: ", error);
    // do nothing else
  }
};

export const exportAuditLogsToCsv = async () => {
  const logs = await db.select().from(audit_log);
  const csv = logs.map((log: AuditLog) => {
    return (
      `"${log.timestamp.toString().replace(/"/g, '""')}",` +
      `"${log.actor.replace(/"/g, '""')}",` +
      `"${log.event.replace(/"/g, '""')}",` +
      `"${log.event_description.replace(/"/g, '""')}",` +
      `"${log.targets
        .map((target) => `${target.label}:${target.value}`)
        .join("|")
        .replace(/"/g, '""')}",` +
      `"${log.client?.ip?.replace(/"/g, '""')}",` +
      `"${log.client?.userAgent?.replace(/"/g, '""')}"`
    );
  });
  csv.unshift(
    "Timestamp,Actor,Event,Event Description,Targets,Client IP,User Agent",
  );
  return csv.join("\n");
};
