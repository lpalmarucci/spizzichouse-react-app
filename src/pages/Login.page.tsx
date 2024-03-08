import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title.component';
import { useSignIn } from 'react-auth-kit';
import useFetch from '../hooks/useFetch';
import { AuthData } from '../models/Auth.ts';
import { useNavigate } from 'react-router-dom';
import ApiEndpoints from '../costants/ApiEndpoints.ts';

const LoginPage = () => {
  const { t } = useTranslation();
  const signIn = useSignIn();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const fetchData = useFetch();
  const navigate = useNavigate();

  function handleLogin() {
    fetchData<AuthData>(ApiEndpoints.login, 'POST', {
      body: JSON.stringify({ username, password }),
    }).then((data) => {
      if (
        signIn({
          token: data.access_token,
          tokenType: 'Bearer',
          authState: data,
          expiresIn: data.expiresIn,
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
          <Button
            isDisabled={username === '' || password === ''}
            onClick={handleLogin}
            color="primary"
          >
            {t('buttons.login')}
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
        <Button variant="bordered" onClick={() => navigate('/signup')}>
          {t('buttons.signup')}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
