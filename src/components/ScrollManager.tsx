import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animate } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export const ScrollManager = ({ section, onSectionChange }: { section: number, onSectionChange: Dispatch<SetStateAction<number>> }) => {

  const data = useScroll();
  const lastScroll = useRef(0);
  const isAnimating = useRef(false);

  data.fill.classList.add("top-0");
  data.fill.classList.add("absolute");

  useEffect(() => {
    const curSection = Math.floor(data.offset* data.pages);
    animate(curSection * data.el.clientHeight, section * data.el.clientHeight, {
      duration: 1,
      onPlay() {
        isAnimating.current = true;
      },
      onComplete() {
        isAnimating.current = false;
      },
      onUpdate(latest) {
        data.el.scrollTop = latest;
      },
    })
  }, [section]);

  useFrame(() => {
    if (isAnimating.current) {
      lastScroll.current = data.offset;
      return;
    }

    const curSection = Math.floor(data.offset* data.pages);
    if (data.offset > lastScroll.current && curSection === 0) {
      onSectionChange(1);
    }
    if (
      data.offset < lastScroll.current &&
      data.offset < 1 / (data.pages - 1)
    ) {
      onSectionChange(0);
    }
    lastScroll.current = data.offset;
  });

  return null;
};
