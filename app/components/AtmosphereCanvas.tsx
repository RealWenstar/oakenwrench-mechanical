"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform float u_progress;
uniform float u_intensity;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 p = v_uv;
  float grain = hash(floor((p + u_progress) * 34.0 + u_time * 0.00008));
  float plume = smoothstep(0.95, 0.1, distance(p, vec2(0.5, 0.62)));
  float sweep = smoothstep(0.0, 0.18, 1.0 - abs(p.y - fract(u_progress * 2.2)));
  float alpha = u_intensity * (0.035 + grain * 0.08) * plume;
  vec3 color = mix(vec3(0.28, 0.42, 0.58), vec3(1.0, 0.68, 0.32), sweep);
  gl_FragColor = vec4(color, alpha);
}`;

function transitionIntensity(progress: number) {
  return [0.32, 0.62, 0.84].reduce((strongest, point) => {
    const distance = Math.abs(progress - point);
    return Math.max(strongest, Math.max(0, 1 - distance / 0.055));
  }, 0);
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function AtmosphereCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    buffer: WebGLBuffer;
    progress: WebGLUniformLocation | null;
    intensity: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    rendererRef.current = {
      gl,
      program,
      buffer,
      progress: gl.getUniformLocation(program, "u_progress"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      time: gl.getUniformLocation(program, "u_time"),
    };

    return () => {
      window.removeEventListener("resize", resize);
      rendererRef.current = null;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const { gl, intensity, progress: progressLocation, time } = renderer;
    gl.uniform1f(progressLocation, progress);
    gl.uniform1f(intensity, transitionIntensity(progress));
    gl.uniform1f(time, performance.now());
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [progress]);

  return <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />;
}
