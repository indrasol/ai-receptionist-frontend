
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureRowProps {
  icon: ReactNode;
  heading: string;
  description: string;
  image?: string;
  reverse?: boolean;
  className?: string;
}

const FeatureRow = ({ icon, heading, description, image, reverse = false, className }: FeatureRowProps) => {
  return (
    <div className={cn(
      "flex flex-col lg:flex-row items-center gap-12",
      reverse && "lg:flex-row-reverse",
      className
    )}>
      {/* Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
          <h3 className="text-2xl font-heading font-semibold">{heading}</h3>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Image */}
      {image && (
        <div className="flex-1">
          <div className="glass-card rounded-2xl p-8">
            <img
              src={image}
              alt={heading}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureRow;
