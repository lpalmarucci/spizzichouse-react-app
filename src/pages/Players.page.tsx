import { useCallback, useEffect, useState, useTransition } from "react";
import { Player } from "../models/Player";
import useFetch from "../hooks/useFetch";
import { ApiEndpoint } from "../models/constants";
import Title from "../components/Title.component";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@nextui-org/react";
import PlayersTable from "../components/Players/PlayersTable.component";

const PlayersPage = () => {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const fetchData = useFetch();
  const [isPending, startTransition] = useTransition();

  const fetchPlayers = useCallback(() => {
    fetchData<Player[]>(ApiEndpoint.getPlayers, "get").then((data) => setPlayers(data));
  }, []);

  useEffect(() => {
    startTransition(() => {
      fetchPlayers();
    });
  }, []);

  return (
    <div className="flex flex-col gap-[4rem]  w-full pt-16">
      <Title>{t("players.list")}</Title>
      <div className="w-full h-full flex justify-center items-center">
        {isPending ? (
          <CircularProgress label={t("label.loading")} size="lg" />
        ) : (
          <PlayersTable players={players} fetchPlayers={fetchPlayers} />
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
