import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { toast } from 'react-toastify';
import { DBUser } from '@/interface/dbSchema';

interface EditUserEmailProps {
  email: string;
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>;
  token: string;
  loading: boolean;
}

export default function EditUserEmail({
  email,
  setSettings,
  token,
  loading,
}: EditUserEmailProps) {
  return (
    <UserSettingsOption
      name="Email"
      additionalName={email}
      loading={loading}
      skeletonRange={{ min: 90, max: 200 }}
      onClick={() =>
        Swal.fire({
          title: 'Email',
          confirmButtonText: 'Save',
          html: `
              <input id="swal-input1" class="swal2-input" placeholder="Password*" autocomplete="off" required>
              <input id="swal-input2" class="swal2-input" type="email" placeholder="New Email*" autocomplete="off" required>
            `,
          preConfirm: async () => {
            const password = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const newEmail = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;

            // Validation logic
            if (!password) {
              Swal.showValidationMessage('Password is required');
              return false;
            }

            if (!newEmail) {
              Swal.showValidationMessage('New Email is required');
              return false;
            }

            const toastId = toast.loading('Changing password...');
            try {
              await editUserSettings(token, { password, email: newEmail });
              toast.update(toastId, {
                type: 'success',
                render: 'Successfully updated Email',
                isLoading: false,
                autoClose: 5000,
              });

              setSettings((prev) => {
                if (!prev) return prev;
                return { ...prev, email: newEmail };
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
