/** @jsxImportSource @emotion/react */
import React, { useState,useEffect } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getUserAvatars, getUserInfo } from '../../../apis/mypageApi';
import { Button, Toggle, Typography } from 'oyc-ds';
import {
  avatarContainerCss,
  conversationCss,
  numberdayCss,
  toggleContainerCss,
} from './style';
import { containerCss } from './style';
import Avatar3D from '../../../components/atoms/Avatar3D';
import useDialog from '../../../hooks/useDialog';

const HomeFetch = () => {
  const { alert, confirm } = useDialog();
  const [userQuery, avatarQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['userinfo'], queryFn: async () => await getUserInfo() },
      { queryKey: ['avatarinfo'], queryFn: async () => await getUserAvatars() },
    ],
  });

  [userQuery, avatarQuery].some((query) => {
    if (query.error && !query.isFetching) {
      throw query.error;
    }
  });

  const [isOn, setIsOn] = useState<boolean>(true);
  const [clickCount, setClickCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    console.log(clickCount);

    if (newClickCount === 10) {
      alert(`이스터에그 달성! 캐릭터 그만 때리세요!`);
    }
  };
  const handleMouseDown = () => {
    console.log('Character pressed');
    setEventCount(0);
    setShowMessage(false);
  };

  const handleMouseEnterLeave = () => {
    setEventCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount >= 20) {
        setShowMessage(true);
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (showMessage) {
      alert('캐릭터가 너무 많이 회전해서 어지러워요!');
    }
  }, [showMessage]);
  return (
    <>
      <div css={containerCss}>
        <Typography color="dark" css={numberdayCss}>
          반가워{' '}
          <Typography color="dark" size="xl" style={{ display: 'inline' }}>
            {userQuery.data.data.nickname}
          </Typography>
          <br />
          {avatarQuery.data.data.length === 0 ? (
            ''
          ) : (
            <>
              난 너의 비서{' '}
              <Typography color="dark" size="xl" style={{ display: 'inline' }}>
                {avatarQuery.data.data[0].avatarName}
              </Typography>{' '}
              이야
            </>
          )}
        </Typography>
        <div css={toggleContainerCss}>
          <Typography color="dark" size="md" weight="medium">
            {isOn ? '음성 켜기' : '음성 끄기'}
          </Typography>
          <Toggle
            color="primary"
            size="md"
            onClick={() => (isOn ? setIsOn(false) : setIsOn(true))}
          />
        </div>
        <div
          css={avatarContainerCss}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnterLeave}
          onMouseLeave={handleMouseEnterLeave}
          onClick={handleClick}
        >
          <Avatar3D
            avatarModel={
              avatarQuery.data.data.length
                ? avatarQuery.data.data[0].isMain
                  ? avatarQuery.data.data[0].avatarModel
                  : avatarQuery.data.data[1].avatarModel
                : 'pig'
            }
          />
        </div>
        <div css={conversationCss}>
          <Typography color="dark" size="md">
            {avatarQuery.data.data.length === 0
              ? '너만의 비서를 만들어봐!!'
              : '오늘도 보러 와줘서 고마워!!'}
          </Typography>
          {!avatarQuery.data.data.length && <Button>아바타 생성</Button>}
        </div>
      </div>
    </>
  );
};

export default HomeFetch;
