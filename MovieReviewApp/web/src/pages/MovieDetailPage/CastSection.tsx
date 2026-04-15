/** Cast section displaying cast cards and director credit. */

import { User } from "lucide-react";
import { ErrorState } from "~/components/ui/ErrorState.js";
import { buildImageUrl, PROFILE_SIZES } from "~/domains/movies/image.js";
import type { CastMember } from "~/domains/movies/types.js";

export interface CastSectionProps {
  cast: CastMember[];
  director: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  baseUrl: string | undefined;
}

export function CastSection({
  cast,
  director,
  isLoading,
  isError,
  onRetry,
  baseUrl,
}: CastSectionProps) {
  if (isLoading) {
    return <CastSkeleton />;
  }

  if (isError) {
    return (
      <section data-testid="cast-section" className="px-4">
        <h2 className="mb-3 text-xl font-bold text-foreground">Cast</h2>
        <ErrorState
          message="Failed to load cast information."
          onRetry={onRetry}
        />
      </section>
    );
  }

  const hasCast = cast.length > 0;

  return (
    <section data-testid="cast-section" className="px-4">
      <h2 className="mb-3 text-xl font-bold text-foreground">Cast</h2>

      {director && (
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Directed by {director}
        </p>
      )}

      {hasCast ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {cast.map((member) => (
            <CastCard key={member.id} member={member} baseUrl={baseUrl} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No cast information available.
        </p>
      )}
    </section>
  );
}

function CastCard({
  member,
  baseUrl,
}: {
  member: CastMember;
  baseUrl: string | undefined;
}) {
  const photoUrl = baseUrl
    ? buildImageUrl({
        baseUrl,
        path: member.profilePath,
        size: PROFILE_SIZES.medium,
      })
    : null;

  return (
    <div className="w-32 flex-shrink-0 text-center" data-testid="cast-card">
      <div className="mx-auto h-32 w-32 overflow-hidden rounded-lg bg-muted">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Photo of ${member.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            data-testid="profile-placeholder"
          >
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">
        {member.name}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {member.character}
      </p>
    </div>
  );
}

export function CastSkeleton() {
  return (
    <div className="px-4" data-testid="cast-skeleton">
      <div className="mb-3 h-6 w-20 animate-pulse rounded bg-muted" />
      <div className="flex gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="w-32 flex-shrink-0">
            <div className="h-32 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
