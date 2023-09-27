import { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard.component";
import { Player } from "../models/Player";
import useFetch from "../hooks/useFetch";
import { ApiEndpoint } from "../models/constants";
import { motion } from "framer-motion";
import { fadeVariant } from "../costants/animation";
import Title from "../components/Title.component";
import { useTranslation } from "react-i18next";

const PlayersPage = () => {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const fetchData = useFetch();

  useEffect(() => {
    fetchData<Player[]>(ApiEndpoint.getPlayers, "get")
      .then((data) => setPlayers(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex flex-col gap-[4rem] text-center w-full pt-16">
      <Title>{t("players.list")}</Title>
      {players && (
        <motion.div
          className="w-full max-w-xl md:max-w-full flex flex-wrap gap-6 items-center justify-center"
          variants={fadeVariant}
          initial="hidden"
          animate="show"
        >
          {players?.map((player) => <PlayerCard key={player.id} {...player} />)}
        </motion.div>
      )}
      {/* {error && <h4 className="text-red text-2xl">{error.message}</h4>} */}
    </div>
  );
};

export default PlayersPage;
