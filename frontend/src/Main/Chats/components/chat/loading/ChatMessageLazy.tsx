import { useSkeletonRandomValues } from '@/Main/Post/components/Loading/hook/useSkeletonRandomValuesProps';

import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';

export default function ChatMessageLazy() {
  const { usernameLength, contentLines, lastLineRandom } = useSkeletonRandomValues();

  const isSystemMessage = Math.random() < 0.1;

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {isSystemMessage ? (
        <LazyCompartment
          className="mt-[6px] !h-[32px] !w-[32px] self-start !rounded-full"
          height={32}
          width={32}
        />
      ) : (
        <PFPLazy className="mt-[6px] !h-[32px] !w-[32px] self-start" />
      )}

      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1">
          {/* Username */}
          <LazyCompartment
            height={16}
            width={isSystemMessage ? 120 : usernameLength}
            className="font-bold"
          />

          <div className="flex items-center gap-1">
            {/* Bullet point */}
            <LazyCompartment height={8} width={8} />

            {/* Creation Date */}
            <LazyCompartment height={14} width={65} />
          </div>
        </div>

        <div className="mt-1">
          {Array.from({ length: contentLines }).map((_, i) => (
            <div
              key={i}
              className={`skeleton mb-1 h-5 ${i === 0 && 'rounded-t-md'} ${ i === contentLines - 1 &&
              'rounded-b-md' }`}
              style={i === contentLines - 1 ? { width: `${lastLineRandom}%` } : {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
