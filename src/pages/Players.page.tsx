import { useState } from "react";
import PlayerCard from "../components/PlayerCard.component";
import { Player } from "../models/Player";
import { useFetch } from "../hooks/useFetch";
import { ApiEndpoint } from "../models/constats";
import { motion } from "framer-motion";
import { fadeIn, fadeOut, fadeVariant } from "../costants/animation";

const PlayersPage = () => {
  const { data, error } = useFetch<Player[]>(ApiEndpoint.getPlayers);

  return (
    <div className="flex flex-col gap-[4rem] text-center w-full px-6">
      <h1 className="text-white text-5xl font-bold">Lista Giocatori</h1>
      {data && (
        <motion.div
          className="w-full max-w-xl md:max-w-full flex flex-wrap gap-6 items-center justify-center"
          variants={fadeVariant}
          initial="hidden"
          animate="show"
        >
          {data?.map((player) => <PlayerCard key={player.id} {...player} />)}
        </motion.div>
      )}
    </div>
  );
};

export default PlayersPage;
