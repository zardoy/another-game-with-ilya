import { LinearMipMapLinearFilter, NearestFilter, Texture, TextureLoader } from "three";

import { getTextureUrl } from "../shared/minecraft-data";

// const texturesToLoad = ["dirt", "stone"] as const;
// type TexturesToLoad = (typeof texturesToLoad)[number];

export const threeTextures = new Map<string, Texture>();

export const addTexture = (blockName: string): boolean => {
    if (threeTextures.has(blockName)) return true;
    const textureUrl = getTextureUrl("block", blockName);
    if (!textureUrl) return false;
    const texture = new TextureLoader().load(textureUrl);
    texture.magFilter = NearestFilter;
    texture.minFilter = LinearMipMapLinearFilter;
    threeTextures.set(blockName, texture);
    return true;
};
