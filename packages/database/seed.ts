import { db, eq } from "./index";
import { formsTable } from "./models/form";
import { formFieldsTable } from "./models/form-field";
import { defaultTemplatesTable, SEED_TEMPLATES } from "./models/default_templates";
import { usersTable } from "./models/user";
import { randomUUID } from "crypto";

async function seed() {
    console.log("Seeding templates...");
    
    // Find or create a dedicated System User for the templates
    const SYSTEM_EMAIL = "system@kotonoha.local";
    let systemUser = await db.select().from(usersTable).where(eq(usersTable.email, SYSTEM_EMAIL)).limit(1);
    
    let systemUserId: string;
    if (systemUser.length === 0) {
        console.log("Creating dedicated System User...");
        const insertResult = await db.insert(usersTable).values({
            fullName: "System Account",
            email: SYSTEM_EMAIL,
            passwordHash: "system_account_no_login", // Dummy hash, this user cannot login
            emailVerified: true
        }).returning({ id: usersTable.id });
        systemUserId = insertResult[0]!.id;
    } else {
        systemUserId = systemUser[0]!.id;
    }
    
    await db.delete(defaultTemplatesTable);
    console.log("Cleared existing templates.");

    for (const templateData of SEED_TEMPLATES) {
        const insertFormResult = await db.insert(formsTable).values({
            title: templateData.form.title,
            description: templateData.form.description,
            createdBy: systemUserId,
            status: "draft"
        }).returning({ id: formsTable.id });
        
        const formId = insertFormResult[0]!.id;

        const idMap: Record<string, string> = {};
        for (const f of templateData.fields) {
            idMap[f.id] = randomUUID();
        }

        const fields = templateData.fields.map(f => {
            const newFieldId = idMap[f.id];
            
            let configCopy: any = f.config ? JSON.parse(JSON.stringify(f.config)) : {};
            
            if (configCopy.logic && Array.isArray(configCopy.logic.rules)) {
                configCopy.logic.rules = configCopy.logic.rules.map((rule: any) => {
                    if (rule.sourceFieldId && idMap[rule.sourceFieldId]) {
                        return { ...rule, sourceFieldId: idMap[rule.sourceFieldId] };
                    }
                    return rule;
                });
            }
            
            return {
                ...f,
                id: newFieldId,
                formId: formId,
                config: configCopy
            };
        });

        if (fields.length > 0) {
            await db.insert(formFieldsTable).values(fields as any);
        }

        await db.insert(defaultTemplatesTable).values({
            name: templateData.template.name,
            description: templateData.template.description,
            category: templateData.template.category,
            icon: templateData.template.icon,
            formId: formId
        });
        
        console.log(`Seeded template: ${templateData.template.name}`);
    }
    
    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
