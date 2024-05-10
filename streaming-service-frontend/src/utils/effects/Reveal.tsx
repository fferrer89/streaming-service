//@ts-nocheck
import React, { useState, useEffect } from "react";
import {motion, useAnimation, useInView} from "framer-motion";


interface RevealProps {
    children: React.ReactNode;
    width: "fit-content" | "100%" | "auto" | string;
    height?: "fit-content" | "100%" | "auto" | string;
    delay?: number;
}

export default function Reveal({ children, width,height, delay = 0 }: RevealProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    
    const isInView = useInView(ref,{once:true});
   

    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView]);

    return (
        <div ref={ref} style={{position:"relative",width, height }}>

            <motion.div
                initial="hidden"
                animate={mainControls}
                transition={{ delay, duration: 0.5 }}
                variants={{
                    hidden: { opacity: 0, y:75 },
                    visible: { opacity: 1, y: 0 },
                }}
            >
                {children}
            </motion.div>

        </div>
            
    );
}