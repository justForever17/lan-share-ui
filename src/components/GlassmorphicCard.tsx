import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const GlassmorphicCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Card>{children}</Card>;
};

export default GlassmorphicCard;
