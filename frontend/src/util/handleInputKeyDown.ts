export default function handleInputKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: () => void,
) {
  if (e.key === 'Enter') {
    if (e.metaKey || e.ctrlKey) {
      // Enter => new line
      e.preventDefault();
      handleSubmit();
    } else {
      // CMD + Enter (Mac) or CTRL + Enter (Windows) => submit
      e.preventDefault();
      setText(text + '\n');
    }
  }
}
