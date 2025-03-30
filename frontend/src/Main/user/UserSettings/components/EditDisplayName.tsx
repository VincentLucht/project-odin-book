import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import editSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { toast } from 'react-toastify';
import { DBUser } from '@/interface/dbSchema';

interface EditDisplayNameProps {
  displayName: string | undefined;
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>;
  token: string;
}

export default function EditDisplayName({
  displayName,
  setSettings,
  token,
}: EditDisplayNameProps) {
  return (
    <UserSettingsOption
      name="Display Name"
      additionalName={displayName}
      onClick={() =>
        Swal.fire({
          title: 'Display Name',
          confirmButtonText: 'Save',
          html: `
              <input id="swal-input1" class="swal2-input" placeholder="Password*" autocomplete="off" required>
              <input id="swal-input2" class="swal2-input" type="text" placeholder="New Display Name" autocomplete="off">
              <div style="font-size:12px; margin-top:4px">(Leave empty to remove)</div>
            `,
          preConfirm: async () => {
            const password = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const newDisplayName = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;

            // Validation logic
            if (!password) {
              Swal.showValidationMessage('Password is required');
              return false;
            }

            const toastId = toast.loading('Changing password...');
            try {
              await editSettings(token, { password, display_name: newDisplayName });
              toast.update(toastId, {
                type: 'success',
                render: 'Successfully updated Email',
                isLoading: false,
                autoClose: 5000,
              });

              setSettings((prev) => {
                if (!prev) return prev;
                return { ...prev, display_name: newDisplayName };
              });

              return true;
            } catch (error) {
              const errorObj = error as { message: string };
              if (errorObj.message === 'Incorrect password') {
                Swal.showValidationMessage('Incorrect password');
              } else {
                Swal.showValidationMessage('Network error, please try again later');
              }
              toast.update(toastId, {
                type: 'error',
                render: 'Failed to update email',
                isLoading: false,
                autoClose: 5000,
              });
              return false;
            }
          },
          ...swalDefaultProps,
        })
      }
    />
  );
}
