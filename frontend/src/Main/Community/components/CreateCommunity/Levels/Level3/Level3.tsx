import { useState, useEffect, useRef, useMemo } from 'react';

import InputWithImg from '@/components/InputWithImg';

import getAllTopics from '@/Main/Community/components/CreateCommunity/Levels/Level3/api/getAllTopics';
import catchError from '@/util/catchError';

import { IsValid } from '@/Main/Community/components/CreateCommunity/CreateCommunity';
import { DBMainTopic, DBTopic } from '@/interface/dbSchema';

interface Level3Props {
  level: number;
  setIsValid: React.Dispatch<React.SetStateAction<IsValid>>;
  activeTopics: DBTopic[];
  setActiveTopics: React.Dispatch<React.SetStateAction<DBTopic[]>>;
}

// Extended interface to handle filtered subtopics
interface FilteredMainTopic extends DBMainTopic {
  filteredSubtopics?: DBTopic[];
}

export default function Level3({
  level,
  setIsValid,
  activeTopics,
  setActiveTopics,
}: Level3Props) {
  const [topics, setTopics] = useState<FilteredMainTopic[]>([]);

  const [query, setQuery] = useState('');
  const hasFetched = useRef(false);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return topics;
    }

    const lowerQuery = query.toLowerCase();

    return topics
      .map((topic) => {
        // Check if main topic matches
        const mainTopicMatches = topic.name.toLowerCase().includes(lowerQuery);

        // Check for matching subtopics
        const matchingSubtopics = topic.topics.filter((subTopic) =>
          subTopic.name.toLowerCase().includes(lowerQuery),
        );

        // If main topic matches, return the complete topic with all subtopics
        if (mainTopicMatches) {
          return { ...topic };
        }

        // If subtopics match but main topic doesn't, return topic with only matching subtopics
        if (matchingSubtopics.length > 0) {
          return {
            ...topic,
            filteredSubtopics: matchingSubtopics,
          } as FilteredMainTopic;
        }

        return null;
      })
      .filter(Boolean) as FilteredMainTopic[];
  }, [topics, query]);

  useEffect(() => {
    if (!hasFetched.current) {
      getAllTopics()
        .then((response) => {
          setTopics(response.topics);
          hasFetched.current = true;
        })
        .catch((error) => {
          catchError(error);
        });
    }
  }, []);

  useEffect(() => {
    if (activeTopics.length > 0) {
      setIsValid((prev) => {
        return { ...prev, 3: true };
      });
    } else {
      setIsValid((prev) => {
        return { ...prev, 3: false };
      });
    }
  }, [activeTopics.length, setIsValid]);

  if (level !== 3) {
    return null;
  }

  const onClick = (subTopicId: string) => {
    if (activeTopics.some((topic) => topic.id === subTopicId)) {
      // Avoid duplicates
      setActiveTopics((prev) => prev.filter((topic) => topic.id !== subTopicId));

      // Update isActive status in topics
      setTopics((prev) => {
        return prev.map((mainTopic) => ({
          ...mainTopic,
          topics: mainTopic.topics.map((subTopic) => {
            if (subTopic.id === subTopicId) {
              return { ...subTopic, isActive: false };
            }
            return subTopic;
          }),
        }));
      });
    } else {
      if (activeTopics.length >= 3) return;

      // Find subtopic to add
      const subTopicToAdd = topics.flatMap((mainTopic) =>
        mainTopic.topics.filter((subTopic) => subTopic.id === subTopicId),
      )[0];

      if (subTopicToAdd) {
        setActiveTopics((prev) => [...prev, subTopicToAdd]);

        setTopics((prev) => {
          return prev.map((mainTopic) => ({
            ...mainTopic,
            topics: mainTopic.topics.map((subTopic) => {
              if (subTopic.id === subTopicId) {
                return { ...subTopic, isActive: true };
              }
              return subTopic;
            }),
          }));
        });
      }
    }
  };

  const buttonClass =
    'h-8 rounded-full text-xs !font-medium prm-button normal-bg-transition';

  return (
    <div className="flex h-full flex-col overflow-y-scroll">
      <h2 className="text-2xl font-bold">Add topics</h2>

      <div className="mb-4 mt-2 text-sm text-gray-secondary">
        Add up to 3 topics to define what your community is about.
      </div>

      <div className="mb-3 mt-2 px-[2px]">
        <InputWithImg
          value={query}
          setterFunc={setQuery}
          src="/magnify.svg"
          alt="Magnifying glass icon"
          placeholder="Filter topics"
        />
      </div>

      <h3 className="text-lg font-medium">Topics {activeTopics.length}/3</h3>

      <div className={`mb-7 ${activeTopics.length > 0 ? 'mt-1 flex gap-2' : ''}`}>
        {activeTopics?.map((topic) => (
          <button
            className={`flex items-center gap-1 !rounded-md border border-gray-500 !bg-black ${buttonClass} `}
            onClick={() => onClick(topic.id)}
            key={topic.id}
          >
            {topic.name}
            <div className="-mr-2 ml-1 h-4 w-4 rounded-full bg-white df">
              <img src="/x-close-gray.svg" alt="Close button" className="h-2 w-2" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-scroll">
        {filteredItems?.map((topic, index) => (
          <div className="font-medium" key={index}>
            <div className="mb-1">{topic.name}</div>

            <div className="mb-5 flex flex-wrap gap-2">
              {/* Use filteredSubtopics if available, otherwise use all topics */}
              {(topic.filteredSubtopics ?? topic.topics).map((subTopic, index) => (
                <button
                  className={`${buttonClass} ${subTopic.isActive ? 'flex items-center gap-1 !bg-active-gray' : ''}`}
                  onClick={() => onClick(subTopic.id)}
                  key={index}
                >
                  {subTopic.name}

                  {subTopic.isActive && (
                    <div className="-mr-2 ml-1 h-4 w-4 rounded-full bg-white df">
                      <img
                        src="/x-close-gray.svg"
                        alt="Close button"
                        className="h-2 w-2"
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
