// TODO: DELETE AND REPLACE WITH confirmAction.ts
export default function confirmDelete(itemType: string) {
  const willDelete = confirm(
    `Delete ${itemType}?\n\nAre you sure you want to delete your ${itemType}? You can't undo this.`,
  );

  return willDelete;
}
