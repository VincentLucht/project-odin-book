import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import editSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { toast } from 'react-toastify';

interface EditUserPasswordProps {
  token: string;
}

export default function EditUserPassword({ token }: EditUserPasswordProps) {
  return (
    <UserSettingsOption
      name="Password"
      onClick={() =>
        Swal.fire({
          title: 'Password',
          confirmButtonText: 'Save',
          html: `
                <input id="swal-input1" class="swal2-input" placeholder="Current password*" autocomplete="off" required>
                <input id="swal-input2" class="swal2-input" type="password" placeholder="New Password*" autocomplete="new-password" required>
                <input id="swal-input3" class="swal2-input" type="password" placeholder="Confirm New Password*" autocomplete="new-password" required>
              `,
          preConfirm: async () => {
            const currentPassword = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const newPassword = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;
            const confirmNewPassword = (
              document.getElementById('swal-input3') as HTMLInputElement
            ).value;

            // Validation logic
            if (!currentPassword) {
              Swal.showValidationMessage('Current password is required');
              return false;
            }

            if (!newPassword) {
              Swal.showValidationMessage('New password is required');
              return false;
            }

            if (!confirmNewPassword) {
              Swal.showValidationMessage('Please confirm your new password');
              return false;
            }

            if (newPassword !== confirmNewPassword) {
              Swal.showValidationMessage('New passwords do not match');
              return false;
            }

            const toastId = toast.loading('Changing password...');
            try {
              await editSettings(token, { password: newPassword });
              toast.update(toastId, {
                type: 'success',
                render: 'Successfully updated password',
                isLoading: false,
                autoClose: 5000,
              });
              return true;
            } catch (error) {
              const errorObj = error as { message: string };
              if (errorObj.message === 'Incorrect password') {
                Swal.showValidationMessage('Passwords do not match');
              } else {
                Swal.showValidationMessage('Network error, please try again later');
              }
              toast.update(toastId, {
                type: 'error',
                render: 'Failed to update password',
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
