import prismarineDiamondSquare from "diamond-square";
import minecraftAssetsModule from "minecraft-assets";
import prismarineWorld from "prismarine-world";

const seed = 891183773;
// const seed = Math.floor(Math.random() * Math.pow(2, 31));

const World = prismarineWorld("1.12");

const diamondSquare = prismarineDiamondSquare({ version: '1.16', seed });

export const world = new World(diamondSquare);

const chunkBounds = {
    x: 16,
    y: 256,
    z: 16
};

// for (let y = 0; y < chunkBounds.y; y++) {
//     const block = await world.getBlock(vec3(0, y, 0));
//     if (block.name === "air") continue;
//     console.log(y, block.name);
// }

const lastMcVersion = minecraftAssetsModule.versions.slice(-1)[0];

type BlockTexture = {
    name: string,
    blockState: string,
    model: string,
    texture: string;
};
type ItemTexture = Pick<BlockTexture, "name" | "model" | "texture">;

type MinecraftAssets = {
    blocks: {
        [block: string]: BlockTexture;
    },
    blocksArray: BlockTexture[],
    items: {
        [item: string]: ItemTexture;
    };
    itemsArray: ItemTexture[];
    version: string;
    findItemOrBlockByName: (name: string) => ItemTexture;
    /** for use in `getTextureUrl` */
    getTexture: (name: string) => string;
};

const minecraftAssets: MinecraftAssets = minecraftAssetsModule(lastMcVersion);

export const getTextureUrl = (type: "block" /* | "item" | "both" */, name: string): string | null => {
    const texturePathFull = minecraftAssets.blocks[name].texture;
    if (!texturePathFull) return null;
    const texturePathResolved = texturePathFull.startsWith("minecraft:") ? texturePathFull.slice("minecraft:".length) : texturePathFull;
    const textureUrl = `https://raw.githubusercontent.com/rom1504/minecraft-assets/master/data/${minecraftAssets.version}/${texturePathResolved}.png`;
    return textureUrl;
};;

// check ALL VERSIONS ALL TEXTURE AVAILABLE
