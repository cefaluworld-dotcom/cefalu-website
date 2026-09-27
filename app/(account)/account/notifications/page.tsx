import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { NotificationPrefs } from "@/components/account/notification-prefs";

export const metadata: Metadata = constructMetadata({
  title: "Notifications", pathname: "/account/notifications", noIndex: true,
});

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Notifications</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose what we send you. Preferences save on this device instantly.
      </p>
      <div className="mt-6 max-w-lg"><NotificationPrefs /></div>
    </div>
  );
}
