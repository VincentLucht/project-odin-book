import { useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import { PlusIcon } from 'lucide-react';

interface InviteModProps {
  communityId: string;
}

export default function InviteMod({ communityId }: InviteModProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button>In</button>

      <Modal />
    </>
  );
}
