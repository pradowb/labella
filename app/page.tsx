import { Grain } from "@/components/Grain";
import { Hud } from "@/components/Hud";
import { PilhaCompanheira } from "@/components/PilhaCompanheira";
import { PilhaScrollProvider } from "@/components/PilhaScrollContext";
import { Ato00Convite } from "@/components/acts/Ato00Convite";
import { Ato01Massa } from "@/components/acts/Ato01Massa";
import { Ato02Tempero } from "@/components/acts/Ato02Tempero";
import { Ato03Forno } from "@/components/acts/Ato03Forno";
import { Ato04Revelacao } from "@/components/acts/Ato04Revelacao";
import { Ato05Mesa } from "@/components/acts/Ato05Mesa";

export default function HomePage() {
  return (
    <PilhaScrollProvider>
      <main>
        <Grain />
        <Hud />
        <PilhaCompanheira />
        <Ato00Convite />
        <Ato01Massa />
        <Ato02Tempero />
        <Ato03Forno />
        <Ato04Revelacao />
        <Ato05Mesa />
      </main>
    </PilhaScrollProvider>
  );
}
