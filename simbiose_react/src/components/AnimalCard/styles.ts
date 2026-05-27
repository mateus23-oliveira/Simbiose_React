import styled from "styled-components";

export const Card = styled.div`
  background: #0b1a0b;
  border: 1px solid #1a2e1a;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-4px);
    border-color: #2d4a2d;
  }
`;

export const Thumb = styled.img`
  width: 100%;
  height: 190px;
  object-fit: cover;
  display: block;
`;

export const DownloadBtn = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: rgba(5, 14, 5, 0.75);
  backdrop-filter: blur(6px);
  color: #4ade80;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #16a34a;
    color: white;
  }
`;

export const Info = styled.div`
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Name = styled.h2`
  color: white;
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
`;

export const Desc = styled.p`
  color: #3d5c3d;
  font-size: 13px;
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Meta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MetaTag = styled.span`
  background: #0f1f0f;
  border: 1px solid #1a2e1a;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 12px;
  color: #4ade80;
  font-family: 'DM Mono', monospace;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 4px;
`;

export const EditBtn = styled.button`
  flex: 1;
  padding: 9px;
  border: 1px solid #1a2e1a;
  border-radius: 10px;
  background: transparent;
  color: #6b9a6b;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: 0.2s;

  &:hover { background: #112211; color: white; }
`;

export const DeleteBtn = styled.button`
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 10px;
  background: rgba(153, 27, 27, 0.12);
  color: #f87171;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: 0.2s;

  &:hover { background: rgba(153, 27, 27, 0.25); }
`;