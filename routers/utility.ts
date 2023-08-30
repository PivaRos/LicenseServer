export const MacToFileName = (mac: string) => {
  return mac.replaceAll(":", "_");
};

export const FileNameToMac = (filename: string) => {
  return filename.replaceAll("_", ":");
};
