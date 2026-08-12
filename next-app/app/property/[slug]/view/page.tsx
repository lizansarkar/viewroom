import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { SceneData } from "../../../../types/scene";
import { getSceneData } from "../../../../lib/scene-data";
import LayoutShell from "../../../../components/LayoutShell";

const TourView = dynamic(() => import("../../../../components/TourView"), {
  ssr: false,
});

export default function PropertyViewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { debug?: string };
}) {
  const scenes = getSceneData();
  const scene = scenes.find((item) => item.id === "entrance");
  const debug = searchParams?.debug === "1";

  if (!scene) return notFound();

  return (
    <LayoutShell>
      <TourView scenes={scenes} initialSceneId={scene.id} debug={debug} />
    </LayoutShell>
  );
}
