"use client";

import { useEffect, useState } from "react";
import {
  getCloudSyncFailures,
  getCloudSyncStatus,
  getUnknownCloudSources,
  subscribeToCloudSyncStatus,
  type CloudSyncFailure,
  type CloudSyncSource,
  type CloudSyncStatus
} from "@/lib/syncStatus";

export type CloudSyncState = {
  status: CloudSyncStatus;
  failures: CloudSyncFailure[];
  /** Sources that are failing and have never loaded — their numbers are not real. */
  unknown: CloudSyncSource[];
  isUnknown: (source: CloudSyncSource) => boolean;
};

/**
 * One subscription to the cloud sync outcomes, for any surface that needs to
 * know whether the figures it is about to render are trustworthy.
 */
export function useCloudSync(): CloudSyncState {
  const [state, setState] = useState<Omit<CloudSyncState, "isUnknown">>({
    status: "synced",
    failures: [],
    unknown: []
  });

  useEffect(() => {
    function refresh() {
      setState({
        status: getCloudSyncStatus(),
        failures: getCloudSyncFailures(),
        unknown: getUnknownCloudSources()
      });
    }
    refresh();
    return subscribeToCloudSyncStatus(refresh);
  }, []);

  return { ...state, isUnknown: (source) => state.unknown.includes(source) };
}
