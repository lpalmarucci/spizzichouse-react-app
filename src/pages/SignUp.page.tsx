import Title from '../components/Title.component.tsx';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.tsx';
import ApiEndpoints from '../costants/ApiEndpoints.ts';

function SignUpPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firstname, setFirstname] = useState<string>();
  const [lastname, setLastname] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const fetch = useFetch();

  async function handleSignUp() {
    await fetch(ApiEndpoints.createUser, 'POST', {
      body: JSON.stringify({ firstname, lastname, username, password }),
    });

    navigate('/login');
  }

  return (
    <div className=" w-full h-[100dvh] dark text-foreground bg-background flex justify-center items-center">
      <div className="w-full max-w-xs flex flex-col gap-8">
        <Title className="text-center">{t('appName')}</Title>
        <form className="flex flex-col gap-4">
          <Input
            type="text"
            label={t('labels.firstname')}
            value={firstname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstname(e.target.value)
            }
          />
          <Input
            type="text"
            label={t('labels.lastname')}
            value={lastname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastname(e.target.value)
            }
          />
          <Input
            type="text"
            label={t('labels.username')}
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <Input
            type="password"
            label={t('labels.password')}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <Button onClick={handleSignUp} color="primary">
            {t('buttons.signup')}
          </Button>
        </form>
        <div className="relative text-gray-400">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-400"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2">Or continue with</span>
          </div>
        </div>
        <Button variant="bordered" onClick={() => navigate('/login')}>
          {t('buttons.login')}
        </Button>
      </div>
    </div>
  );
}

export default SignUpPage;
