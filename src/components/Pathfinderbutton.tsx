export default function FileButton() {

  const handleClick = async () => {
    const filePath = await window.electronFs.openFile();
    if (!filePath) return;

    console.log("Selected file:", filePath);

    // Load existing settings
    const settings = await window.settings.load();

    // Update
    settings.lastFilePath = filePath;

    // Save back to disk
    await window.settings.save(settings);

    console.log("Path saved:", settings.lastFilePath);
  };

  return (
    <button onClick={handleClick}>
      Open File Explorer
    </button>
  );
}