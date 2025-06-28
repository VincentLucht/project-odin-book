import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import ModalTextArea from '@/components/Modal/components/ModalTextArea';

import { banUser } from '@/Main/Pages/Homepage/api/userCommunityAPI';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface BanUserModalProps {
  show: boolean;
  onClose: () => void;
  memberUsername: string;
  token: string;
  communityId: string;
  onBan: () => void;
}

export default function BanUserModal({
  show,
  onClose,
  memberUsername,
  token,
  communityId,
  onBan,
}: BanUserModalProps) {
  const [ban_reason, setBanReason] = useState('');
  const [ban_duration, setBanDuration] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [banReasonRequired, setBanReasonRequired] = useState(false);

  const durationPresets = [
    { label: '1 Week', value: '1week' },
    { label: '1 Month', value: '1month' },
    { label: '1 Year', value: '1year' },
    { label: 'Permanent', value: 'permanent' },
  ];

  const handlePresetSelect = (presetValue: string) => {
    setSelectedPreset(presetValue);

    if (presetValue === 'permanent') {
      setBanDuration(null);
    } else {
      let endDate: dayjs.Dayjs;

      switch (presetValue) {
        case '1week':
          endDate = dayjs().add(1, 'week');
          break;
        case '1month':
          endDate = dayjs().add(1, 'month');
          break;
        case '1year':
          endDate = dayjs().add(1, 'year');
          break;
        default:
          endDate = dayjs();
      }

      setBanDuration(endDate.format('YYYY-MM-DD'));
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBanDuration(e.target.value);
    setSelectedPreset(null);
  };

  const handleBanUser = () => {
    if (!ban_reason) {
      const toastId = 'toast-ban-reason';
      if (!toast.isActive(toastId)) {
        toast('Ban reason is required!', { toastId });
      }
      setBanReasonRequired(true);
      return;
    }

    setSubmitting(true);

    void banUser(
      token,
      {
        community_id: communityId,
        username: memberUsername,
        ban_duration: selectedPreset === 'permanent' ? null : ban_duration,
        ban_reason,
      },
      () => {
        setSubmitting(false);
        toast.success(`Successfully banned u/${memberUsername}`);
        onBan();
        onClose();
      },
    );
  };

  useEffect(() => {
    if (banReasonRequired && ban_reason) {
      setBanReasonRequired(false);
    }
  }, [banReasonRequired, ban_reason]);

  useEffect(() => {
    if (show) {
      handlePresetSelect('1week');
    }
  }, [show]);

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader
        headerName={`Ban u/${memberUsername} in this community?`}
        description={
          <div>
            <div>
              Membership and Moderator roles will be removed and will not be restored
              when unbanned.
            </div>

            <div className="mt-2 font-semibold">Effects:</div>

            <div>
              <strong>Public/Restricted:</strong> Can view but not interact
            </div>

            <div>
              <strong>Private:</strong> No access to anything
            </div>
          </div>
        }
        onClose={onClose}
      />

      <ModalTextArea
        labelName="Ban Reason:"
        maxLength={500}
        value={ban_reason}
        setterFunc={setBanReason}
        placeholder="Violation of community guidelines"
        className={
          banReasonRequired
            ? 'outline outline-2 outline-red-500 focus:outline focus:outline-2 focus:outline-red-500'
            : ''
        }
      />

      {/* Ban Duration */}
      <div className="">
        <label className="font-medium">Ban Duration:</label>

        {/* Preset */}
        <div className="grid grid-cols-2 gap-2">
          {durationPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetSelect(preset.value)}
              className={`rounded border px-3 py-2 text-sm font-medium transition-colors ${
              selectedPreset === preset.value
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Date */}
        <div className="my-2">
          <label htmlFor="ban-duration" className="text-sm font-medium">
            Or set custom end date:
          </label>

          <input
            id="ban-duration"
            type="date"
            value={ban_duration ?? ''}
            onChange={handleCustomDateChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none
              focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Display current selection */}
        {selectedPreset === 'permanent' && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <div>⚠️</div>
            <div>Permanent ban selected</div>
          </div>
        )}

        {ban_duration && selectedPreset !== 'permanent' && (
          <div className="text-sm">
            Ban expires: {new Date(ban_duration).toLocaleDateString()}
          </div>
        )}
      </div>

      <ModalFooter
        onClose={onClose}
        onClick={handleBanUser}
        submitting={submitting}
        cancelButtonClassName="confirm-button"
        confirmButtonClassName="cancel-button"
        confirmButtonName="Ban User"
      />
    </Modal>
  );
}
