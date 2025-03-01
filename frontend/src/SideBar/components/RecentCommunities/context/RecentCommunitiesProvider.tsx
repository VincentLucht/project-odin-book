import { useState, useEffect, createContext } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import fetchRecentCommunities from '@/Sidebar/components/RecentCommunities/context/fetchRecentCommunities';
import catchError from '@/util/catchError';

export interface RecentCommunity {
  id: string;
  interacted_at: Date;
  community_id: string;
  user_id: string;
  community: { name: string; profile_picture_url: string | null };
}

interface RecentCommunityContextType {
  recentCommunities: RecentCommunity[];
  setRecentCommunities: React.Dispatch<React.SetStateAction<RecentCommunity[]>>;
  isLoadingRecentCommunities: boolean;
  setIsLoadingRecentCommunities: React.Dispatch<React.SetStateAction<boolean>>;
}
export const RecentCommunityContext = createContext<RecentCommunityContextType | null>(
  null,
);

interface RecentCommunitiesProviderProps {
  children: React.ReactNode;
}

export default function RecentCommunitiesProvider({
  children,
}: RecentCommunitiesProviderProps) {
  const [recentCommunities, setRecentCommunities] = useState<RecentCommunity[]>([]);
  const [isLoadingRecentCommunities, setIsLoadingRecentCommunities] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchRecentCommunities(token)
        .then((response) => {
          setRecentCommunities(response.recentCommunities);
          setIsLoadingRecentCommunities(false);
        })
        .catch((error) => {
          catchError(error);
        });
    } else {
      setIsLoadingRecentCommunities(false);
    }
  }, [token]);

  return (
    <RecentCommunityContext.Provider
      value={{
        recentCommunities,
        setRecentCommunities,
        isLoadingRecentCommunities,
        setIsLoadingRecentCommunities,
      }}
    >
      {children}
    </RecentCommunityContext.Provider>
  );
}
