import { readFileSync } from 'fs';
import { join } from 'path';
import type { SceneData } from '../types/scene';

export function getSceneData(): SceneData[] {
  const file = join(process.cwd(), '..', 'data', 'demo-scenes.json');
  return JSON.parse(readFileSync(file, 'utf8')) as SceneData[];
}
