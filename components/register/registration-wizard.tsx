"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PYTHON_TECHNOLOGIES, PYTHON_TECHNOLOGY_LOGOS, PYTHON_VERSIONS } from "@/lib/constants";
import { contactLinkSchema, registrationSchema } from "@/lib/validators";

type WizardState = {
  name: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  geocodeDisplayName: string;
  pythonVersion: string;
  pythonTechnologies: string[];
  profileImageUrl: string;
  contactLinks: Array<{ label: string; url: string }>;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialState: WizardState = {
  name: "",
  city: "",
  country: "",
  latitude: "",
  longitude: "",
  geocodeDisplayName: "",
  pythonVersion: "",
  pythonTechnologies: [],
  profileImageUrl: "",
  contactLinks: [{ label: "Website", url: "" }],
  email: "",
  password: "",
  confirmPassword: "",
};

const stepTitles = ["Basics", "Profile", "Account", "Review"];

export function RegistrationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    };
  }, [profilePreviewUrl]);

  const updateField = (key: keyof WizardState, value: string) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const copy = { ...current };
      delete copy[key];
      return copy;
    });
  };

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (data.name.trim().length < 2) nextErrors.name = "Name is required";
      if (data.city.trim().length < 2) nextErrors.city = "City is required";
      if (!data.latitude || Number.isNaN(Number(data.latitude))) {
        nextErrors.latitude = "Latitude is required";
      }
      if (!data.longitude || Number.isNaN(Number(data.longitude))) {
        nextErrors.longitude = "Longitude is required";
      }
    }

    if (step === 2) {
      if (!PYTHON_VERSIONS.includes(data.pythonVersion as (typeof PYTHON_VERSIONS)[number])) {
        nextErrors.pythonVersion = "Select a Python version";
      }
      if (data.pythonTechnologies.length === 0) {
        nextErrors.pythonTechnologies = "Select at least one technology";
      }
      data.contactLinks.forEach((link, index) => {
        if (!link.url.trim()) return;
        const parsed = contactLinkSchema.safeParse(link);
        if (!parsed.success) {
          const issue = parsed.error.issues[0];
          nextErrors[`contact-${index}`] = issue?.message ?? "Invalid contact link";
        }
      });
    }

    if (step === 3) {
      if (!data.email.includes("@")) nextErrors.email = "Valid email is required";
      if (data.password.length < 8) nextErrors.password = "Password must have at least 8 characters";
      if (data.password !== data.confirmPassword) nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const geocode = async () => {
    if (!data.city.trim()) {
      setErrors((current) => ({ ...current, city: "City is required" }));
      return;
    }

    setIsGeocoding(true);
    try {
      const params = new URLSearchParams({ city: data.city.trim() });
      if (data.country.trim()) params.set("country", data.country.trim());

      const response = await fetch(`/api/geocode?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) {
        setErrors((current) => ({
          ...current,
          city: payload.error || "Could not geocode that location",
        }));
        return;
      }

      setData((current) => ({
        ...current,
        latitude: String(payload.latitude),
        longitude: String(payload.longitude),
        geocodeDisplayName: payload.displayName,
        country: payload.country || current.country,
      }));
      setErrors((current) => {
        const copy = { ...current };
        delete copy.city;
        delete copy.latitude;
        delete copy.longitude;
        return copy;
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.set("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrors((current) => ({ ...current, profileImageUrl: payload.error || "Upload failed" }));
        return;
      }

      setData((current) => ({ ...current, profileImageUrl: payload.url }));
      setErrors((current) => {
        const copy = { ...current };
        delete copy.profileImageUrl;
        return copy;
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const inferContactLabel = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return "Website";

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    if (normalized.startsWith("mailto:")) return "Email";
    if (isEmail) return "Email";
    if (normalized.includes("github.com")) return "GitHub";
    if (normalized.includes("gitlab.com")) return "GitLab";
    if (normalized.includes("linkedin.com")) return "LinkedIn";
    if (normalized.includes("instagram.com")) return "Instagram";
    if (normalized.includes("facebook.com") || normalized.includes("fb.com")) return "Facebook";
    if (
      normalized.includes("whatsapp.com") ||
      normalized.includes("wa.me") ||
      normalized.includes("api.whatsapp.com")
    ) {
      return "WhatsApp";
    }
    if (normalized.includes("discord.com") || normalized.includes("discord.gg")) return "Discord";
    if (normalized.includes("t.me") || normalized.includes("telegram.me")) return "Telegram";
    if (normalized.includes("tiktok.com")) return "TikTok";
    if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) return "YouTube";
    if (normalized.includes("x.com") || normalized.includes("twitter.com")) return "X";

    return "Website";
  };

  const addContactLink = () => {
    if (data.contactLinks.length >= 10) return;

    setData((current) => ({
      ...current,
      contactLinks: [...current.contactLinks, { label: "Website", url: "" }],
    }));
  };

  const submit = async () => {
    const payload = {
      name: data.name,
      city: data.city,
      country: data.country || undefined,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      pythonVersion: data.pythonVersion,
      pythonTechnologies: data.pythonTechnologies,
      profileImageUrl: data.profileImageUrl || undefined,
      contactLinks: data.contactLinks
        .filter((link) => link.url.trim().length > 0)
        .map((link) => ({
          label: inferContactLabel(link.url),
          url: link.url.trim(),
        })),
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const parsed = registrationSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors((current) => ({ ...current, form: result.error || "Registration failed" }));
        return;
      }

      router.push("/map");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#3776ab]/45 bg-slate-900/90 p-4 shadow-2xl shadow-[#3776ab]/15 sm:p-8">
      <div className="mb-6">
        <div className="overflow-x-auto pb-1">
          <ol className="flex min-w-[620px] items-center">
          {stepTitles.map((title, index) => {
            const stepIndex = index + 1;
            const isCompleted = step > stepIndex;
            const isCurrent = step === stepIndex;

            return (
              <li
                key={title}
                className="flex flex-1 items-center"
              >
                <div
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition ${
                    isCompleted
                      ? "border-[#f7df5f]/60 bg-[#f7df5f]/15 text-[#f7df5f]"
                      : isCurrent
                        ? "border-[#3776ab]/70 bg-[#3776ab]/20 text-[#9dc8f0]"
                        : "border-slate-600 bg-slate-800/70 text-slate-400"
                  }`}
                >
                  {String(stepIndex).padStart(2, "0")}
                </div>
                <p
                  className={`ml-3 text-sm font-semibold transition ${
                    isCompleted
                      ? "text-[#f7df5f]"
                      : isCurrent
                        ? "text-white"
                        : "text-slate-400"
                  }`}
                >
                  {title}
                </p>
                {index < stepTitles.length - 1 && (
                  <span
                    className={`mx-3 h-px flex-1 ${isCompleted ? "bg-[#f7df5f]/45" : "bg-slate-700"}`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
          </ol>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Create your Pytonista profile</h1>
      </div>

      {step === 1 && (
        <section className="space-y-4">
          <Field
            label="Full name"
            description="Use your full name, first name, or an alias you are comfortable sharing publicly."
            error={errors.name}
          >
            <input
              value={data.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="City"
              description="Type your city to help locate your profile on the map."
              error={errors.city}
            >
              <input
                value={data.city}
                onChange={(event) => updateField("city", event.target.value)}
                onBlur={() => {
                  if (!data.latitude && !isGeocoding) {
                    void geocode();
                  }
                }}
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </Field>
            <Field
              label="Country (optional)"
              description="Add your country for better search and location context."
            >
              <input
                value={data.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </Field>
          </div>
          <button
            type="button"
            onClick={geocode}
            className="rounded-lg border border-[#3776ab]/60 bg-[#3776ab]/15 px-4 py-2 text-sm font-medium text-[#9dc8f0] transition hover:bg-[#3776ab]/25"
          >
            {isGeocoding ? "Detecting location..." : "Detect location"}
          </button>

          {data.geocodeDisplayName && (
            <div className="rounded-lg border border-emerald-200/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              Location detected: {data.geocodeDisplayName}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Latitude"
              description="These coordinates are map coordinates, not your exact address."
              error={errors.latitude}
            >
              <input
                value={data.latitude}
                onChange={(event) => updateField("latitude", event.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </Field>
            <Field
              label="Longitude"
              description="These coordinates are map coordinates, not your exact address."
              error={errors.longitude}
            >
              <input
                value={data.longitude}
                onChange={(event) => updateField("longitude", event.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </Field>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <Field
            label="Profile picture"
            description="Choose a clear avatar so people can recognize you in the community."
            error={errors.profileImageUrl}
          >
            <div className="flex items-center gap-4">
              <input
                id="profile-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const nextPreviewUrl = URL.createObjectURL(file);
                  setProfilePreviewUrl(nextPreviewUrl);
                  void uploadProfileImage(file);
                }}
                className="sr-only"
              />

              <label
                htmlFor="profile-image"
                className="group relative block h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-slate-600 bg-slate-950 transition hover:border-emerald-400"
              >
                <Image
                  src={data.profileImageUrl || profilePreviewUrl || "/globe.svg"}
                  alt="Profile preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[11px] font-medium text-slate-100 opacity-0 transition group-hover:opacity-100">
                  Change
                </span>
              </label>

              <div>
                <p className="text-sm text-slate-200">Choose an avatar</p>
                <p className="text-xs text-slate-400">PNG, JPG or WEBP up to 2MB</p>
                {isUploadingImage && <p className="mt-1 text-xs text-emerald-300">Uploading image...</p>}
              </div>
            </div>
          </Field>

          <Field
            label="Python version you started with"
            description="Pick the version you first used when you started coding in Python."
            error={errors.pythonVersion}
          >
            <select
              value={data.pythonVersion}
              onChange={(event) => updateField("pythonVersion", event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            >
              <option value="">Select version</option>
              {PYTHON_VERSIONS.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <p className="mb-2 text-sm font-semibold text-white flex justify-between items-center">Python technologies <span className=" text-xs text-slate-400">
              Select one or more technologies you actively use.
            </span></p>
            
            <div className="flex flex-wrap gap-2">
              {PYTHON_TECHNOLOGIES.map((technology) => {
                const isSelected = data.pythonTechnologies.includes(technology);
                return (
                  <button
                    key={technology}
                    type="button"
                    onClick={() => {
                      setData((current) => {
                        const alreadySelected = current.pythonTechnologies.includes(technology);
                        const pythonTechnologies = alreadySelected
                          ? current.pythonTechnologies.filter((item) => item !== technology)
                          : [...current.pythonTechnologies, technology];
                        return { ...current, pythonTechnologies };
                      });
                      setErrors((current) => {
                        const copy = { ...current };
                        delete copy.pythonTechnologies;
                        return copy;
                      });
                    }}
                    className={`hover:cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-100"
                        : "border-slate-600 bg-slate-950 text-slate-200 hover:border-slate-500"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${PYTHON_TECHNOLOGY_LOGOS[technology]})` }}
                      />
                    </span>
                    {technology}
                  </button>
                );
              })}
            </div>
            {errors.pythonTechnologies && (
              <p className="mt-1 text-xs text-rose-300">{errors.pythonTechnologies}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Connect via</h2>
              <p className="text-xs text-slate-400">Choose up to 10: Email, Website, Social Media.</p>
            </div>
            <div className="space-y-3">
              {data.contactLinks.map((link, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      value={link.url}
                      onChange={(event) => {
                        const next = [...data.contactLinks];
                        next[index].url = event.target.value;
                        next[index].label = inferContactLabel(event.target.value);
                        setData((current) => ({ ...current, contactLinks: next }));
                        setErrors((current) => {
                          const copy = { ...current };
                          delete copy[`contact-${index}`];
                          return copy;
                        });
                      }}
                      placeholder="https://"
                      className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                    />
                    <button
                      type="button"
                      aria-label="Move link"
                      title="Move link"
                      onClick={() => {
                        setData((current) => {
                          if (current.contactLinks.length < 2) return current;
                          const next = [...current.contactLinks];
                          const swapIndex = index === 0 ? 1 : index - 1;
                          [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
                          return { ...current, contactLinks: next };
                        });
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-600 text-slate-300 hover:border-slate-500"
                    >
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                        <path d="M7 4L4 7L7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 7H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M13 10L16 13L13 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 13H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Remove link"
                      title="Remove link"
                      onClick={() => {
                        setData((current) => {
                          if (current.contactLinks.length === 1) {
                            return {
                              ...current,
                              contactLinks: [{ label: "Website", url: "" }],
                            };
                          }

                          return {
                            ...current,
                            contactLinks: current.contactLinks.filter((_, i) => i !== index),
                          };
                        });
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-400/50 text-rose-300 hover:border-rose-300"
                    >
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                        <path d="M4 6H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M8 3H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M7 6V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M10 6V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M13 6V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M6 17H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {errors[`contact-${index}`] && (
                    <p className="mt-1 text-xs text-rose-300">{errors[`contact-${index}`]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={addContactLink}
                  disabled={data.contactLinks.length >= 10}
                  className="rounded-lg border border-slate-500 bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              {data.contactLinks.length >= 10 && (
                <p className="text-center text-xs text-slate-400">Maximum of 10 links reached.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <Field
            label="Email"
            description="This email is used to sign in to your account."
            error={errors.email}
          >
            <input
              type="email"
              value={data.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </Field>
          <Field
            label="Password"
            description="Use at least 8 characters with a mix of letters and numbers."
            error={errors.password}
          >
            <input
              type="password"
              value={data.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </Field>
          <Field
            label="Confirm password"
            description="Repeat the same password to avoid typos."
            error={errors.confirmPassword}
          >
            <input
              type="password"
              value={data.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </Field>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-4 text-sm text-slate-200">
          <h2 className="text-lg font-semibold text-white">Review your data</h2>
          <ReviewLine label="Name" value={data.name} />
          <ReviewLine label="Location" value={`${data.city}${data.country ? `, ${data.country}` : ""}`} />
          <ReviewLine label="Coordinates" value={`${data.latitude}, ${data.longitude}`} />
          <ReviewLine label="Python version" value={data.pythonVersion} />
          <ReviewLine label="Python technologies" value={data.pythonTechnologies.join(", ")} />
          <ReviewLine label="Email" value={data.email} />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Contacts</p>
            <div className="mt-1 space-y-1">
              {data.contactLinks.length === 0 ? (
                <p className="text-slate-400">No links added</p>
              ) : (
                data.contactLinks.map((link, index) => (
                  <p key={index}>
                    {link.label}: {link.url}
                  </p>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {errors.form && <p className="mt-4 text-sm text-rose-300">{errors.form}</p>}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          className="rounded-lg border border-[#3776ab]/50 px-4 py-2 text-sm text-[#9dc8f0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        {step < stepTitles.length ? (
          <button
            type="button"
            onClick={() => {
              if (validateCurrentStep()) setStep((current) => Math.min(stepTitles.length, current + 1));
            }}
            className="rounded-lg bg-[#f7df5f] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#ffe97d]"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="rounded-lg bg-[#f7df5f] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Confirm and create account"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  description,
  children,
  error,
  compact,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  error?: string;
  compact?: boolean;
}) {
  return (
    <label className="block">
      <p className={`${compact ? "mb-1 text-xs" : "mb-1 text-sm"} font-semibold text-white`}>{label}</p>
      {children}
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </label>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}
