import { Button, CardFooter, Card } from "@nextui-org/react";
import React from "react";
import { Player } from "../models/Player";
import { motion } from "framer-motion";
import { fadeIn, fadeOut, fadeVariant } from "../costants/animation";

function getInitialLetters(firstName: string, lastName: string) {
  return firstName.slice(0, 1).toUpperCase() + lastName.slice(0, 1).toUpperCase();
}

const PlayerCard = (props: Player) => {
  return (
    <motion.div variants={fadeVariant}>
      <Card isFooterBlurred radius="lg" className="border-none w-48 h-64">
        <div className="relative object-cover w-full h-full bg-orange-400/60 flex flex-col justify-center items-center font-bold">
          <span className="text-6xl">{getInitialLetters(props.firstname, props.lastname)}</span>
          <span className="font-extrabol mt-28 text-xl backdrop-blur-sm w-full h-full  absolute left-0 flex items-center justify-center">
            {props.firstname} {props.lastname}
          </span>
        </div>
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          {/* <p className="text-tiny text-white/80">Available soon.</p> */}
          <Button
            className="text-tiny text-white bg-black/20 w-full"
            variant="flat"
            color="default"
            radius="lg"
            size="sm"
          >
            Dettagli
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PlayerCard;
