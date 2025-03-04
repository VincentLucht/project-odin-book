import { useState, useEffect } from 'react';

import Input from '@/components/Input';
import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';

import checkNameAvailability from '@/Main/Community/api/isNameAvailable';

import catchError from '@/util/catchError';

import { IsValid } from '@/Main/Community/components/CreateCommunity/CreateCommunity';

interface Level1Props {
  level: number;
  token: string;
  setIsValid: React.Dispatch<React.SetStateAction<IsValid>>;
  communityName: string;
  setCommunityName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

// TODO: Add a fitting main and text secondary color for ALL sidebars
export default function Level1({
  level,
  token,
  setIsValid,
  communityName,
  setCommunityName,
  description,
  setDescription,
}: Level1Props) {
  const [isNameAvailable, setIsNameAvailable] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [wasSelected, setWasSelected] = useState(false);

  useEffect(() => {
    if (communityName.length && description.length && isNameAvailable) {
      setIsValid((prev) => {
        return { ...prev, 1: true };
      });
    } else {
      setIsValid((prev) => {
        return { ...prev, 1: false };
      });
    }
  }, [communityName, description, isNameAvailable, setIsValid]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (communityName.length >= 3) {
        checkNameAvailability(communityName, token)
          .then((response) => {
            setIsNameAvailable(response.isNameAvailable);
          })
          .catch((error) => {
            const err = error as { message: string; isNameAvailable: boolean };
            if (err.message === 'Community Name already in use') {
              setIsNameAvailable(err.isNameAvailable);
            } else {
              catchError(error);
            }
          });
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [communityName, token]);

  if (level !== 1) {
    return;
  }

  return (
    <>
      <div className="flex flex-col">
        <h2 className="mb-4 text-2xl font-bold">Create Community</h2>

        <Input
          value={communityName}
          setterFunc={(value) => {
            setCommunityName(value);
            if (!wasSelected) setWasSelected(true);
          }}
          placeholder="Community Name*"
          maxLength={21}
          className={`${
            (!isNameAvailable && communityName.length >= 3) ||
            (wasSelected && !isFocused && communityName.length < 3)
              ? 'border-2 border-red-500 focus-red'
              : ''
              }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="flex items-center justify-between">
          <span
            className={`ml-[19px] text-sm text-red-500 ${
              (wasSelected && !isFocused && communityName.length < 3) ||
              (!isNameAvailable && communityName.length >= 3)
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {!isNameAvailable && communityName.length >= 3
              ? 'Community Name already in use'
              : 'Community Name must be at least 3 characters long'}
          </span>

          <MaxLengthIndicator
            className="mr-3"
            length={communityName.length}
            maxLength={21}
            onlySpan={true}
          />
        </div>

        <TextareaAutosize
          className="mt-6 rounded-2xl px-4 py-4 focus-blue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={8}
          placeholder="Description"
          maxLength={500}
        />
        <MaxLengthIndicator length={description.length} maxLength={500} />
      </div>

      <div className="max-h-[328px]">
        <h2 className="mb-4 text-2xl font-bold">Sidebar Preview</h2>

        <div className="community-sidebar">
          <h3 className="sidebar-heading">
            {communityName ? `r/${communityName}` : 'r/communityname'}
          </h3>

          {/* Add Member count: 1 members */}

          <div className="break-words text-sm">
            {description ? description : 'Your community description'}
          </div>
        </div>
      </div>
    </>
  );
}
