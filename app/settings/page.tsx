import type { Metadata } from "next";
import { Globe, Database, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/Section";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { PrivacyControls } from "@/components/privacy/PrivacyControls";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Input";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="Language, profile & connections"
        description="Prototype preferences stored locally. Supabase + AI provider keys plug in via environment variables."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Globe className="h-5 w-5 text-lavender-500" />
          <CardTitle className="mt-2">Language</CardTitle>
          <div className="mt-3">
            <Label htmlFor="lang-pref">Preferred language</Label>
            <select
              id="lang-pref"
              className="h-11 w-full rounded-2xl border border-navy-100 bg-white px-3 text-sm shadow-soft outline-none"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="hinglish">Hinglish</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </Card>
        <Card>
          <Database className="h-5 w-5 text-teal-soft-600" />
          <CardTitle className="mt-2">Database</CardTitle>
          <CardDescription>
            Currently running on built-in mock data — no setup needed.
          </CardDescription>
          <div className="mt-3">
            <Badge tone="teal">Mock connected</Badge>
          </div>
          <CardDescription className="mt-2">
            Add SUPABASE_URL + SUPABASE_ANON_KEY to go live.
          </CardDescription>
        </Card>
        <Card>
          <Sparkles className="h-5 w-5 text-blush-500" />
          <CardTitle className="mt-2">AI provider</CardTitle>
          <CardDescription>
            Mock assistant by default. Set AI_PROVIDER + key to upgrade.
          </CardDescription>
          <div className="mt-3">
            <Badge tone="blush">Mock AI · Safe mode</Badge>
          </div>
        </Card>
      </div>
      <PrivacyControls />
      <SafetyBanner />
    </div>
  );
}
