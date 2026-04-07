import './Pathfinderbutton.css';
export default function FileButton() {

  const handleClick = async () => {
    const filePath = await window.electronFs.openFile();
    if (!filePath) return;

    console.log("Selected file:", filePath);

    const settings = await window.settings.load();

    settings.lastFilePath = filePath;

    await window.settings.save(settings);

    console.log("Path saved:", settings.lastFilePath);
  };

  return (
    <button className="fileButton" onClick={handleClick}>
      Aseta polku
    </button>
  );
}