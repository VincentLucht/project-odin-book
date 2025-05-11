import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { toast } from 'react-toastify';
import { DBUser } from '@/interface/dbSchema';

interface EditUserDescriptionProps {
  cakeDay: string | undefined;
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>;
  token: string;
}

export default function EditUserCakeDay({
  cakeDay,
  setSettings,
  token,
}: EditUserDescriptionProps) {
  return (
    <UserSettingsOption
      name="Cake Day"
      additionalName={cakeDay}
      onClick={() =>
        Swal.fire({
          title: 'Cake Day',
          confirmButtonText: 'Save',
          html: `
             <input id="swal-input1" class="swal2-input" placeholder="Password*" type="password" autocomplete="new-password" required>

             <div style="width:100%; display:flex align-items:center; justify-content:center">
              <input id="swal-input2" class="swal2-input" type="date">

              <div style="font-size:12px; margin-top:8px; text-align: center;">
                (Leave empty to remove)
              </div>
             </div>
            `,
          preConfirm: async () => {
            const password = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const newCakeDay = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;

            // Validation logic
            if (!password) {
              Swal.showValidationMessage('Password is required');
              return false;
            }

            const toastId = toast.loading('Changing Cake Day...');
            try {
              await editUserSettings(token, { password, cake_day: newCakeDay });
              toast.update(toastId, {
                type: 'success',
                render: 'Successfully updated Cake Day',
                isLoading: false,
                autoClose: 5000,
              });

              setSettings((prev) => {
                if (!prev) return prev;
                return { ...prev, cake_day: newCakeDay };
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
                render: 'Failed to update Cake Day',
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
