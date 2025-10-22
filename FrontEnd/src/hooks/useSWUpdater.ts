import { useRegisterSW } from "virtual:pwa-register/react";
import { useState } from "react";

export function useSWUpdater() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const { updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    close,
  };
}
