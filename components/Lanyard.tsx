'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_FACE_RECT = { x: 0.018, y: 0.018, w: 0.464, h: 0.93 };
const BACK_FACE_RECT = { x: 0.518, y: 0.018, w: 0.464, h: 0.93 };

type CardTextureImage = CanvasImageSource & {
  width: number;
  height: number;
};

interface CardGLTF {
  nodes: {
    card: { geometry: THREE.BufferGeometry };
    clip: { geometry: THREE.BufferGeometry };
    clamp: { geometry: THREE.BufferGeometry };
  };
  materials: {
    base: THREE.MeshPhysicalMaterial & { map: THREE.Texture };
    metal: THREE.Material;
  };
}

interface LanyardProps {
  className?: string;
  position?: [number, number, number];
  anchorPosition?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  frontTitle?: string;
  frontSubtitle?: string;
  frontMeta?: string;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
  ropeLength?: number;
}

const cardGLB = '/reactbits/lanyard/card.glb';
export default function Lanyard({
  className = '',
  position = [0, 0, 30],
  anchorPosition = [0, 4, 0],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  frontTitle = 'heliannuuthus',
  frontSubtitle = 'AI Infra Engineer',
  lanyardImage = null,
  lanyardWidth = 1,
  cardScale = 2.25,
  ropeLength = 0.72
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement?.classList?.contains('dark') === true
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const handleTheme = (): void => setIsDark(root.classList.contains('dark'));
    const observer = new MutationObserver(handleTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    handleTheme();
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`lanyard-wrapper ${className}`}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={isDark ? 1.15 : Math.PI * 0.8} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            isDark={isDark}
            anchorPosition={anchorPosition}
            frontImage={frontImage}
            backImage={backImage}
            frontTitle={frontTitle}
            frontSubtitle={frontSubtitle}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            cardScale={cardScale}
            ropeLength={ropeLength}
          />
        </Physics>
        <Environment blur={1}>
          <Lightformer
            intensity={isDark ? 0.55 : 1.4}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={isDark ? 0.65 : 2}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={isDark ? 0.65 : 2}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={isDark ? 1.2 : 5}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  isDark?: boolean;
  anchorPosition?: [number, number, number];
  frontImage?: string | null;
  backImage?: string | null;
  frontTitle?: string;
  frontSubtitle?: string;
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
  ropeLength?: number;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  isDark = false,
  anchorPosition = [0, 4, 0],
  frontImage = null,
  backImage = null,
  frontTitle = 'heliannuuthus',
  frontSubtitle = 'AI Infra Engineer',
  lanyardImage = null,
  lanyardWidth = 1,
  cardScale = 2.25,
  ropeLength = 0.72
}: BandProps) {
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as unknown as CardGLTF;
  const lanyardTex = useTexture(lanyardImage || BLANK_PIXEL);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Build a clean card atlas so the original ReactBits demo artwork never
  // leaks through when the card flips.
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    const baseImg = baseMap.image as CardTextureImage;
    const textureScale = 2;
    const W = (baseImg.width || 2048) * textureScale;
    const H = (baseImg.height || 1024) * textureScale;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = isDark ? '#050505' : '#F8F8F7';
    ctx.fillRect(0, 0, W, H);

    const fillPanel = (rect: typeof FRONT_FACE_RECT) => {
      const x = rect.x * W;
      const y = rect.y * H;
      const w = rect.w * W;
      const h = rect.h * H;
      const radius = Math.min(w, h) * 0.055;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.clip();
      ctx.fillStyle = isDark ? '#050505' : '#F8F8F7';
      ctx.fillRect(x, y, w, h);

      const topBloom = ctx.createLinearGradient(x, y, x, y + h);
      topBloom.addColorStop(0, isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.72)');
      topBloom.addColorStop(0.2, isDark ? 'rgba(255,255,255,0.008)' : 'rgba(255,255,255,0.16)');
      topBloom.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = topBloom;
      ctx.fillRect(x, y, w, h);

      const sideReflection = ctx.createLinearGradient(x + w * 0.58, y, x + w * 0.92, y);
      sideReflection.addColorStop(0, 'rgba(255,255,255,0)');
      sideReflection.addColorStop(0.48, isDark ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.22)');
      sideReflection.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sideReflection;
      ctx.fillRect(x, y, w, h);

      const lowerDepth = ctx.createLinearGradient(x, y + h * 0.62, x, y + h);
      lowerDepth.addColorStop(0, 'rgba(0,0,0,0)');
      lowerDepth.addColorStop(1, isDark ? 'rgba(0,0,0,0.34)' : 'rgba(17,24,39,0.04)');
      ctx.fillStyle = lowerDepth;
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.78)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + radius, y + 1);
      ctx.lineTo(x + w - radius, y + 1);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.06)';
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.restore();

      return { x, y, w, h };
    };

    const drawAvatarImage = (img: CardTextureImage, x: number, y: number, size: number) => {
      const scale = Math.min(size / img.width, size / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = x + (size - dw) / 2;
      const dy = y + (size - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const drawBackPanel = (img: CardTextureImage) => {
      const panel = fillPanel(BACK_FACE_RECT);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(panel.x, panel.y, panel.w, panel.h, Math.min(panel.w, panel.h) * 0.055);
      ctx.clip();

      const avatarSize = panel.w * 0.62;
      const avatarX = panel.x + (panel.w - avatarSize) / 2;
      const avatarY = panel.y + panel.h * 0.2;
      const avatarRadius = avatarSize * 0.12;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, avatarRadius);
      ctx.clip();
      drawAvatarImage(img, avatarX, avatarY, avatarSize);
      ctx.restore();

      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(avatarX - 1, avatarY - 1, avatarSize + 2, avatarSize + 2, avatarRadius + 1);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#F5F5F7' : '#111827';
      ctx.font = `800 ${Math.round(panel.w * 0.092)}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(frontTitle, panel.x + panel.w / 2, panel.y + panel.h * 0.72);
      ctx.textAlign = 'start';
      ctx.restore();
    };

    const drawMinimalBadgeFace = (img: CardTextureImage) => {
      const panel = fillPanel(FRONT_FACE_RECT);
      const rx = panel.x;
      const ry = panel.y;
      const rw = panel.w;
      const rh = panel.h;
      const text = isDark ? '#F5F5F7' : '#111827';
      const muted = isDark ? 'rgba(245,245,247,0.58)' : 'rgba(31,41,55,0.62)';
      const avatarSize = rw * 0.48;
      const avatarX = rx + (rw - avatarSize) / 2;
      const avatarY = ry + rh * 0.44;
      const avatarRadius = avatarSize * 0.12;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, Math.min(rw, rh) * 0.055);
      ctx.clip();

      ctx.fillStyle = text;
      ctx.font = `800 ${Math.round(rw * 0.092)}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(frontTitle, rx + rw / 2, ry + rh * 0.3);

      ctx.fillStyle = muted;
      ctx.font = `600 ${Math.round(rw * 0.047)}px Inter, Arial, sans-serif`;
      ctx.fillText(frontSubtitle, rx + rw / 2, ry + rh * 0.39);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, avatarRadius);
      ctx.clip();
      drawAvatarImage(img, avatarX, avatarY, avatarSize);
      ctx.restore();
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(avatarX - 1, avatarY - 1, avatarSize + 2, avatarSize + 2, avatarRadius + 1);
      ctx.stroke();

      ctx.textAlign = 'start';
      ctx.restore();
    };

    const backImageData = backTex.image as CardTextureImage | undefined;
    const frontImageData = frontTex.image as CardTextureImage | undefined;

    if (backImage && backImageData) drawBackPanel(backImageData);
    else fillPanel(BACK_FACE_RECT);
    drawMinimalBadgeFace(backImageData || frontImageData || baseImg);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.generateMipmaps = true;
    composite.minFilter = THREE.LinearMipmapLinearFilter;
    composite.magFilter = THREE.LinearFilter;
    composite.needsUpdate = true;
    return composite;
  }, [backImage, frontTex, backTex, frontTitle, frontSubtitle, isDark, materials.base.map]);

  const texture = useMemo(() => {
    if (lanyardImage) return lanyardTex;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return lanyardTex;

    const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, isDark ? '#030303' : '#D5DDE8');
    bg.addColorStop(0.5, isDark ? '#111111' : '#F1F4F8');
    bg.addColorStop(1, isDark ? '#050505' : '#C8D2DF');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const softCenter = ctx.createLinearGradient(0, 0, 0, canvas.height);
    softCenter.addColorStop(0, isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.52)');
    softCenter.addColorStop(0.45, 'rgba(255,255,255,0)');
    softCenter.addColorStop(1, isDark ? 'rgba(0,0,0,0.28)' : 'rgba(43,62,92,0.1)');
    ctx.fillStyle = softCenter;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const generated = new THREE.CanvasTexture(canvas);
    generated.colorSpace = THREE.SRGBColorSpace;
    generated.anisotropy = 16;
    generated.needsUpdate = true;
    return generated;
  }, [isDark, lanyardImage, lanyardTex]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={anchorPosition}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[ropeLength * 0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[ropeLength, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[ropeLength * 1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[ropeLength * 2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isDark || isMobile ? 0 : 0.55}
                clearcoatRoughness={0.3}
                roughness={isDark ? 0.62 : 0.34}
                metalness={0}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[
            {
              color: isDark ? "#1B3352" : "#D8E2F0",
              depthTest: false,
              resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000),
              useMap: 1,
              map: texture,
              repeat: new THREE.Vector2(-4, 1),
              lineWidth: lanyardWidth
            } as ConstructorParameters<typeof MeshLineMaterial>[0]
          ]}
        />
      </mesh>
    </>
  );
}
