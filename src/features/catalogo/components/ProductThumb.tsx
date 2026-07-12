import { Box, Image as ImageIcon } from "lucide-react"

interface ProductThumbProps {
  tipo: string;
  cor?: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

export function ProductThumb({ tipo, cor = "#c9a655", imageUrl, size = "md" }: ProductThumbProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  return (
    <div 
      className={`${sizeClasses[size]} shrink-0 rounded-full flex items-center justify-center relative overflow-hidden border transition-transform hover:scale-105`}
      style={{ 
        borderColor: cor, 
        backgroundColor: `${cor}15` 
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={tipo} className="w-full h-full object-cover" />
      ) : (
        <Box className={`${iconSizes[size]} opacity-60`} style={{ color: cor }} />
      )}
    </div>
  )
}
