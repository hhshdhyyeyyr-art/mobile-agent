import type { WorkspaceRepository } from "@/core/db/database";
import type { ToolExecutionRecord } from "@/core/types/app-state";

export type WorkspaceToolFactoryParams = {
    onFileCreated?: (file: { displayName: string; id: string }) => void;
  onProgress?: (progress: {
    bytesWritten: number;
    totalBytes: number;
  }) => void;
  onRecord?: (record: ToolExecutionRecord) => void;
  repository: WorkspaceRepository;
};
