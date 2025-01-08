'use client';

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

const scaleAnimation = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

// Interfaces
interface BentoMotionProps {
  children: ReactNode;
  className?: string;
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  zIndex?: number;
}

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

// Bento Components
const BentoMotion: React.FC<BentoMotionProps> = ({ children, className }) => {
  return (
    <motion.div 
      {...scaleAnimation}
      className={cn(
        'transform-gpu',
        'origin-center',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={cn(
        'grid grid-cols-1 md:grid-cols-3',
        'auto-rows-min',
        'gap-3 md:gap-4 lg:gap-6',
        'w-full',
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
}) => {
  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  }[colSpan] || 'col-span-1';

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  }[rowSpan] || 'row-span-1';

  return (
    <BentoMotion
      className={cn(
        'rounded-xl backdrop-blur-md',
        'transition-all duration-300',
        'p-4 md:p-6',
        'hover:shadow-lg hover:shadow-white/10',
        colSpanClasses,
        rowSpanClasses,
        className
      )}
    >
      <div className="w-full h-full relative">
        {children}
      </div>
    </BentoMotion>
  );
};

// Parallax Components
const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 1,
  className = '',
  zIndex = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (!ref.current) return;
      
      const content = document.querySelector('.content-wrapper');
      if (content) {
        setContentHeight(content.getBoundingClientRect().height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    const observer = new ResizeObserver(updateHeight);
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
    };
  }, []);

  const yTransform = useTransform(
    scrollY,
    [0, contentHeight],
    [0, contentHeight * speed * -0.1]
  );

  return (
    <motion.div
      ref={ref}
      style={{ 
        y: yTransform,
        zIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
      }}
      className={cn(
        'will-change-transform',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div 
      className={cn(
        'relative w-full min-h-screen',
        'overflow-x-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

// Feature Components
const FeatureList: React.FC = () => (
  <div className="flex flex-col gap-3 w-full">
    {[
      { title: 'Feature A', color: 'bg-purple-500/20' },
      { title: 'Feature B', color: 'bg-blue-500/20' },
      { title: 'Feature C', color: 'bg-indigo-500/20' },
    ].map((feature, index) => (
      <motion.div 
        key={index}
        {...scaleAnimation}
        className={cn(
          feature.color,
          'rounded-lg p-3',
          'backdrop-blur-sm',
          'transform-gpu',
          'transition-all duration-300',
          'hover:shadow-lg hover:shadow-white/5'
        )}
      >
        <span className="text-sm font-medium">{feature.title}</span>
      </motion.div>
    ))}
  </div>
);

const ContentSection: React.FC = () => (
  <BentoGrid className="h-full gap-3 md:gap-4">
    <BentoItem 
      colSpan={2} 
      className="bg-blue-600/20 min-h-48"
    >
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Content Block</h3>
        <p className="text-gray-200">Detailed content description goes here.</p>
      </div>
    </BentoItem>
    <BentoItem className="bg-purple-600/20 min-h-48">
      <div className="h-full flex flex-col">
        <span className="text-lg font-medium mb-4">Side Info</span>
        <div className="flex-1 overflow-y-auto pr-2">
          <FeatureList />
        </div>
      </div>
    </BentoItem>
  </BentoGrid>
);

const Home: React.FC = () => {
  return (
    <ParallaxContainer>
      <ParallaxLayer
        speed={0.2}
        className="bg-gradient-to-br from-blue-900 to-purple-900"
        zIndex={0}
      >
        <div className="absolute inset-0" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.5} zIndex={1}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-xl" />
        </div>
      </ParallaxLayer>

      <div className="content-wrapper relative z-[2]">
        <div className="min-h-screen w-full">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <BentoGrid className="gap-3 md:gap-4 lg:gap-6">
              {/* Hero Section */}
              <BentoItem 
                colSpan={3} 
                className="bg-white/5 min-h-48 md:min-h-64"
              >
                <div className="space-y-3 md:space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold">Nested Bento Grid</h1>
                  <p className="text-lg md:text-xl text-gray-200">
                    Explore our multi-layered, responsive grid system
                  </p>
                </div>
              </BentoItem>

              {/* Main Content Section */}
              <BentoItem colSpan={3} className="mt-0">
                <ContentSection />
              </BentoItem>

              {/* Bottom Grid */}
              <BentoItem colSpan={3} className="bg-white/5 mt-0">
                <BentoGrid className="gap-3 md:gap-4">
                  {['Bottom A', 'Bottom B', 'Bottom C'].map((title, index) => (
                    <BentoItem 
                      key={index}
                      className={cn(
                        'min-h-24 md:min-h-32',
                        index === 0 ? 'bg-indigo-500/20' :
                        index === 1 ? 'bg-purple-500/20' : 'bg-blue-500/20'
                      )}
                    >
                      <div className="h-full flex items-center justify-center">
                        <span className="text-lg font-medium">{title}</span>
                      </div>
                    </BentoItem>
                  ))}
                </BentoGrid>
              </BentoItem>
            </BentoGrid>
          </div>
        </div>
      </div>
    </ParallaxContainer>
  );
};

export default Home;
