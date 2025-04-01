import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import { toast } from 'react-toastify';
import deleteAccount from '@/Main/user/UserSettings/api/deleteAccount';

interface DeleteUserAccountProps {
  logout: () => void;
  token: string;
}

export default function DeleteUserAccount({ logout, token }: DeleteUserAccountProps) {
  return (
    <UserSettingsOption
      name="Delete Account"
      onClick={() =>
        Swal.fire({
          title: 'Delete Account',
          confirmButtonText: 'Delete',
          html: `
              <div style="margin-bottom:12px">We'll miss you :(</div>
              <div style="display:flex; justify-content:center; align-items-center">
                <div style="max-width:250px; font-size: 14px; line-height: 20px; text-align: justify;">Deleting your account is permanent and irreversible. Your username and profile will be deleted, but your posts, comments, and messages are disassociated (not deleted) from your account unless you delete them beforehand.</div>
              </div>
              <input id="swal-input1" class="swal2-input" placeholder="Username*" autocomplete="off" required>
              <input id="swal-input2" class="swal2-input" type="email" placeholder="Password*" autocomplete="off" required>
              <div class="swal2-checkbox-container" style="margin-top:15px; display:flex; align-items:center; justify-content:center">
                <input type="checkbox" id="delete-confirmation" class="swal2-checkbox">
                <label for="delete-confirmation" style="margin-left: 8px; text-align: left; font-size: 14px;">
                  I understand that deleted accounts aren't recoverable
                </label>
               </div>
            `,
          preConfirm: async () => {
            const username = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const password = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;
            const isConfirmed = (
              document.getElementById('delete-confirmation') as HTMLInputElement
            ).checked;

            // Validation logic
            if (!password) {
              Swal.showValidationMessage('Password is required');
              return false;
            }
            if (!username) {
              Swal.showValidationMessage('New Email is required');
              return false;
            }
            if (!isConfirmed) {
              Swal.showValidationMessage(
                'You must confirm that you understand account deletion is permanent',
              );
              return false;
            }

            const toastId = toast.loading('Changing password...');
            try {
              await deleteAccount(token);

              toast.update(toastId, {
                type: 'success',
                render: 'Successfully deleted Account',
                isLoading: false,
                autoClose: 5000,
              });

              logout();

              return true;
            } catch (error) {
              const errorObj = error as { message: string };
              if (
                errorObj.message === 'Incorrect password' ||
                errorObj.message === 'Please do not delete the demo users :('
              ) {
                Swal.showValidationMessage(errorObj.message);
                if (errorObj.message === 'Please do not delete the demo users :(') {
                  toast.warn(errorObj.message);
                }
              } else {
                Swal.showValidationMessage('Network error, please try again later');
              }
              toast.update(toastId, {
                type: 'error',
                render: 'Failed to delete Account',
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
