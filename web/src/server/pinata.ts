"server only"
import { type NFT, type NFTMetadata } from "@/types/nft";
import { type NFTItem } from "@prisma/client";
import { PinataSDK } from "pinata"

const pinataDefault = new PinataSDK({
    pinataJwt: `${process.env.PINATA_JWT}`,
    pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
});
export class PinataService {
    constructor(
        private pinata = pinataDefault
    ) { }

    async fetchMetadata(cid: string): Promise<NFTMetadata | null> {
        try {
            const response = await this.pinata.gateways.public.get(cid);
            const metadata = response.data as unknown as NFTMetadata;
            if (!metadata?.name) return null;
            return metadata;
        } catch (error) {
            console.warn(`Failed to fetch metadata for CID ${cid}:`, error);
            return null;
        }
    }

    mapMetadataToNFT(nftItem: NFTItem, metadata: NFTMetadata): NFT {
        return {
            id: nftItem.id,
            cid: nftItem.metadataCid,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image.startsWith('ipfs://')
                ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${metadata.image.replace('ipfs://', '')}`
                : metadata.image,
            price: nftItem.price.toString(),
            isActive: nftItem.isActive,
            createdAt: nftItem.createdAt.toISOString(),
            attributes: metadata.attributes,
        };
    }

    async listFiles() {
        return this.pinata.files.public.list();
    }
}

export const pinataService = new PinataService();
