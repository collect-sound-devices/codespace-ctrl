export type CodespaceState =
  | "Unknown"
  | "Created"
  | "Queued"
  | "Provisioning"
  | "Available"
  | "Awaiting"
  | "Unavailable"
  | "Deleted"
  | "Moved"
  | "Shutdown"
  | "Archived"
  | "Starting"
  | "ShuttingDown"
  | "Failed"
  | string;

export type CodespaceSummary = {
  name: string;
  displayName: string;
  state: CodespaceState;
  webUrl?: string;
};

export type SearchCodespaceResponse =
  | {
      found: true;
      codespace: CodespaceSummary;
    }
  | {
      found: false;
    };

export type StartCodespaceResponse =
  | {
      started: true;
      codespace: CodespaceSummary;
    }
  | {
      started: false;
      found: false;
    };

export type StopCodespaceResponse =
  | {
      stopped: true;
      codespace: CodespaceSummary;
    }
  | {
      stopped: false;
      found: false;
    };
