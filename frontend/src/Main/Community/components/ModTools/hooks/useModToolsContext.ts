import { ModToolsContext } from '@/Main/Community/components/ModTools/ModTools';
import { useOutletContext } from 'react-router-dom';

export default function useModToolsContext() {
  return useOutletContext<ModToolsContext>();
}
