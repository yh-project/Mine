/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import EditQnA from '../EditQnA';
import { controlBtnCss, editBtnCss, editListCss } from './style';
import { Button, Typography, Icon } from 'oyc-ds';
import { HashtagIcon } from '@heroicons/react/24/solid';
import { NotificationContext } from '../../../../utils/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  getAnswers,
  getQuestions,
  updateQnA,
} from '../../../../apis/mypageApi';
import {
  IAnswer,
  IAnswerData,
  INewAnswer,
  IQuestion,
} from '../../../../types/qnaType';

interface IAvatarQnAEditFetchProps {
  avatarId: number;
  questionType: string;
}

const AvatarQnAEditFetch = ({
  avatarId,
  questionType,
}: IAvatarQnAEditFetchProps) => {
  const [questionQuery, answerQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['questions'], queryFn: () => getQuestions() },
      { queryKey: ['answers'], queryFn: () => getAnswers(avatarId) },
    ],
  });

  [questionQuery, answerQuery].some((query) => {
    if (query.error && !query.isFetching) {
      throw query.error;
    }
  });

  const notificationContext = useContext(NotificationContext);
  const nav = useNavigate();
  const [index, setIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [editTarget, setEditTarget] = useState<INewAnswer[]>([]);

  useEffect(() => {
    setQuestions(
      questionQuery.data.data.filter((q: IQuestion) => q.type === questionType),
    );
    setAnswers(
      answerQuery.data.data.filter(
        (a: IAnswer) => a.questionType === questionType,
      ),
    );
  }, []);

  useEffect(() => {
    const newAns: INewAnswer[] = [];

    questions.map((q: IQuestion, idx: number) => {
      newAns.push({
        questionResId: answers[idx].questionResId,
        questionId: q.questionId,
        isNew: false,
        newAns: questionType === 'c' ? -1 : '',
      });
    });

    setEditTarget([...newAns]);
  }, [questions]);

  const handleTarget = useCallback(
    (Qidx: number, isNew: boolean, newAns: number | string) => {
      setEditTarget((prev) => {
        const newTarget = [...prev];
        newTarget[Qidx] = {
          ...newTarget[Qidx],
          isNew: isNew,
          newAns: newAns,
        };
        return [...newTarget];
      });
    },
    [],
  );

  const handleResponse = useCallback(
    (Qidx: number, ans: number | string) => {
      handleTarget(
        Qidx,
        !(
          answers[Qidx].answer ==
          (questionType === 'c' ? Number(ans) + 1 : String(ans))
        ),
        questionType === 'c' ? Number(ans) + 1 : String(ans),
      );
    },
    [answers],
  );

  const handleSubmit = async () => {
    const answerDatas: IAnswerData[] = [];

    editTarget.map((target: INewAnswer, idx: number) => {
      if (target.isNew) {
        answerDatas.push({
          questionResId: target.questionResId,
          questionChoiceId: questionType === 'c' ? target.newAns : null,
          subjectiveAns: questionType === 's' ? target.newAns : null,
        });
        setAnswers((prev) => {
          const oldAnswers = [...prev];
          oldAnswers[idx].answer = target.newAns;
          return oldAnswers;
        });
      }
    });

    await updateQnA(avatarId, answerDatas)
      .then(() => {
        notificationContext.handle(
          'contained',
          'success',
          `${questionType === 'c' ? '설문조사' : '질의응답'}가 성공적으로 변경되었습니다`,
        );
        nav('/mypage', { state: { step: 2 } });
      })
      .catch(() => {
        notificationContext.handle('contained', 'danger', '다시 시도해주세요');
      });
  };

  return (
    <>
      {questions.map((q: IQuestion, idx: number) => {
        return (
          <EditQnA
            key={idx}
            question={q}
            answer={answers[idx]}
            qidx={idx}
            invisible={index !== idx}
            handleResponse={handleResponse}
          />
        );
      })}
      <div css={controlBtnCss}>
        <Button
          color="secondary"
          onClick={() => setIndex((index) => index - 1)}
          disabled={index === 0}
        >
          <Typography size="sm" color="light">
            이전
          </Typography>
        </Button>
        <Button
          onClick={() => {
            setIndex((index) => index + 1);
          }}
          disabled={index === questions.length - 1}
        >
          <Typography size="sm" color="light">
            다음
          </Typography>
        </Button>
      </div>
      <div css={editBtnCss}>
        <div
          css={editListCss(
            editTarget.filter((v: INewAnswer) => v.isNew).length,
          )}
        >
          <Icon color="primary">
            <HashtagIcon />
          </Icon>
          <Typography color="dark" size="sm">
            {editTarget.map((v: INewAnswer, i: number) =>
              v.isNew ? `${i + 1}번 ` : '',
            )}
          </Typography>
        </div>
        <Button
          fullWidth
          disabled={editTarget.filter((v: INewAnswer) => v.isNew).length === 0}
          onClick={handleSubmit}
        >
          수정하기
        </Button>
      </div>
    </>
  );
};

export default AvatarQnAEditFetch;
