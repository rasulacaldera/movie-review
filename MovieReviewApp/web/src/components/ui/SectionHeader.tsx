import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  /** Section title text. */
  title: string;
  /** Optional link for "See All". */
  href?: string;
}

/** Displays a section heading with an optional "See All" link. */
export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {href !== undefined && (
        <Link
          to={href}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          See All
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
