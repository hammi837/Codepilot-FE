import { create } from "zustand";

interface WorkspaceStore {
  selectedFile: string | null;
  expandedFolders: Set<string>;
  fileSearchQuery: string;
  activePanel: "explorer" | "chunks" | "search";

  // Actions
  selectFile: (path: string | null) => void;
  toggleFolder: (path: string) => void;
  expandFolder: (path: string) => void;
  setFileSearchQuery: (query: string) => void;
  setActivePanel: (panel: "explorer" | "chunks" | "search") => void;
  reset: () => void;
}

const initialState = {
  selectedFile: null,
  expandedFolders: new Set<string>(),
  fileSearchQuery: "",
  activePanel: "explorer" as const,
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  ...initialState,

  selectFile: (path) => set({ selectedFile: path }),

  toggleFolder: (path) =>
    set((state) => {
      const next = new Set(state.expandedFolders);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return { expandedFolders: next };
    }),

  expandFolder: (path) =>
    set((state) => {
      const next = new Set(state.expandedFolders);
      next.add(path);
      return { expandedFolders: next };
    }),

  setFileSearchQuery: (query) => set({ fileSearchQuery: query }),

  setActivePanel: (panel) => set({ activePanel: panel }),

  reset: () =>
    set({
      ...initialState,
      expandedFolders: new Set<string>(),
    }),
}));
