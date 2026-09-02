"use client";

import {
  forwardRef,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  usePilhaScroll,
  type PilhaPose,
  type PointerNorm,
} from "@/components/PilhaScrollContext";

const SABORES = [
  "frango-catupiry",
  "calabresa",
  "4-queijos",
  "carne-seca",
] as const;

type Sabor = (typeof SABORES)[number];

const ALTURA_CAIXA = 0.045;
const FOLGA = 0.004;
const PASSO = ALTURA_CAIXA + FOLGA;
const PILHA_Y = 0.09;
const QUEDA = 0.2;
const TILT_Y = 0.18;
const TILT_X = 0.08;

export type { PointerNorm };

function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setMatches(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [query]);

  return matches;
}

function useTexturasDoSabor(sabor: Sabor) {
  const [topo, longa, curta] = useTexture([
    `/texturas/${sabor}_TOPO_2048.png`,
    `/texturas/${sabor}_LATERAL_LONGA_2048x288.png`,
    `/texturas/${sabor}_LATERAL_CURTA_2048x288.png`,
  ]);
  return useMemo(() => {
    for (const t of [topo, longa, curta]) {
      t.flipY = false;
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.anisotropy = 2;
      t.needsUpdate = true;
    }
    return { TOPO: topo, LATERAL_LONGA: longa, LATERAL_CURTA: curta };
  }, [topo, longa, curta]);
}

const CaixaComSabor = forwardRef<
  THREE.Object3D,
  { sabor: Sabor } & Omit<JSX.IntrinsicElements["primitive"], "object">
>(function CaixaComSabor({ sabor, ...props }, ref) {
  const { scene } = useGLTF("/models/caixa-pizza.glb", true);
  const mapas = useTexturasDoSabor(sabor);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const mapped = mats.map((m: THREE.Material) => {
        const novo = m.clone() as THREE.MeshStandardMaterial;
        const nome = m.name as keyof typeof mapas;
        novo.map = mapas[nome] ?? null;
        novo.color.set("#ffffff");
        novo.roughness = 0.38;
        novo.metalness = 0;
        novo.envMapIntensity = 0.04;
        novo.emissiveMap = null;
        novo.emissive.set("#000000");
        novo.emissiveIntensity = 0;
        novo.transparent = true;
        novo.opacity = 0;
        novo.needsUpdate = true;
        return novo;
      });
      o.material = mapped.length === 1 ? mapped[0] : mapped;
      o.castShadow = false;
      o.receiveShadow = false;
    });
    return c;
  }, [scene, mapas]);

  return <primitive ref={ref} object={clone} {...props} />;
});

useGLTF.preload("/models/caixa-pizza.glb", true);

function yCaixaACair(p: number) {
  const tGlobal = THREE.MathUtils.clamp(p, 0, 1);
  const slot = THREE.MathUtils.clamp(Math.floor(tGlobal / 0.25), 0, 3);
  const t = THREE.MathUtils.clamp((tGlobal - slot * 0.25) / 0.25, 0, 1);
  const suave = t * t * (3 - 2 * t);
  const yFinal = slot * PASSO;
  return THREE.MathUtils.lerp(yFinal + QUEDA, yFinal, suave);
}

function poseCaixa(obj: THREE.Object3D, i: number, p: number, k: number) {
  const inicio = i * 0.25;
  const t = THREE.MathUtils.clamp((p - inicio) / 0.25, 0, 1);
  const suave = t * t * (3 - 2 * t);
  const fade = THREE.MathUtils.clamp(t / 0.14, 0, 1);
  const yFinal = i * PASSO;
  const yInicial = yFinal + QUEDA;
  const alvoY = THREE.MathUtils.lerp(yInicial, yFinal, suave);
  const alvoRot = THREE.MathUtils.lerp(0.45, 0, suave);

  obj.visible = fade > 0.02;
  obj.position.y += (alvoY - obj.position.y) * k;
  obj.rotation.y += (alvoRot - obj.rotation.y) * k;
  obj.rotation.z += (alvoRot * 0.25 - obj.rotation.z) * k;

  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    const mats = Array.isArray(c.material) ? c.material : [c.material];
    mats.forEach((m: THREE.Material) => {
      if (!("opacity" in m)) return;
      const mat = m as THREE.MeshStandardMaterial;
      if (fade >= 0.999) {
        mat.transparent = false;
        mat.opacity = 1;
      } else {
        mat.transparent = true;
        mat.opacity = fade;
      }
    });
  });
}

function KeyLight({ ember }: { ember: RefObject<PilhaPose> }) {
  const rim = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(ember.current.ember, 0, 1);
    if (rim.current) rim.current.intensity = t * 0.55;
  });

  return (
    <>
      <directionalLight
        position={[1.8, 2.8, 1.6]}
        intensity={2}
        color="#ffffff"
      />
      <directionalLight
        position={[-2.2, 1.1, 0.4]}
        intensity={0.35}
        color="#c02d22"
      />
      <directionalLight
        ref={rim}
        position={[0.1, -0.4, -1.8]}
        intensity={0}
        color="#f2161a"
      />
    </>
  );
}

function KickFrame({ progress }: { progress: RefObject<number> }) {
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    let id = 0;
    const tick = () => {
      invalidate();
      id = requestAnimationFrame(tick);
    };
    tick();
    const stop = window.setTimeout(() => cancelAnimationFrame(id), 2500);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(stop);
    };
  }, [invalidate, progress]);

  return null;
}

function CameraTrack({
  mobile,
  progress,
  reduceMotion,
}: {
  mobile: boolean;
  progress: RefObject<number>;
  reduceMotion: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const look = useRef(new THREE.Vector3(0, PILHA_Y + 0.02, 0));

  useLayoutEffect(() => {
    camera.position.set(
      ...(mobile ? ([0.32, 0.26, 0.58] as const) : ([0.52, 0.34, 0.95] as const)),
    );
    camera.lookAt(0, PILHA_Y + 0.06, 0);
    camera.updateProjectionMatrix();
  }, [camera, mobile]);

  useFrame((_, delta) => {
    const p = reduceMotion ? 1 : progress.current;
    if (p >= 0.999) return;
    const cair = yCaixaACair(p);
    const mid = PILHA_Y + cair * 0.55 + 0.03;
    const baseY = mobile ? 0.26 : 0.34;
    const alvoY = baseY + cair * 0.22;
    const k = 1 - Math.pow(0.002, delta);
    camera.position.y += (alvoY - camera.position.y) * k;
    look.current.y += (mid - look.current.y) * k;
    camera.lookAt(look.current);
  });

  return null;
}

function PilhaScene({
  progress,
  pointer,
  reduceMotion,
}: {
  progress: RefObject<number>;
  pointer: RefObject<PointerNorm>;
  reduceMotion: boolean;
}) {
  const refs = useRef<(THREE.Object3D | null)[]>([null, null, null, null]);
  const grupo = useRef<THREE.Group>(null);

  const invalidate = useThree((s) => s.invalidate);

  useFrame((_, delta) => {
    const p = reduceMotion ? 1 : progress.current;
    const k = reduceMotion ? 1 : 1 - Math.pow(0.001, delta);
    SABORES.forEach((_, i) => {
      const obj = refs.current[i];
      if (!obj) return;
      poseCaixa(obj, i, p, k);
    });

    if (!grupo.current) return;
    const tiltK = 1 - Math.pow(0.0008, delta);
    const px = reduceMotion ? 0 : pointer.current.x;
    const py = reduceMotion ? 0 : pointer.current.y;
    const alvoY = px * TILT_Y;
    const alvoX = -py * TILT_X;
    grupo.current.rotation.y += (alvoY - grupo.current.rotation.y) * tiltK;
    grupo.current.rotation.x += (alvoX - grupo.current.rotation.x) * tiltK;
    invalidate();
  });

  return (
    <group ref={grupo} position={[0, PILHA_Y, 0]}>
      {SABORES.map((sabor, i) => (
        <CaixaComSabor
          key={sabor}
          sabor={sabor}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[
            0,
            reduceMotion ? i * PASSO : i * PASSO + QUEDA,
            0,
          ]}
          visible={reduceMotion}
        />
      ))}
    </group>
  );
}

export function PilhaDeCaixas({
  progress,
  pointer,
  ember,
}: {
  progress: RefObject<number>;
  pointer: RefObject<PointerNorm>;
  ember?: RefObject<PilhaPose>;
}) {
  const reduceMotion = useMatchMedia("(prefers-reduced-motion: reduce)");
  const mobile = useMatchMedia("(max-width: 767px)");
  const idleEmber = useRef<PilhaPose>({ x: 0, y: 0, ember: 0, fade: 1 });
  const { invalidate } = usePilhaScroll();

  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{
        position: mobile ? [0.32, 0.26, 0.58] : [0.52, 0.34, 0.95],
        fov: mobile ? 34 : 36,
      }}
      gl={{ alpha: true }}
      onCreated={({ gl, invalidate: inv }) => {
        gl.toneMappingExposure = 1.7;
        invalidate.current = inv;
        inv();
      }}
      style={{ background: "transparent" }}
    >
      <CameraTrack
        mobile={mobile}
        progress={progress}
        reduceMotion={reduceMotion}
      />
      <ambientLight intensity={0.1} color="#ffffff" />
      <KeyLight ember={ember ?? idleEmber} />
      <directionalLight
        position={[0.2, 0.8, -2.2]}
        intensity={0.45}
        color="#fff6ea"
      />
      <KickFrame progress={progress} />
      <Suspense fallback={null}>
        <PilhaScene
          progress={progress}
          pointer={pointer}
          reduceMotion={reduceMotion}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.15} />
      </Suspense>
    </Canvas>
  );
}
