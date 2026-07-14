import type { FileMetadata, FileNode } from "../types/workspace";

/**
 * Converts a flat list of FileMetadata into a nested FileNode tree.
 */
export function buildFileTree(files: FileMetadata[]): FileNode[] {
  const root: FileNode[] = [];
  const folderMap = new Map<string, FileNode>();

  // Sort so folders come before files, then alphabetically
  const sorted = [...files].sort((a, b) => {
    const aParts = a.path.split("/").length;
    const bParts = b.path.split("/").length;
    if (aParts !== bParts) return aParts - bParts;
    return a.path.localeCompare(b.path);
  });

  for (const file of sorted) {
    const parts = file.path.split("/");
    let currentLevel = root;
    let currentPath = "";

    // Walk all path segments except the last (the file itself)
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];

      if (!folderMap.has(currentPath)) {
        const folder: FileNode = {
          name: parts[i],
          path: currentPath,
          type: "folder",
          children: [],
        };
        folderMap.set(currentPath, folder);
        currentLevel.push(folder);
      }

      currentLevel = folderMap.get(currentPath)!.children!;
    }

    // Add the file node
    currentLevel.push({
      name: parts[parts.length - 1],
      path: file.path,
      type: "file",
      extension: file.extension,
      language: file.language,
      size: file.size,
    });
  }

  return root;
}

/**
 * Filters files by name/path matching a search query.
 */
export function filterFiles(files: FileMetadata[], query: string): FileMetadata[] {
  if (!query.trim()) return files;
  const q = query.toLowerCase();
  return files.filter((f) => f.path.toLowerCase().includes(q));
}

/**
 * Maps a language string to a Monaco editor language identifier.
 */
export function toMonacoLanguage(language: string): string {
  const map: Record<string, string> = {
    Python: "python",
    JavaScript: "javascript",
    TypeScript: "typescript",
    "TypeScript React": "typescript",
    "JavaScript React": "javascript",
    HTML: "html",
    CSS: "css",
    Markdown: "markdown",
    JSON: "json",
    Go: "go",
    Java: "java",
    "C++": "cpp",
    C: "c",
    Rust: "rust",
    Shell: "shell",
    YAML: "yaml",
    Text: "plaintext",
  };
  return map[language] ?? "plaintext";
}

/**
 * Formats bytes into human-readable size string.
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Returns the breadcrumb segments from a file path.
 * e.g. "app/services/auth.py" → ["app", "services", "auth.py"]
 */
export function getBreadcrumbs(path: string): string[] {
  return path.split("/");
}
