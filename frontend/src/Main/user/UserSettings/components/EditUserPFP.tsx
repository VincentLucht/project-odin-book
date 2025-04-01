import ReactDOM from 'react-dom/client';
import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import PFP from '@/components/PFP';
import Swal from 'sweetalert2';

import swalDefaultProps from '@/util/swalDefaultProps';
import editSettings from '@/Main/user/UserSettings/api/editUserSettings';

import { toast } from 'react-toastify';
import { DBUser } from '@/interface/dbSchema';

interface EditUserPFPProps {
  logout: () => void;
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>;
  token: string;
}

export default function EditUserPFP({ logout, setSettings, token }: EditUserPFPProps) {
  return (
    <UserSettingsOption
      name="Profile Picture"
      onClick={() =>
        Swal.fire({
          title: 'Profile Picture',
          confirmButtonText: 'Save',
          html: `
            <h3 style="font-size:18px; font-weight:500;">Preview:</h3>

            <div id="pfp-container" style="display:flex; justify-content:center; align-items:center; margin-top:8px; margin-bottom:12px"></div>

            <div style="font-size:14px">Note: Changing your Profile Picture will log you out</div>

            <input id="swal-input1" class="swal2-input" placeholder="Password*" type="password" autocomplete="new-password" required>

            <div style="width:100%; display:flex align-items:center; justify-content:center">
              <input id="swal-input2" class="swal2-input" placeholder="Profile Picture URL">
              
              <div style="font-size:12px; margin-top:8px; text-align: center;">
                (Leave empty to remove)
              </div>
             </div
            `,
          didOpen: () => {
            const pfpInput = document.getElementById(
              'swal-input2',
            ) as HTMLTextAreaElement;
            const container = document.getElementById('pfp-container');

            if (container && pfpInput) {
              const renderIndicator = () => {
                const root = ReactDOM.createRoot(container);
                root.render(
                  <PFP
                    src={pfpInput.value ? pfpInput.value : '/user.svg'}
                    className="!h-20 !w-20"
                  />,
                );
              };

              renderIndicator();
              // Update on input
              pfpInput.addEventListener('input', renderIndicator);
            }
          },
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

              logout();

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
