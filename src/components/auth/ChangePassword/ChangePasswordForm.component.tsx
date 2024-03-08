import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { useDialogContext } from '../../../context/Dialog.context.tsx';
import { useToast } from '../../../context/Toast.context.tsx';
import useFetch from '../../../hooks/useFetch.tsx';
import ApiEndpoints from '../../../costants/ApiEndpoints.ts';
import { useTranslation } from 'react-i18next';

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { closeDialog } = useDialogContext();
  const { showAlertMessage } = useToast();
  const fetch = useFetch();
  const { t } = useTranslation();

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await fetch(ApiEndpoints.changePassword, 'POST', {
      body: JSON.stringify({ password: newPassword }),
    });
    closeDialog();
    showAlertMessage({
      type: 'success',
      message: t('updatePassword.messages.updateSuccess'),
    });
  }

  return (
    <div className="py-8 px-4 flex flex-col gap-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-bold">{t('updatePassword.title')}</h1>
        <h4 className="text-sm font-semibold text-gray-400">
          {t('updatePassword.description')}
        </h4>
      </div>
      <div className="">
        <form className="flex flex-col gap-4">
          <Input
            type="password"
            label={t('placeholders.newPassword')}
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
          />
          <Input
            type="password"
            label={t('placeholders.confirmNewPassword')}
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
          <Button
            type="submit"
            onClick={handleSubmit}
            isDisabled={
              newPassword.length === 0 ||
              confirmPassword.length === 0 ||
              newPassword !== confirmPassword
            }
            color="secondary"
          >
            {t('buttons.confirm')}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
