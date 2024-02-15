export const InternalLinksArr: readonly InternalLink[] = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/create",
    label: "Create Game",
  },
  {
    to: "/games",
    label: "Join Game",
  },
] as const;

interface InternalLink {
  to: string;
  label: string;
}
