/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const modalCss = css`
  overflow-y: scroll;
  height: 100vh;
  background-color: #fff;
`;

export const containerCss = css`
  padding: 1rem;
`;

export const bottomCss = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.5rem;
  position: sticky;
  bottom: 0;
  padding: 0.75rem;
  border-top: 0.0625rem solid #e6e6e6;
  background-color: #fff;
`;

export const textContainerCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const categoryCss = css`
  margin-bottom: 0.5rem;
`;

export const typeCss = css`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;
