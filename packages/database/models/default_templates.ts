import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const defaultTemplatesTable = pgTable("default_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  category: varchar("category", { length: 100 }),
  icon: varchar("icon", { length: 100 }),
  
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Seed Definitions
export const SEED_TEMPLATES = [
  {
    "template": {
      "name": "Student Registration",
      "description": "A comprehensive form for new student enrollment with academic history and emergency contacts.",
      "category": "Education",
      "icon": "GraduationCap"
    },
    "form": {
      "title": "Student Registration",
      "description": "A comprehensive form for new student enrollment with academic history and emergency contacts."
    },
    "fields": [
      {
        "id": "id-qld3czlf7",
        "type": "text",
        "label": "Full Name",
        "labelKey": "full_name",
        "isRequired": true,
        "order": 1,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "John Doe"
        }
      },
      {
        "id": "id-v34aj6n7v",
        "type": "email",
        "label": "Email",
        "labelKey": "email",
        "isRequired": true,
        "order": 2,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "john@example.com"
        }
      },
      {
        "id": "id-b33flstdt",
        "type": "phone",
        "label": "Phone",
        "labelKey": "phone",
        "isRequired": true,
        "order": 3,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "+1 555-0100"
        }
      },
      {
        "id": "id-vh0nf9o7s",
        "type": "date",
        "label": "Date of Birth",
        "labelKey": "dob",
        "isRequired": true,
        "order": 4,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "dateFormat": "YYYY-MM-DD"
        }
      },
      {
        "id": "id-ou4pehk55",
        "type": "select",
        "label": "Gender",
        "labelKey": "gender",
        "isRequired": true,
        "order": 5,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Male",
              "value": "Male"
            },
            {
              "id": "opt-1",
              "label": "Female",
              "value": "Female"
            },
            {
              "id": "opt-2",
              "label": "Other",
              "value": "Other"
            },
            {
              "id": "opt-3",
              "label": "Prefer not to say",
              "value": "Prefer not to say"
            }
          ]
        }
      },
      {
        "id": "id-s6xvp5q6h",
        "type": "textarea",
        "label": "Address",
        "labelKey": "address",
        "isRequired": true,
        "order": 6,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "123 Main St..."
        }
      },
      {
        "id": "id-eai231h9r",
        "type": "text",
        "label": "City",
        "labelKey": "city",
        "isRequired": true,
        "order": 7,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "New York"
        }
      },
      {
        "id": "id-jxnpg37b3",
        "type": "text",
        "label": "State",
        "labelKey": "state",
        "isRequired": true,
        "order": 8,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "NY"
        }
      },
      {
        "id": "id-b0z87d2xl",
        "type": "number",
        "label": "Postal Code",
        "labelKey": "postal_code",
        "isRequired": true,
        "order": 9,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "10001"
        }
      },
      {
        "id": "id-bt70mrf1f",
        "type": "select",
        "label": "Course",
        "labelKey": "course",
        "isRequired": true,
        "order": 10,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Computer Science",
              "value": "Computer Science"
            },
            {
              "id": "opt-1",
              "label": "Business Administration",
              "value": "Business Administration"
            },
            {
              "id": "opt-2",
              "label": "Engineering",
              "value": "Engineering"
            },
            {
              "id": "opt-3",
              "label": "Arts & Humanities",
              "value": "Arts & Humanities"
            }
          ]
        }
      },
      {
        "id": "id-6nqk9rn4n",
        "type": "text",
        "label": "10th Board",
        "labelKey": "10th_board",
        "isRequired": true,
        "order": 11,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "CBSE / State Board"
        }
      },
      {
        "id": "id-gln3lj69c",
        "type": "text",
        "label": "10th Roll Number",
        "labelKey": "10th_roll",
        "isRequired": true,
        "order": 12,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Roll Number"
        }
      },
      {
        "id": "id-ufe1v3oqb",
        "type": "number",
        "label": "10th Percentage",
        "labelKey": "10th_percentage",
        "isRequired": true,
        "order": 13,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "95.5"
        }
      },
      {
        "id": "id-qnga9vgq4",
        "type": "text",
        "label": "12th Board",
        "labelKey": "12th_board",
        "isRequired": true,
        "order": 14,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "CBSE / State Board"
        }
      },
      {
        "id": "id-gt3bw88u7",
        "type": "text",
        "label": "12th Roll Number",
        "labelKey": "12th_roll",
        "isRequired": true,
        "order": 15,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Roll Number"
        }
      },
      {
        "id": "id-h9iyn37wq",
        "type": "number",
        "label": "12th Percentage",
        "labelKey": "12th_percentage",
        "isRequired": true,
        "order": 16,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "95.5"
        }
      },
      {
        "id": "grad_status_id",
        "type": "yes_no",
        "label": "Graduation Status",
        "labelKey": "grad_status",
        "isRequired": true,
        "order": 17,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "yesLabel": "Yes",
          "noLabel": "No",
          "layout": "horizontal"
        }
      },
      {
        "id": "id-pypdtrx43",
        "type": "text",
        "label": "Graduation College",
        "labelKey": "grad_college",
        "isRequired": true,
        "order": 18,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "University Name",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-5vkkt2pho",
                "sourceFieldId": "grad_status_id",
                "operator": "equals",
                "value": "Yes"
              }
            ]
          }
        }
      },
      {
        "id": "id-yt9vsenc3",
        "type": "number",
        "label": "Graduation Year",
        "labelKey": "grad_year",
        "isRequired": true,
        "order": 19,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "2023",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-8s9yc3021",
                "sourceFieldId": "grad_status_id",
                "operator": "equals",
                "value": "Yes"
              }
            ]
          }
        }
      },
      {
        "id": "id-vlyfx5q09",
        "type": "number",
        "label": "Graduation CGPA",
        "labelKey": "grad_cgpa",
        "isRequired": true,
        "order": 20,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "3.8",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-teqmqtodw",
                "sourceFieldId": "grad_status_id",
                "operator": "equals",
                "value": "Yes"
              }
            ]
          }
        }
      },
      {
        "id": "id-mvbk7pd8q",
        "type": "text",
        "label": "Emergency Contact Name",
        "labelKey": "emergency_name",
        "isRequired": true,
        "order": 21,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Jane Doe"
        }
      },
      {
        "id": "id-7usc1slqf",
        "type": "phone",
        "label": "Emergency Contact Phone",
        "labelKey": "emergency_phone",
        "isRequired": true,
        "order": 22,
        "config": {
          "appearance": {
            "primaryColor": "#2563eb",
            "theme": "Academic"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "+1 555-0100"
        }
      }
    ]
  },
  {
    "template": {
      "name": "Job Application",
      "description": "Corporate application form for recruiting professionals with dynamic employment history.",
      "category": "HR & Recruiting",
      "icon": "Briefcase"
    },
    "form": {
      "title": "Job Application",
      "description": "Corporate application form for recruiting professionals with dynamic employment history."
    },
    "fields": [
      {
        "id": "id-di5sjp5lk",
        "type": "text",
        "label": "Full Name",
        "labelKey": "full_name",
        "isRequired": true,
        "order": 1,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Jane Doe"
        }
      },
      {
        "id": "id-b4j129654",
        "type": "email",
        "label": "Email",
        "labelKey": "email",
        "isRequired": true,
        "order": 2,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "jane@example.com"
        }
      },
      {
        "id": "id-isv2bmo15",
        "type": "phone",
        "label": "Phone",
        "labelKey": "phone",
        "isRequired": true,
        "order": 3,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "+1 555-0200"
        }
      },
      {
        "id": "id-qx5z5du0h",
        "type": "text",
        "label": "City",
        "labelKey": "city",
        "isRequired": true,
        "order": 4,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "San Francisco"
        }
      },
      {
        "id": "id-u8cogjzs7",
        "type": "text",
        "label": "LinkedIn Profile",
        "labelKey": "linkedin",
        "isRequired": false,
        "order": 5,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "linkedin.com/in/janedoe"
        }
      },
      {
        "id": "id-0zpywg2ol",
        "type": "text",
        "label": "Portfolio URL",
        "labelKey": "portfolio",
        "isRequired": false,
        "order": 6,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "janedoe.com"
        }
      },
      {
        "id": "emp_status_id",
        "type": "select",
        "label": "Employment Status",
        "labelKey": "emp_status",
        "isRequired": true,
        "order": 7,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Employed",
              "value": "Employed"
            },
            {
              "id": "opt-1",
              "label": "Unemployed",
              "value": "Unemployed"
            },
            {
              "id": "opt-2",
              "label": "Student",
              "value": "Student"
            },
            {
              "id": "opt-3",
              "label": "Freelancer",
              "value": "Freelancer"
            }
          ]
        }
      },
      {
        "id": "id-c7qco9ygd",
        "type": "text",
        "label": "Current Company",
        "labelKey": "current_company",
        "isRequired": true,
        "order": 8,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Tech Corp",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-cztdfg765",
                "sourceFieldId": "emp_status_id",
                "operator": "equals",
                "value": "Employed"
              }
            ]
          }
        }
      },
      {
        "id": "id-zs5ta24xe",
        "type": "text",
        "label": "Current Role",
        "labelKey": "current_role",
        "isRequired": true,
        "order": 9,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Software Engineer",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-j3e1viiyu",
                "sourceFieldId": "emp_status_id",
                "operator": "equals",
                "value": "Employed"
              }
            ]
          }
        }
      },
      {
        "id": "id-5v4t4ckpb",
        "type": "number",
        "label": "Experience (Years)",
        "labelKey": "experience",
        "isRequired": true,
        "order": 10,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "5"
        }
      },
      {
        "id": "id-fd7kdzsoj",
        "type": "textarea",
        "label": "Skills",
        "labelKey": "skills",
        "isRequired": true,
        "order": 11,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "React, Node.js, TypeScript..."
        }
      },
      {
        "id": "id-sbdydmlcf",
        "type": "number",
        "label": "Expected Salary",
        "labelKey": "expected_salary",
        "isRequired": true,
        "order": 12,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "120000"
        }
      },
      {
        "id": "id-xtpofk3oe",
        "type": "text",
        "label": "Notice Period",
        "labelKey": "notice_period",
        "isRequired": true,
        "order": 13,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "2 Weeks"
        }
      },
      {
        "id": "id-nhxen2q0y",
        "type": "text",
        "label": "Preferred Role",
        "labelKey": "preferred_role",
        "isRequired": true,
        "order": 14,
        "config": {
          "appearance": {
            "primaryColor": "#0f172a",
            "theme": "Corporate"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Senior Engineer"
        }
      }
    ]
  },
  {
    "template": {
      "name": "Event Registration",
      "description": "Streamlined registration for events and conferences with meal and session preferences.",
      "category": "Events",
      "icon": "Ticket"
    },
    "form": {
      "title": "Event Registration",
      "description": "Streamlined registration for events and conferences with meal and session preferences."
    },
    "fields": [
      {
        "id": "id-ea5swusuv",
        "type": "text",
        "label": "Full Name",
        "labelKey": "full_name",
        "isRequired": true,
        "order": 1,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Alice Smith"
        }
      },
      {
        "id": "id-l03li7g0r",
        "type": "email",
        "label": "Email",
        "labelKey": "email",
        "isRequired": true,
        "order": 2,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "alice@example.com"
        }
      },
      {
        "id": "id-fklmrpzs6",
        "type": "phone",
        "label": "Phone",
        "labelKey": "phone",
        "isRequired": true,
        "order": 3,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "+1 555-0300"
        }
      },
      {
        "id": "id-dvzh5uq36",
        "type": "text",
        "label": "Organization",
        "labelKey": "organization",
        "isRequired": true,
        "order": 4,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Acme Inc"
        }
      },
      {
        "id": "id-opcepi1e1",
        "type": "text",
        "label": "Designation",
        "labelKey": "designation",
        "isRequired": true,
        "order": 5,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Manager"
        }
      },
      {
        "id": "id-26ue01d0i",
        "type": "select",
        "label": "Event Selection",
        "labelKey": "event",
        "isRequired": true,
        "order": 6,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Day 1 - Keynote",
              "value": "Day 1 - Keynote"
            },
            {
              "id": "opt-1",
              "label": "Day 2 - Workshops",
              "value": "Day 2 - Workshops"
            },
            {
              "id": "opt-2",
              "label": "Full Pass",
              "value": "Full Pass"
            }
          ]
        }
      },
      {
        "id": "att_type_id",
        "type": "radio",
        "label": "Attendance Type",
        "labelKey": "attendance_type",
        "isRequired": true,
        "order": 7,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "layout": "vertical",
          "options": [
            {
              "id": "opt-0",
              "label": "In Person",
              "value": "In Person"
            },
            {
              "id": "opt-1",
              "label": "Virtual",
              "value": "Virtual"
            }
          ]
        }
      },
      {
        "id": "id-omd7u8i9x",
        "type": "select",
        "label": "Session Preference",
        "labelKey": "session",
        "isRequired": true,
        "order": 8,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Morning Sessions",
              "value": "Morning Sessions"
            },
            {
              "id": "opt-1",
              "label": "Afternoon Sessions",
              "value": "Afternoon Sessions"
            },
            {
              "id": "opt-2",
              "label": "Both",
              "value": "Both"
            }
          ]
        }
      },
      {
        "id": "id-bo21ec0h5",
        "type": "select",
        "label": "Meal Preference",
        "labelKey": "meal",
        "isRequired": true,
        "order": 9,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Standard",
              "value": "Standard"
            },
            {
              "id": "opt-1",
              "label": "Vegetarian",
              "value": "Vegetarian"
            },
            {
              "id": "opt-2",
              "label": "Vegan",
              "value": "Vegan"
            },
            {
              "id": "opt-3",
              "label": "Gluten-Free",
              "value": "Gluten-Free"
            }
          ],
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-r4d9wr9g3",
                "sourceFieldId": "att_type_id",
                "operator": "equals",
                "value": "In Person"
              }
            ]
          }
        }
      },
      {
        "id": "id-1rmv7f0ex",
        "type": "text",
        "label": "Emergency Contact",
        "labelKey": "emergency_contact",
        "isRequired": true,
        "order": 10,
        "config": {
          "appearance": {
            "primaryColor": "#7c3aed",
            "theme": "Modern Event"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Bob Smith (+1 555-0400)"
        }
      }
    ]
  },
  {
    "template": {
      "name": "Customer Feedback",
      "description": "Collect valuable feedback on products and services with conditional drill-down.",
      "category": "Feedback",
      "icon": "MessageSquare"
    },
    "form": {
      "title": "Customer Feedback",
      "description": "Collect valuable feedback on products and services with conditional drill-down."
    },
    "fields": [
      {
        "id": "id-9c79qw4ea",
        "type": "text",
        "label": "Full Name",
        "labelKey": "full_name",
        "isRequired": true,
        "order": 1,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Michael Brown"
        }
      },
      {
        "id": "id-s47nmtu4q",
        "type": "email",
        "label": "Email",
        "labelKey": "email",
        "isRequired": true,
        "order": 2,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "michael@example.com"
        }
      },
      {
        "id": "id-rx5ubrcyw",
        "type": "text",
        "label": "Product Used",
        "labelKey": "product",
        "isRequired": true,
        "order": 3,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Product A"
        }
      },
      {
        "id": "id-34oyy1juv",
        "type": "select",
        "label": "Usage Frequency",
        "labelKey": "frequency",
        "isRequired": true,
        "order": 4,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Daily",
              "value": "Daily"
            },
            {
              "id": "opt-1",
              "label": "Weekly",
              "value": "Weekly"
            },
            {
              "id": "opt-2",
              "label": "Monthly",
              "value": "Monthly"
            },
            {
              "id": "opt-3",
              "label": "Rarely",
              "value": "Rarely"
            }
          ]
        }
      },
      {
        "id": "id-oahvz2irn",
        "type": "number",
        "label": "Overall Rating (1-5)",
        "labelKey": "overall_rating",
        "isRequired": true,
        "order": 5,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "validation": {
            "min": 1,
            "max": 5
          },
          "placeholder": "5"
        }
      },
      {
        "id": "id-yk4lfsgq4",
        "type": "number",
        "label": "Ease Of Use Rating (1-5)",
        "labelKey": "ease_rating",
        "isRequired": true,
        "order": 6,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "validation": {
            "min": 1,
            "max": 5
          },
          "placeholder": "5"
        }
      },
      {
        "id": "id-tr743wlds",
        "type": "number",
        "label": "Support Rating (1-5)",
        "labelKey": "support_rating",
        "isRequired": true,
        "order": 7,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "validation": {
            "min": 1,
            "max": 5
          },
          "placeholder": "4"
        }
      },
      {
        "id": "rec_score_id",
        "type": "number",
        "label": "Recommendation Score (1-10)",
        "labelKey": "rec_score",
        "isRequired": true,
        "order": 8,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "validation": {
            "min": 1,
            "max": 10
          },
          "placeholder": "10"
        }
      },
      {
        "id": "id-1zaa14vwq",
        "type": "textarea",
        "label": "Favorite Feature",
        "labelKey": "favorite",
        "isRequired": false,
        "order": 9,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "I really liked..."
        }
      },
      {
        "id": "id-p1r7lxoyx",
        "type": "textarea",
        "label": "Least Favorite Feature",
        "labelKey": "least_favorite",
        "isRequired": false,
        "order": 10,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "It could improve on..."
        }
      },
      {
        "id": "id-lyww4jgtd",
        "type": "textarea",
        "label": "Additional Feedback",
        "labelKey": "additional_feedback",
        "isRequired": true,
        "order": 11,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Tell us more about your low score...",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-rw9k393es",
                "sourceFieldId": "rec_score_id",
                "operator": "less_than",
                "value": 7
              }
            ]
          }
        }
      },
      {
        "id": "id-yw0piz1f5",
        "type": "textarea",
        "label": "Suggestions",
        "labelKey": "suggestions",
        "isRequired": false,
        "order": 12,
        "config": {
          "appearance": {
            "primaryColor": "#ea580c",
            "theme": "Review"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Any features you'd like to see?"
        }
      }
    ]
  },
  {
    "template": {
      "name": "Contact Us",
      "description": "A flexible inquiry form with dynamic department routing and escalation tracking.",
      "category": "General",
      "icon": "Mail"
    },
    "form": {
      "title": "Contact Us",
      "description": "A flexible inquiry form with dynamic department routing and escalation tracking."
    },
    "fields": [
      {
        "id": "id-ertquqgzn",
        "type": "text",
        "label": "Full Name",
        "labelKey": "full_name",
        "isRequired": true,
        "order": 1,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Sarah Johnson"
        }
      },
      {
        "id": "id-6bbaknng5",
        "type": "email",
        "label": "Email",
        "labelKey": "email",
        "isRequired": true,
        "order": 2,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "sarah@example.com"
        }
      },
      {
        "id": "id-gyi08ele7",
        "type": "phone",
        "label": "Phone",
        "labelKey": "phone",
        "isRequired": false,
        "order": 3,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "+1 555-0500"
        }
      },
      {
        "id": "id-3a9neqdh3",
        "type": "text",
        "label": "Company",
        "labelKey": "company",
        "isRequired": false,
        "order": 4,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Innovate LLC"
        }
      },
      {
        "id": "id-ux4075cbx",
        "type": "select",
        "label": "Department",
        "labelKey": "department",
        "isRequired": true,
        "order": 5,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "General",
              "value": "General"
            },
            {
              "id": "opt-1",
              "label": "Support",
              "value": "Support"
            },
            {
              "id": "opt-2",
              "label": "Sales",
              "value": "Sales"
            },
            {
              "id": "opt-3",
              "label": "Billing",
              "value": "Billing"
            }
          ]
        }
      },
      {
        "id": "inq_type_id",
        "type": "select",
        "label": "Inquiry Type",
        "labelKey": "inquiry_type",
        "isRequired": true,
        "order": 6,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Question",
              "value": "Question"
            },
            {
              "id": "opt-1",
              "label": "Issue/Bug",
              "value": "Issue/Bug"
            },
            {
              "id": "opt-2",
              "label": "Feature Request",
              "value": "Feature Request"
            },
            {
              "id": "opt-3",
              "label": "Partnership",
              "value": "Partnership"
            },
            {
              "id": "opt-4",
              "label": "Escalation",
              "value": "Escalation"
            }
          ]
        }
      },
      {
        "id": "id-afm7yehsx",
        "type": "text",
        "label": "Subject",
        "labelKey": "subject",
        "isRequired": true,
        "order": 7,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Brief summary of your inquiry"
        }
      },
      {
        "id": "id-xqinslli4",
        "type": "radio",
        "label": "Preferred Contact Method",
        "labelKey": "contact_method",
        "isRequired": true,
        "order": 8,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "layout": "horizontal",
          "options": [
            {
              "id": "opt-0",
              "label": "Email",
              "value": "Email"
            },
            {
              "id": "opt-1",
              "label": "Phone",
              "value": "Phone"
            }
          ]
        }
      },
      {
        "id": "id-x2kydan4o",
        "type": "select",
        "label": "Preferred Contact Time",
        "labelKey": "contact_time",
        "isRequired": false,
        "order": 9,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "options": [
            {
              "id": "opt-0",
              "label": "Morning",
              "value": "Morning"
            },
            {
              "id": "opt-1",
              "label": "Afternoon",
              "value": "Afternoon"
            },
            {
              "id": "opt-2",
              "label": "Evening",
              "value": "Evening"
            }
          ]
        }
      },
      {
        "id": "id-vy8lbfu5g",
        "type": "textarea",
        "label": "Department Details",
        "labelKey": "dept_details",
        "isRequired": true,
        "order": 10,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "Please provide order numbers or ticket IDs for escalation.",
          "logic": {
            "action": "show",
            "conditionType": "all",
            "rules": [
              {
                "id": "id-nu950uoan",
                "sourceFieldId": "inq_type_id",
                "operator": "equals",
                "value": "Escalation"
              }
            ]
          }
        }
      },
      {
        "id": "id-7vtdars1c",
        "type": "textarea",
        "label": "Message",
        "labelKey": "message",
        "isRequired": true,
        "order": 11,
        "config": {
          "appearance": {
            "primaryColor": "#16a34a",
            "theme": "Support"
          },
          "typography": {
            "font": "Inter",
            "size": "sm"
          },
          "placeholder": "How can we help you today?"
        }
      }
    ]
  }
];
