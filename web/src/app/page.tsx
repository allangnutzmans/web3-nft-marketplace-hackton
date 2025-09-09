'use client'
import TiltedCard from "@/components/ui/tilted-card";

export default function Home() {
  return (
    <div className="bg-white min-h-full">
      {/* Main content area - matches the empty frame from the image */}
      <div className="w-full h-full flex items-center justify-center border-2 border-gray-300 rounded-l-4xl min-h-[calc(100vh-8.5rem)]">
        <div className="text-center">
          {/* Demo card for testing */}
          {/* <div className="mt-8">
            <TiltedCard
              imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
              altText="Kendrick Lamar - GNX Album Cover"
              captionText="Kendrick Lamar - GNX"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="tilted-card-demo-text">
                  Kendrick Lamar - GNX
                </p>
              }
            /> */}
        </div>
      </div>
    </div>
  );
}
