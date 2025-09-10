import TiltedCard from "./tilted-card";

interface NFTCardProps {
  imageSrc: string;
  altText: string;
  captionText: string;
}

export default function NFTCard({ imageSrc, altText, captionText }: NFTCardProps) {
  return (
    <TiltedCard
      imageSrc={imageSrc}
      altText={altText}
      captionText={captionText}
      containerHeight="260px"
      containerWidth="260px"
      imageHeight="250px"
      imageWidth="250px"
      rotateAmplitude={12}
      scaleOnHover={1.05}
      showMobileWarning={false}
      showTooltip={true}
      displayOverlayContent={true}
    />
  );
}
