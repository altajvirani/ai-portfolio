import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Interactive 3D Origami Paper-Craft backdrop for Hero section.
 * Uses tactile paper swatches (cobalt, tangerine, mint, cream) with gentle idle
 * float and damped pointer parallax. Respects GPU/software WebGL capabilities,
 * pauses offscreen via IntersectionObserver, and disposes cleanly on unmount.
 */
export const HeroOrigamiCanvas: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const gl = renderer.getContext();
    const debugExt = gl.getExtension("WEBGL_debug_renderer_info");
    const gpuStr = debugExt
      ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || "")
      : "";
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe/i.test(gpuStr);

    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("data-testid", "hero-origami-canvas");
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const scene = new THREE.Scene();

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.65;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 0.15, 9.2);

    // Tactile Warm Studio Key + Cool Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight("#E0F2FE", "#F5ECD8", 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#FFF7ED", 1.85);
    keyLight.position.set(5.5, 6.5, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#93C5FD", 0.9);
    rimLight.position.set(-6, -3, 4);
    scene.add(rimLight);

    // Reusable folded paper geometries & crisp white die-cut rim
    const outerRimMat = new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      roughness: 0.72,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const createFoldedPaperDart = (
      mainHex: string,
      foldHex: string,
      scaleVal: number,
    ): THREE.Group => {
      const group = new THREE.Group();

      // Wing 1
      const wingGeo = new THREE.BufferGeometry();
      wingGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array([
            0, 0, 1.05,
            -0.78, 0.14, -0.78,
            0, 0.02, -0.45,
          ]),
          3,
        ),
      );
      wingGeo.computeVertexNormals();

      // Wing 2
      const wing2Geo = new THREE.BufferGeometry();
      wing2Geo.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array([
            0, 0, 1.05,
            0, 0.02, -0.45,
            0.78, 0.14, -0.78,
          ]),
          3,
        ),
      );
      wing2Geo.computeVertexNormals();

      // Central keel fold
      const keelGeo = new THREE.BufferGeometry();
      keelGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array([
            0, 0, 1.05,
            0, 0.02, -0.45,
            0, -0.34, -0.58,
          ]),
          3,
        ),
      );
      keelGeo.computeVertexNormals();

      const mainMat = new THREE.MeshStandardMaterial({
        color: mainHex,
        roughness: 0.56,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });

      const foldMat = new THREE.MeshStandardMaterial({
        color: foldHex,
        roughness: 0.68,
        metalness: 0.02,
        side: THREE.DoubleSide,
      });

      const wing1 = new THREE.Mesh(wingGeo, mainMat);
      const wing2 = new THREE.Mesh(wing2Geo, mainMat);
      const keel = new THREE.Mesh(keelGeo, foldMat);

      // Die-cut paper backing border
      const rim = new THREE.Mesh(
        new THREE.RingGeometry(0.18, 0.25, 20),
        outerRimMat,
      );
      rim.rotation.x = -Math.PI / 2;
      rim.position.set(0, -0.04, -0.1);

      group.add(wing1, wing2, keel, rim);
      group.scale.setScalar(scaleVal);
      return group;
    };

    const createCutoutTile = (
      faceHex: string,
      tabHex: string,
      w: number,
      h: number,
    ): THREE.Group => {
      const group = new THREE.Group();

      const cardGeo = new THREE.BoxGeometry(w, h, 0.06);
      const cardMat = new THREE.MeshStandardMaterial({
        color: faceHex,
        roughness: 0.62,
        metalness: 0.04,
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);

      // White die-cut backing
      const rimGeo = new THREE.BoxGeometry(w + 0.14, h + 0.14, 0.04);
      const rimMesh = new THREE.Mesh(rimGeo, outerRimMat);
      rimMesh.position.z = -0.02;

      // Top corner masking tape tab
      const tapeGeo = new THREE.BoxGeometry(w * 0.45, 0.16, 0.075);
      const tapeMat = new THREE.MeshStandardMaterial({
        color: tabHex,
        roughness: 0.45,
        metalness: 0.05,
        transparent: true,
        opacity: 0.86,
      });
      const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
      tapeMesh.position.set(0, h * 0.5 + 0.02, 0.01);
      tapeMesh.rotation.z = 0.09;

      // Subtle inner stamp disc
      const stampGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.07, 24);
      const stampMesh = new THREE.Mesh(stampGeo, tapeMat);
      stampMesh.rotation.x = Math.PI / 2;
      stampMesh.position.set(-w * 0.26, h * 0.2, 0.015);

      group.add(rimMesh, cardMesh, tapeMesh, stampMesh);
      return group;
    };

    interface FloatingItem {
      mesh: THREE.Group;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      speed: number;
      phase: number;
      ampY: number;
      parallax: number;
    }

    const items: FloatingItem[] = [];

    const addItem = (
      mesh: THREE.Group,
      pos: [number, number, number],
      rot: [number, number, number],
      speed: number,
      phase: number,
      ampY: number,
      parallax: number,
    ) => {
      const basePos = new THREE.Vector3(...pos);
      const baseRot = new THREE.Euler(...rot);
      mesh.position.copy(basePos);
      mesh.rotation.copy(baseRot);
      scene.add(mesh);
      items.push({ mesh, basePos, baseRot, speed, phase, ampY, parallax });
    };

    // Place folded origami & die-cut cards harmoniously around the perimeter so center copy stays crisp
    addItem(
      createFoldedPaperDart("#3B82F6", "#1D4ED8", 0.78),
      [-6.1, 2.55, -1.6],
      [0.42, 0.62, -0.25],
      0.9,
      0.2,
      0.18,
      0.45,
    );
    addItem(
      createFoldedPaperDart("#F97316", "#C2410C", 0.72),
      [5.1, -1.75, -1.5],
      [0.35, -0.75, 0.22],
      1.05,
      2.1,
      0.18,
      0.55,
    );
    addItem(
      createCutoutTile("#D1FAE5", "#10B981", 1.25, 0.88),
      [-5.45, -1.95, -1.9],
      [-0.18, 0.26, -0.14],
      0.75,
      1.3,
      0.16,
      0.35,
    );
    addItem(
      createCutoutTile("#FEF3C7", "#F59E0B", 1.15, 0.82),
      [4.95, 2.15, -2.1],
      [0.2, -0.32, 0.16],
      0.85,
      3.5,
      0.18,
      0.4,
    );
    addItem(
      createFoldedPaperDart("#10B981", "#047857", 0.56),
      [0.45, 2.55, -2.6],
      [0.45, 0.35, -0.15],
      1.1,
      4.4,
      0.15,
      0.3,
    );

    const resize = () => {
      if (!renderer || !container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      // Hide far lateral decorations cleanly on narrow mobile viewports so scene stays balanced
      const isNarrow = w < 640;
      items.forEach((item, idx) => {
        item.mesh.position.x = item.basePos.x * (isNarrow ? 0.56 : 1);
        item.mesh.scale.setScalar(
          (idx === 2 || idx === 3 ? 1 : idx === 0 ? 0.82 : idx === 1 ? 0.7 : 0.56) *
            (isNarrow ? 0.72 : 1),
        );
      });
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let pointerX = 0;
    let pointerY = 0;
    let smoothPX = 0;
    let smoothPY = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    let rafId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;

    const renderFrame = (dt: number) => {
      if (disposed || !renderer) return;
      elapsed += dt;
      smoothPX = THREE.MathUtils.damp(smoothPX, pointerX, 4.5, dt);
      smoothPY = THREE.MathUtils.damp(smoothPY, pointerY, 4.5, dt);

      for (const item of items) {
        const t = elapsed * item.speed + item.phase;
        item.mesh.position.y =
          item.basePos.y + Math.sin(t) * item.ampY - smoothPY * item.parallax * 0.45;
        item.mesh.rotation.x =
          item.baseRot.x + Math.cos(t * 0.8) * 0.08 + smoothPY * 0.22;
        item.mesh.rotation.y =
          item.baseRot.y + Math.sin(t * 0.7) * 0.1 + smoothPX * 0.28;
      }

      renderer.render(scene, camera);
    };

    // Always render initial frame
    renderFrame(0.016);

    const loop = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (isVisible && !reducedMotion) {
        renderFrame(dt);
      }

      if (!reducedMotion) {
        if (isSoftwareGl) {
          setTimeout(() => {
            if (!disposed) rafId = requestAnimationFrame(loop);
          }, 32);
        } else {
          rafId = requestAnimationFrame(loop);
        }
      }
    };

    if (!reducedMotion) {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      envTarget.dispose();
      pmrem.dispose();
      renderer?.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
