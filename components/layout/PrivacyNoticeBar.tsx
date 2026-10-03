"use client";

import { useState } from "react";
import { dismissNotice, isNoticeDismissed } from "@/lib/privacy/consent";
import { useMounted } from "@/lib/client/use-mounted";
import { DemoPrivacyNotice } from "@/components/privacy/PrivacyControls";

/** Dismissible demo-data banner (client state, persisted dismissal). */
export function PrivacyNoticeBar() {
  const mounted = useMounted();
  const [visible, setVisible] = useState(() =>
    typeof window === "undefined" ? true : !isNoticeDismissed()
  );
  // Render only after mount so SSR and first paint always agree.
  if (!mounted || !visible) return null;
  return (
    <DemoPrivacyNotice
      onDismiss={() => {
        dismissNotice();
        setVisible(false);
      }}
    />
  );
}
