import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import editSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { toast } from 'react-toastify';
import { DBUser } from '@/interface/dbSchema';

interface EditUserPFPProps {
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>;
  token: string;
}

export default function EditUserPFP({ setSettings, token }: EditUserPFPProps) {
  return (
    <UserSettingsOption
      name="Profile Picture"
      onClick={() =>
        Swal.fire({
          title: 'Profile Picture',
          confirmButtonText: 'Save',
          html: `
             <input id="swal-input1" class="swal2-input" placeholder="Password*" type="password" autocomplete="new-password" required>
             <div style="width:100%; display:flex align-items:center; justify-content:center">
              <input id="swal-input2" class="swal2-input" placeholder="Profile Picture URL">

              <div style="font-size:12px; margin-top:8px; text-align: center;">
                (Leave empty to remove)
              </div>
             </div
            `,
          preConfirm: async () => {
            const password = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const newPFPUrl = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;

            // Validation logic
            if (!password) {
              Swal.showValidationMessage('Password is required');
              return false;
            }

            const toastId = toast.loading('Changing Profile Picture...');
            try {
              await editSettings(token, {
                password,
                profile_picture_url: newPFPUrl ? newPFPUrl : null,
              });
              toast.update(toastId, {
                type: 'success',
                render: 'Successfully updated Profile Picture',
                isLoading: false,
                autoClose: 5000,
              });

              setSettings((prev) => {
                if (!prev) return prev;
                return { ...prev, profile_picture_url: newPFPUrl ? newPFPUrl : null };
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
                render: 'Failed to update Profile Picture',
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
