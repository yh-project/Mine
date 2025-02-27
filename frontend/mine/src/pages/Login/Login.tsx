/** @jsxImportSource @emotion/react */
import React, { useState, useCallback } from 'react';
import { useLoginCheck } from '../../hooks/useLoginCheck';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UserLogin } from '../../apis/loginApi';
import { Palette } from 'oyc-ds/dist/themes/lightTheme';
import { Button, Typography, TextField } from 'oyc-ds';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import {
  loginBtnCss,
  errmsgCss,
  fieldCss,
  loginformCss,
  logoCss,
  signupBtnCss,
  pwfindCss,
  failmsgCss,
  passwordCss,
  IconCss,
} from './Login.styles';

interface ColorInfo {
  email: Palette;
  password: Palette;
}
const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
const passwordCheck = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/; // 영문, 숫자, 8글자 이상

const Login = () => {
  useLoginCheck();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const nav = useNavigate();
  const [emailvalidation, setEmailValidation] = useState<boolean>(true);
  const [passwordvalidation, setPasswordValidation] = useState<boolean>(false);
  const [loginResult, setLoginResult] = useState<string>('');
  const [hide, setHide] = useState<boolean>(true);
  const [color, setColor] = useState<ColorInfo>({
    email: 'primary',
    password: 'primary',
  });

  const onToggleHide = () => {
    setHide((prevHide) => !prevHide);
  };

  const EmailValidation = useCallback(async () => {
    if (emailCheck.test(email)) {
      setEmailValidation(true);
      setColor((prevColor) => ({
        ...prevColor,
        email: 'success',
      }));
    } else {
      setEmailValidation(false);
      setColor((prevColor) => ({
        ...prevColor,
        email: 'danger',
      }));
    }
  }, [email]);

  const PasswordValidation = useCallback(async () => {
    if (passwordCheck.test(password)) {
      setPasswordValidation(true);
      setColor((prevColor) => ({
        ...prevColor,
        password: 'success',
      }));
    } else {
      setPasswordValidation(false);
      setColor((prevColor) => ({
        ...prevColor,
        password: 'danger',
      }));
    }
  }, [password]);

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await UserLogin(email, password);
      localStorage.setItem('isLoggedIn', 'true');
      queryClient.clear();
      nav('/');
    } catch (err) {
      console.log('에러:', err);
      setLoginResult(
        '이메일 또는 비밀번호가 잘못되었습니다.\n아이디와 비밀번호를 정확히 입력해주세요.',
      );
    }
  };

  return (
    <div css={loginformCss}>
      <Typography color="primary" size="xl" weight="bold" css={logoCss}>
        Mine
      </Typography>
      <form>
        <div css={fieldCss}>
          <TextField
            color={color.email}
            defaultValue=""
            label="이메일 주소"
            maxRows={10}
            placeholder="abc@mail.com"
            type="text"
            variant="outlined"
            onChange={emailChange}
            onKeyUp={EmailValidation}
            required
          />
          {!emailvalidation && email ? (
            <Typography
              css={errmsgCss}
              color="danger"
              size="xs"
              weight="medium"
            >
              올바른 이메일을 입력해주세요.
            </Typography>
          ) : null}
        </div>
        <div css={fieldCss}>
          <div css={passwordCss}>
            <TextField
              color={color.password}
              defaultValue=""
              label="비밀번호"
              maxRows={10}
              placeholder="영문, 숫자 포함 8글자 이상"
              type={hide ? 'password' : 'text'}
              variant="outlined"
              onChange={passwordChange}
              onKeyUp={PasswordValidation}
            />
            <div
              style={{
                position: 'absolute',
                right: '0.625rem',
                top: '55%',
                transform: 'translateY(-50%)',
              }}
            >
              {hide ? (
                <EyeSlashIcon css={IconCss} onClick={onToggleHide} />
              ) : (
                <EyeIcon css={IconCss} onClick={onToggleHide} />
              )}
            </div>
          </div>
          {!passwordvalidation && password ? (
            <Typography
              css={errmsgCss}
              color="danger"
              size="xs"
              weight="medium"
            >
              영문, 숫자 포함 8자 이상 입력해주세요.
            </Typography>
          ) : null}
        </div>
        {loginResult ? (
          <Typography css={failmsgCss} color="danger" size="xs" weight="medium">
            {loginResult}
          </Typography>
        ) : null}
        <div css={loginBtnCss}>
          <Button
            color="primary"
            size="md"
            variant="contained"
            type="submit"
            onClick={handleLogin}
            disabled={passwordvalidation && emailvalidation ? false : true}
          >
            로그인
          </Button>
        </div>
      </form>
      <div css={signupBtnCss}>
        <Button
          color="primary"
          size="md"
          variant="outlined"
          onClick={() => nav('/user/signup')}
        >
          회원가입
        </Button>
      </div>
      <Typography
        css={pwfindCss}
        color="secondary"
        size="xs"
        weight="medium"
        onClick={() => nav('/user/findpassword')}
      >
        비밀번호 찾기
      </Typography>
    </div>
  );
};

export default Login;
