import streetLampImg from "@/assets/street-lamp.png";

interface StreetLampIconProps {
  className?: string;
}

const StreetLampIcon = ({ className = "" }: StreetLampIconProps) => {
  return (
    <img 
      src={streetLampImg} 
      alt="Amsterdam Street Lamp" 
      className={`inline-block ${className}`}
    />
  );
};

export default StreetLampIcon;
