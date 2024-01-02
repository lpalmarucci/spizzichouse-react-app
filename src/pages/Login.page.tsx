import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title.component';
import { useSignIn } from 'react-auth-kit';
import useFetch from '../hooks/useFetch';
import { LoginResponse } from '../models/Login';
import { useNavigate } from 'react-router-dom';
import { ApiEndpoint } from '../models/constants';

const LoginPage = () => {
  const { t } = useTranslation();
  const signIn = useSignIn();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const fetchData = useFetch();
  const navigate = useNavigate();

  function handleLogin() {
    fetchData<LoginResponse>(ApiEndpoint.login, 'post', {
      body: JSON.stringify({ username, password }),
    }).then((data) => {
      if (
        signIn({
          token: data.access_token,
          tokenType: 'Bearer',
          authState: data,
          //TODO
          // get this data from the response
          expiresIn: 1695939469,
        })
      ) {
        navigate('/');
      }
    });
  }

  return (
    <div className=" w-full h-[100dvh] dark text-foreground bg-background flex justify-center items-center">
      <div className="flex flex-col gap-8">
        <Title>{t('appName')}</Title>
        <form className="flex flex-col gap-4">
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
          <Button onClick={handleLogin} color="primary">
            {t('buttons.login')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
