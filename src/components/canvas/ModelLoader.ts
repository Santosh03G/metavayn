import { useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/**
 * Configure Draco and Meshopt decoders for glTF models.
 * DRACO decoder is fetched from Google's standard CDN or local directory.
 */
export function setupModelLoader() {
  // Pre-configure Draco decoder path on client
  if (typeof window !== "undefined") {
    // Drei's useGLTF handles Draco out of the box when draco path is set
    useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  }
}

export { useGLTF, MeshoptDecoder };
