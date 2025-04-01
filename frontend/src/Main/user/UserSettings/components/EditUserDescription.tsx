import ReactDOM from 'react-dom/client';
import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';
import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';
import editSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { toast } from 'react-toastify';
import { DBUser } from '@/interface/dbSchema';

interface EditUserDescriptionProps {
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>;
  token: string;
}

export default function EditUserDescription({
  setSettings,
  token,
}: EditUserDescriptionProps) {
  return (
    <UserSettingsOption
      name="Description"
      onClick={() =>
        Swal.fire({
          title: 'Description',
          confirmButtonText: 'Save',
          html: `
             <input id="swal-input1" class="swal2-input" placeholder="Password*" type="password" autocomplete="new-password" required>

             <div style="width:100%; display:flex align-items:center; justify-content:center">
              <textarea 
                style="width:100%; margin-left:0px; margin-right:0px" 
                id="swal-input2" 
                class="swal2-textarea" 
                placeholder="New Description" 
                autocomplete="off" maxlength="200"></textarea>

              <div style="display:flex; justify-content: space-between; width: 100%;">
                <div style="flex: 1;"></div>

                <div style="font-size:12px; margin-top:8px; text-align: center;">
                  (Leave empty to remove)
                </div>

                <div style="flex: 1; display: flex; justify-content: flex-end;">
                  <div id="maxlength-indicator-container"></div>
                </div>
              </div>
             </div
            `,
          didOpen: () => {
            const descriptionInput = document.getElementById(
              'swal-input2',
            ) as HTMLTextAreaElement;
            const container = document.getElementById('maxlength-indicator-container');

            if (container && descriptionInput) {
              const renderIndicator = () => {
                const root = ReactDOM.createRoot(container);
                root.render(
                  <MaxLengthIndicator
                    length={descriptionInput.value.length}
                    maxLength={200}
                  />,
                );
              };

              renderIndicator();
              // Update on input
              descriptionInput.addEventListener('input', renderIndicator);
            }
          },
          preConfirm: async () => {
            const password = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const newDescription = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;

            // Validation logic
            if (!password) {
              Swal.showValidationMessage('Password is required');
              return false;
            }

            const toastId = toast.loading('Changing Description...');
            try {
              await editSettings(token, { password, description: newDescription });
              toast.update(toastId, {
                type: 'success',
                render: 'Successfully updated Description',
                isLoading: false,
                autoClose: 5000,
              });

              setSettings((prev) => {
                if (!prev) return prev;
                return { ...prev, description: newDescription };
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
                render: 'Failed to update Description',
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
