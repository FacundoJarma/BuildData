import UnderConstructionPage from "@/components/ui/UnderConstructionPage";

export default function ConstructionPage({
  searchParams,
}: {
  searchParams: { section?: string; desc?: string };
}) {
  return (
    <UnderConstructionPage
      section={searchParams.section}
      desc={searchParams.desc}
    />
  );
}
