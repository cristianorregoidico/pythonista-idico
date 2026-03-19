import { z } from "zod";
import { PYTHON_TECHNOLOGIES, PYTHON_VERSIONS } from "@/lib/constants";

const hasProtocol = (value: string) => /^https?:\/\//i.test(value);
const isMailto = (value: string) => /^mailto:/i.test(value.trim());
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const contactLinkSchema = z
  .object({
    label: z.string().trim().min(2, "Add a link label"),
    url: z.string().trim().min(3, "Add a link value"),
  })
  .superRefine((value, ctx) => {
    const normalized = value.url.trim();

    if (isEmail(normalized)) {
      const emailResult = z.string().email().safeParse(normalized);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email",
          path: ["url"],
        });
      }
      return;
    }

    if (isMailto(normalized)) {
      const emailValue = normalized.replace(/^mailto:/i, "");
      const emailResult = z.string().email().safeParse(emailValue);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email",
          path: ["url"],
        });
      }
      return;
    }

    const urlForValidation = hasProtocol(normalized) ? normalized : `https://${normalized}`;
    const urlResult = z.string().url().safeParse(urlForValidation);
    if (!urlResult.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a valid URL or email",
        path: ["url"],
      });
    }
  });

export const registrationSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required"),
    city: z.string().trim().min(2, "City is required"),
    country: z.string().trim().optional(),
    latitude: z.number({ message: "Latitude is required" }),
    longitude: z.number({ message: "Longitude is required" }),
    pythonVersion: z.enum(PYTHON_VERSIONS, {
      error: "Select a Python version",
    }),
    pythonTechnologies: z
      .array(z.enum(PYTHON_TECHNOLOGIES))
      .min(1, "Select at least one technology")
      .max(12, "Too many technologies selected"),
    profileImageUrl: z.string().trim().optional(),
    contactLinks: z.array(contactLinkSchema).max(10, "Too many contact links"),
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(8, "Password must have at least 8 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
