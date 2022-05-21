import { ChallengeType } from "nexus-prisma";
import { objectType, enumType } from "nexus";

export const challengeType = enumType(ChallengeType);

export const Challenge = objectType({
    name: "Challenge",
    definition(t) {
        t.nonNull.int("id");
        t.string("title");
        t.string("description");
		t.field("type", { type: challengeType });
        t.field("startDate", { type: "DateTime" });
        t.field("endDate", { type: "DateTime" });
        t.field("createdAt", { type: "DateTime" });
        t.field("updatedAt", { type: "DateTime" });
        t.list.field("activities", {
            type: "Activity",
            resolve(root, args, ctx) {
                return ctx.db.activity.findMany({ where: { challengeId: root.id } });
            }
        });
    }
});