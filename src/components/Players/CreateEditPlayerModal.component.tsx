import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { CreationSuccess } from "../../models/Api";
import { ApiEndpoint } from "../../models/constants";
import { useToast } from "../../context/Toast.context";
import { Player } from "../../models/Player";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  player?: Player;
  onCloseModal: () => void;
};

const CreateEditPlayerModal = (props: Props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [password, setPassword] = useState("");
  const fetchData = useFetch();
  const { add } = useToast();

  const handleCreateUser = (closeFn: () => void) => {
    fetchData<CreationSuccess>(ApiEndpoint.createPlayer, "post", {
      body: JSON.stringify({ username, firstname, lastname, password }),
    })
      .then(() => add({ message: t("players.creationSuccess"), type: "success" }))
      .finally(() => {
        props.onCloseModal();
        closeFn();
      });
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      backdrop="blur"
      className="dark text-foreground bg-background"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{t("players.createNew")}</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label={t("label.firstname")}
                placeholder={t("placeholder.firstname")}
                variant="bordered"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                isRequired
                required={true}
              />
              <Input
                label={t("label.lastname")}
                placeholder={t("placeholder.lastname")}
                variant="bordered"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                isRequired
                isDisabled={firstname.length === 0}
              />
              <Input
                label={t("label.username")}
                placeholder={t("placeholder.username")}
                variant="bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isRequired
                isDisabled={lastname.length === 0}
              />
              <Input
                label={t("label.password")}
                placeholder={t("placeholder.password")}
                type="password"
                variant="bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                required={true}
                isDisabled={username.length === 0}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                {t("buttons.cancel")}
              </Button>
              <Button
                color="primary"
                isDisabled={password.length === 0}
                onPress={() => handleCreateUser(onClose)}
              >
                {t("buttons.create")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateEditPlayerModal;
